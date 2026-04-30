import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Book, FileText, Download, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

import { useResources } from '../../hooks/useResources';

const Resources = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [activeTab, setActiveTab] = useState('syllabus');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjects, setSubjects] = useState([]);

  const { data: filteredResources, loading, error } = useResources({
    subjectId: selectedSubject,
    category: activeTab,
    searchTerm
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data } = await supabase.from('subjects').select('*').order('name');
      setSubjects(data || []);
    };
    fetchSubjects();
  }, []);

  const handleDownload = async (filePath, title) => {
    try {
      const { data, error } = await supabase.storage
        .from('resources')
        .download(filePath);
      
      if (error) throw error;

      // Create a download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', title);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Study Hub</h1>
          <p className="text-slate-500 mt-1">Access your syllabus and previous year question papers.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'syllabus' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Book className="w-4 h-4" /> Syllabus
          </button>
          <button
            onClick={() => setActiveTab('pyq')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'pyq' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <FileText className="w-4 h-4" /> PYQs
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none bg-white"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            {subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/40 backdrop-blur-md rounded-2xl border border-slate-200/50 p-5 space-y-4 animate-pulse">
              <div className="flex justify-between">
                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                <div className="w-12 h-6 bg-slate-200 rounded-md" />
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2" />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <div className="w-16 h-4 bg-slate-200 rounded-md" />
                <div className="w-24 h-8 bg-slate-200 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res, index) => (
            <Card 
              key={res.id} 
              className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-slate-200/60 overflow-hidden bg-white/60 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-5 space-y-4 relative overflow-hidden">
                {/* Trending Badge */}
                {res.download_count > 10 && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-orange-500 text-white text-[8px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-lg animate-pulse tracking-tighter">
                      Trending 🔥
                    </div>
                  </div>
                )}
                <div className={`absolute -right-4 -top-4 w-20 h-20 blur-3xl opacity-10 rounded-full transition-colors duration-500 ${
                  activeTab === 'syllabus' ? 'bg-blue-600' : 'bg-indigo-600'
                }`} />
                
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl shadow-inner transition-transform duration-500 group-hover:scale-110 ${
                    activeTab === 'syllabus' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {activeTab === 'syllabus' ? <Book className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 bg-white/80 border border-slate-100 text-slate-500 rounded-full uppercase tracking-widest shadow-sm">
                    {res.academic_year}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1 text-lg">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {res.subjects?.name || 'General'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    {formatFileSize(res.file_size)}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="bg-slate-50 hover:bg-blue-600 hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200 transition-all duration-300 rounded-xl font-bold text-xs uppercase tracking-widest gap-2"
                    onClick={() => handleDownload(res.file_path, res.title)}
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-md rounded-2xl border-2 border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center px-4">
          <div className="p-4 bg-slate-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No resources found</h3>
          <p className="text-slate-500 max-w-xs mt-1">
            We couldn't find any {activeTab === 'syllabus' ? 'syllabus' : 'question papers'} matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default Resources;
