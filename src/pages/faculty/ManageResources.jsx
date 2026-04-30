import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Upload, Trash2, FileText, Book, Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

import { useAuth } from '../../context/AuthContext';

const ManageResources = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [resources, setResources] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subject_id: '',
    category: 'syllabus',
    academic_year: new Date().getFullYear(),
    semester: 1,
    file: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Removed setMsg initial reset
      
      const { data: subData, error: subErr } = await supabase.from('subjects').select('*').order('name');
      if (subErr) throw subErr;
      setSubjects(subData || []);

      const { data: resData, error: resErr } = await supabase
        .from('resources')
        .select(`*, subjects(name)`)
        .order('created_at', { ascending: false });
      
      if (resErr) {
        if (resErr.code === 'PGRST116' || resErr.message.includes('not found')) {
          console.warn('Resources table not initialized yet.');
        } else {
          throw resErr;
        }
      }
      setResources(resData || []);
    } catch (error) {
      console.error('Fetch error:', error);
      addToast('Database sync error. Please initialize the resources table.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      addToast('File size must be less than 10MB', 'error');
      return;
    }
    setFormData({ ...formData, file });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.subject_id || !formData.title) {
      addToast('Please fill all fields and select a file', 'error');
      return;
    }

    try {
      setIsUploading(true);
      addToast('Uploading file...', 'info');

      // 1. Upload to Storage
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('resources')
        .upload(filePath, formData.file);

      if (storageError) throw storageError;

      // 2. Insert into Database
      const { error: dbError } = await supabase.from('resources').insert([{
        subject_id: formData.subject_id,
        title: formData.title,
        category: formData.category,
        file_path: filePath,
        file_size: formData.file.size,
        file_type: formData.file.type,
        academic_year: parseInt(formData.academic_year),
        semester: parseInt(formData.semester),
        uploaded_by: user.id
      }]);

      if (dbError) throw dbError;

      setMsg({ type: 'success', text: 'Resource uploaded successfully!' });
      setFormData({ ...formData, title: '', file: null });
      fetchData();
    } catch (error) {
      console.error('Upload error:', error);
      addToast(error.message || 'Failed to upload', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id, filePath) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      setLoading(true);
      // Delete from storage
      const { error: storageError } = await supabase.storage.from('resources').remove([filePath]);
      if (storageError) console.warn('Storage delete warning:', storageError);

      // Delete from DB
      const { error: dbError } = await supabase.from('resources').delete().eq('id', id);
      if (dbError) throw dbError;

      setMsg({ type: 'success', text: 'Resource deleted' });
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      addToast('Failed to delete resource', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Resources</h1>
        <p className="text-slate-500 mt-1">Upload syllabus and previous year papers for students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 p-6 border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> New Resource
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. OS Syllabus 2024"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.subject_id}
                  onChange={e => setFormData({ ...formData, subject_id: e.target.value })}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="syllabus">Syllabus</option>
                    <option value="pyq">PYQ</option>
                    <option value="notes">Notes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.academic_year}
                    onChange={e => setFormData({ ...formData, academic_year: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Upload File (PDF/Doc)</label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-blue-500 transition-colors group cursor-pointer">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-xs font-medium text-slate-500">
                      {formData.file ? formData.file.name : 'Click or drag to upload'}
                    </span>
                  </div>
                </div>
              </div>



              <Button type="submit" className="w-full py-3" disabled={isUploading}>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Upload Resource
              </Button>
            </form>
          </Card>
        </div>

        {/* Resources List */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Current Resources</h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-widest">
                {resources.length} Total
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {loading && resources.length === 0 ? (
                <div className="p-20 flex justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : resources.length > 0 ? (
                resources.map(res => (
                  <div key={res.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg ${res.category === 'syllabus' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {res.category === 'syllabus' ? <Book className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{res.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                            {res.subjects?.name}
                          </span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                            {res.academic_year}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(res.id, res.file_path)}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center space-y-2">
                  <FileText className="w-12 h-12 text-slate-200 mx-auto" />
                  <p className="text-slate-500 font-medium">No resources uploaded yet.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageResources;
