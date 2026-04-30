import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { COURSES, SECTIONS } from '../../utils/constants';

const StudentManagement = () => {
  const { addToast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', course: 'BCA', section: 'A' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('students').select('*').order('name');
    if (data) setStudents(data);
    if (error) addToast(error.message, 'error');
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingStudent) {
        const { error } = await supabase
          .from('students')
          .update({
            name: formData.name,
            email: formData.email,
            course: formData.course,
            section: formData.section
          })
          .eq('id', editingStudent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('students')
          .insert([formData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      setEditingStudent(null);
      setFormData({ name: '', email: '', course: 'BCA', section: 'A' });
      fetchStudents();
      addToast(editingStudent ? '✨ Student profile updated' : '🎉 New student enrolled successfully!');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student record? This cannot be undone.')) {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) addToast(error.message, 'error');
      else {
        addToast('Student record removed', 'success');
        fetchStudents();
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-8 animate-fade-in pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tight">Student Management</h1>
          <p className="text-gray-500 font-medium mt-1">Total Enrolled: <span className="text-primary font-bold">{students.length}</span></p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>
          <Button onClick={() => { setEditingStudent(null); setFormData({ name: '', email: '', course: 'BCA', section: 'A' }); setIsModalOpen(true); }} className="shadow-lg shadow-primary/20">
            Enrol Student
          </Button>
        </div>
      </header>

      <Card className="border-none shadow-2xl shadow-gray-200/50 overflow-hidden rounded-[32px]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Course Info</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold animate-pulse">Loading records...</td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold">No students found matching your search.</td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="group hover:bg-primary/[0.02] transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-primary text-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            {student.name.charAt(0)}
                          </div>
                          <p className="font-black text-gray-800 tracking-tight">{student.name}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-primary text-sm">{student.course}</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Section {student.section}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-gray-500 font-bold text-sm">{student.email}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={() => { setEditingStudent(student); setFormData(student); setIsModalOpen(true); }}
                            className="p-2 hover:bg-primary/10 rounded-xl text-primary transition-colors"
                            title="Edit Profile"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id)}
                            className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors"
                            title="Delete Record"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingStudent ? '✏️ Edit Student Profile' : '🎓 Enrol New Student'}
      >
        <form onSubmit={handleSave} className="space-y-6 pt-4">
          <Input 
            label="FULL NAME" 
            placeholder="e.g. John Doe"
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <Input 
            label="EMAIL ADDRESS" 
            type="email"
            placeholder="student@sjcknl.edu.in"
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">COURSE</label>
              <div className="relative group">
                <select 
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl outline-none focus:border-primary focus:bg-white focus:shadow-xl focus:shadow-primary/5 transition-all font-bold text-gray-700 appearance-none cursor-pointer pr-10"
                >
                  {COURSES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                </select>
                <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-[10px] group-focus-within:text-primary group-focus-within:opacity-100 transition-all">▼</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">SECTION</label>
              <div className="relative group">
                <select 
                  value={formData.section}
                  onChange={(e) => setFormData({...formData, section: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl outline-none focus:border-primary focus:bg-white focus:shadow-xl focus:shadow-primary/5 transition-all font-bold text-gray-700 appearance-none cursor-pointer pr-10"
                >
                  {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
                <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-[10px] group-focus-within:text-primary group-focus-within:opacity-100 transition-all">▼</span>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full py-5 rounded-2xl shadow-2xl shadow-primary/30 text-sm uppercase tracking-[0.2em] font-black mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all">
            {loading ? 'Processing...' : editingStudent ? 'Update Profile' : 'Confirm Enrollment'}
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default StudentManagement;
