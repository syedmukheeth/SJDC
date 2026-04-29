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

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('students').select('*').order('name');
    if (data) setStudents(data);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        const { error } = await supabase
          .from('students')
          .update(formData)
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
      addToast(editingStudent ? 'Student updated successfully!' : 'Student added successfully!');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) addToast(error.message, 'error');
      else {
        addToast('Student deleted successfully');
        fetchStudents();
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Student Management</h1>
          <p className="text-gray-500 mt-1">Manage student profiles and enrollment.</p>
        </div>
        <Button onClick={() => { setEditingStudent(null); setFormData({ name: '', email: '', course: 'BCA', section: 'A' }); setIsModalOpen(true); }}>
          Add New Student
        </Button>
      </header>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Course / Section</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-800">{student.name}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-bold text-primary">{student.course}</span>
                      <span className="text-gray-300 mx-2">|</span>
                      <span className="text-gray-500">Sec {student.section}</span>
                    </td>
                    <td className="px-8 py-6 text-gray-600 text-sm">{student.email}</td>
                    <td className="px-8 py-6 text-right space-x-3">
                      <button 
                        onClick={() => { setEditingStudent(student); setFormData(student); setIsModalOpen(true); }}
                        className="text-primary hover:underline font-bold text-xs uppercase"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:underline font-bold text-xs uppercase"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Full Name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <Input 
            label="Email Address" 
            type="email"
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Course</label>
              <select 
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
              >
                {COURSES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Section</label>
              <select 
                value={formData.section}
                onChange={(e) => setFormData({...formData, section: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
              >
                {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full py-3 mt-4">
            {editingStudent ? 'Update Student' : 'Save Student'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentManagement;
