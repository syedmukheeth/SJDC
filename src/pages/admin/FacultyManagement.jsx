import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

const FacultyManagement = () => {
  const { addToast } = useToast();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({ name: '', department: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('faculty').select('*').order('name');
    if (data) setFaculty(data);
    if (error) addToast(error.message, 'error');
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingFaculty) {
        const { error } = await supabase
          .from('faculty')
          .update({
            name: formData.name,
            department: formData.department
          })
          .eq('id', editingFaculty.id);
        if (error) throw error;
      } else {
        // For faculty, we usually need an Auth user. 
        // For this management tool, we'll just insert into the DB table.
        const { error } = await supabase
          .from('faculty')
          .insert([formData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      setEditingFaculty(null);
      setFormData({ name: '', department: '' });
      fetchFaculty();
      addToast(editingFaculty ? '✨ Faculty profile updated' : '🎉 New faculty member added!');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this faculty member?')) {
      const { error } = await supabase.from('faculty').delete().eq('id', id);
      if (error) addToast(error.message, 'error');
      else {
        addToast('Faculty member removed', 'success');
        fetchFaculty();
      }
    }
  };

  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-8 animate-fade-in pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tight">Faculty Management</h1>
          <p className="text-gray-500 font-medium mt-1">Total Faculty: <span className="text-primary font-bold">{faculty.length}</span></p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>
          <Button onClick={() => { setEditingFaculty(null); setFormData({ name: '', department: '' }); setIsModalOpen(true); }} className="shadow-lg shadow-primary/20">
            Add Faculty
          </Button>
        </div>
      </header>

      <Card className="border-none shadow-2xl shadow-gray-200/50 overflow-hidden rounded-[32px]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Faculty Member</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Department</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center text-gray-400 font-bold animate-pulse">Loading faculty...</td>
                  </tr>
                ) : filteredFaculty.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center text-gray-400 font-bold">No faculty members found.</td>
                  </tr>
                ) : (
                  filteredFaculty.map((f) => (
                    <tr key={f.id} className="group hover:bg-primary/[0.02] transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-primary text-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            {f.name.charAt(0)}
                          </div>
                          <p className="font-black text-gray-800 tracking-tight">{f.name}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg font-bold text-xs uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">
                          {f.department || 'General'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={() => { setEditingFaculty(f); setFormData(f); setIsModalOpen(true); }}
                            className="p-2 hover:bg-primary/10 rounded-xl text-primary transition-colors"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDelete(f.id)}
                            className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors"
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
      title={editingFaculty ? '✏️ Edit Faculty Member' : '👨‍🏫 Add New Faculty'}
    >
      <form onSubmit={handleSave} className="space-y-6 pt-4">
        <Input 
          label="FULL NAME" 
          placeholder="e.g. Dr. Satyanarayana"
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <Input 
          label="DEPARTMENT" 
          placeholder="e.g. Computer Science"
          value={formData.department} 
          onChange={(e) => setFormData({...formData, department: e.target.value})} 
          required 
        />
        <Button type="submit" disabled={loading} className="w-full py-4 rounded-2xl shadow-xl shadow-primary/20 text-lg mt-4">
          {loading ? 'Saving...' : editingFaculty ? 'Update Faculty' : 'Add Faculty Member'}
        </Button>
      </form>
    </Modal>
  </>
);
};

export default FacultyManagement;
