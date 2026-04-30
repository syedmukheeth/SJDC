import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

const MarkAttendance = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setSubjectsLoading(true);
    try {
      const { data, error } = await supabase.from('subjects').select('*').order('name');
      if (error) throw error;
      setSubjects(data || []);
      if (data?.length > 0) setSelectedSubject(data[0].id);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubjectsLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!selectedSubject) {
      addToast('Please select a subject first', 'warning');
      return;
    }
    
    setLoading(true);
    setStudents([]);
    
    try {
      const subject = subjects.find(s => s.id === selectedSubject);
      if (!subject) return;

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('course', subject.course)
        .eq('section', selectedSection)
        .order('name');

      if (error) throw error;
      
      setStudents(data.map(s => ({ ...s, status: 'Present' })));
      if (data.length === 0) addToast('No students found for this section.', 'info');
    } catch (err) {
      addToast('Failed to fetch students.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (id) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } : s
    ));
  };

  const markAll = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const saveAttendance = async () => {
    if (students.length === 0) return;
    
    setSaving(true);
    try {
      const attendanceRecords = students.map(s => ({
        student_id: s.id,
        subject_id: selectedSubject,
        date: date,
        status: s.status,
      }));

      const { error } = await supabase
        .from('attendance')
        .insert(attendanceRecords);

      if (error) {
        if (error.code === '23505') {
          throw new Error('Attendance for this subject and date has already been marked.');
        }
        throw error;
      }

      addToast('✨ Attendance saved successfully!', 'success');
      setStudents([]); // Clear after save
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <header>
        <h1 className="text-4xl font-black text-primary tracking-tight">Mark Attendance</h1>
        <p className="text-gray-500 font-medium mt-1">Daily attendance management system.</p>
      </header>

      <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[32px] overflow-hidden">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Subject</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                disabled={subjectsLoading}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-700 cursor-pointer disabled:opacity-50"
              >
                <option value="">{subjectsLoading ? 'Loading...' : '-- Select --'}</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.course})</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Section</label>
              <select 
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-700 cursor-pointer"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Date</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-700"
              />
            </div>

            <Button onClick={fetchStudents} className="h-[58px] rounded-2xl shadow-xl shadow-primary/20" disabled={loading || subjectsLoading}>
              {loading ? 'Fetching...' : 'Load Students'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {students.length > 0 ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-xl font-black text-gray-800 tracking-tight">Student List ({students.length})</h2>
            <div className="flex gap-2">
              <button onClick={() => markAll('Present')} className="px-4 py-2 bg-green-50 text-green-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-100 transition-colors">All Present</button>
              <button onClick={() => markAll('Absent')} className="px-4 py-2 bg-red-50 text-red-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-colors">All Absent</button>
            </div>
          </div>

          <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[32px] overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map((student) => (
                    <tr key={student.id} className="group hover:bg-primary/[0.02] transition-all duration-300">
                      <td className="px-8 py-6">
                        <p className="font-black text-gray-800 tracking-tight">{student.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{student.email}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          student.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => toggleStatus(student.id)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            student.status === 'Present' ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-primary/5 text-primary hover:bg-primary hover:text-white'
                          }`}
                        >
                          Mark {student.status === 'Present' ? 'Absent' : 'Present'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex flex-col items-center">
                <Button 
                  className="px-20 py-5 text-xl rounded-[24px] shadow-2xl shadow-primary/30"
                  onClick={saveAttendance}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Submit Attendance'}
                </Button>
                <p className="text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-[0.2em]">Records will be visible to students instantly</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        !loading && (
          <div className="py-24 text-center bg-white border-2 border-dashed border-gray-100 rounded-[40px] shadow-sm">
            <div className="text-6xl mb-6 opacity-20">📝</div>
            <h3 className="text-2xl font-black text-gray-300 tracking-tight">Ready to start?</h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Select subject and section then click 'Load Students'</p>
          </div>
        )
      )}
    </div>
  );
};

export default MarkAttendance;
