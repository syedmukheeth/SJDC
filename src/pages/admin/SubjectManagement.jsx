import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '', course: 'BCA' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('subjects').select('*').order('name');
    if (data) setSubjects(data);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        const { error } = await supabase.from('subjects').update(formData).eq('id', editingSubject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('subjects').insert([formData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      setEditingSubject(null);
      setFormData({ name: '', course: 'BCA' });
      fetchSubjects();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this subject?')) {
      const { error } = await supabase.from('subjects').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchSubjects();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Subject Management</h1>
          <p className="text-gray-500 mt-1">Configure subjects and course assignments.</p>
        </div>
        <Button onClick={() => { setEditingSubject(null); setFormData({ name: '', course: 'BCA' }); setIsModalOpen(true); }}>
          Add New Subject
        </Button>
      </header>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Course</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-gray-800">{subject.name}</td>
                  <td className="px-8 py-6">
                    <span className="bg-blue-50 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                      {subject.course}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-3">
                    <button 
                      onClick={() => { setEditingSubject(subject); setFormData(subject); setIsModalOpen(true); }}
                      className="text-primary hover:underline font-bold text-xs uppercase"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(subject.id)}
                      className="text-red-600 hover:underline font-bold text-xs uppercase"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Subject Name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Assign to Course</label>
            <select 
              value={formData.course}
              onChange={(e) => setFormData({...formData, course: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
              <option value="BSc-CS">BSc-CS</option>
            </select>
          </div>
          <Button type="submit" className="w-full py-3 mt-4">
            {editingSubject ? 'Update Subject' : 'Save Subject'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectManagement;
