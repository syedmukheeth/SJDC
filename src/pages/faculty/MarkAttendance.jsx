import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const MarkAttendance = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { data, error } = await supabase.from('subjects').select('*');
    if (data) setSubjects(data);
    if (data?.length > 0) setSelectedSubject(data[0].id);
  };

  const fetchStudents = async () => {
    if (!selectedSubject) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Find the course for the selected subject
      const subject = subjects.find(s => s.id === selectedSubject);
      if (!subject) return;

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('course', subject.course)
        .eq('section', selectedSection)
        .order('name');

      if (error) throw error;
      
      // Initialize status as 'Present' for all
      setStudents(data.map(s => ({ ...s, status: 'Present' })));
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch students.' });
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
    setMessage({ type: '', text: '' });

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

      setMessage({ type: 'success', text: 'Attendance saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Mark Attendance</h1>
          <p className="text-gray-500 mt-1">Select class details to begin marking attendance.</p>
        </div>
        {message.text && (
          <div className={`px-4 py-2 rounded-lg text-sm font-bold animate-bounce ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
      </header>

      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur-sm sticky top-0 z-10 border-primary/10">
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Subject</label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 font-bold text-gray-700 focus:ring-2 focus:ring-primary outline-none"
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.course})</option>)}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Section</label>
            <select 
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 font-bold text-gray-700 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 font-bold text-gray-700 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="flex items-end">
            <Button onClick={fetchStudents} className="w-full py-2.5" disabled={loading}>
              {loading ? 'Fetching...' : 'Load Student List'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      {students.length > 0 ? (
        <Card>
          <CardHeader 
            title={`Attendance Sheet (${students.length} Students)`}
            subtitle="Toggle status for individual students or use bulk actions."
          />
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-end space-x-2">
            <Button variant="outline" className="text-xs" onClick={() => markAll('Present')}>Mark All Present</Button>
            <Button variant="danger" className="text-xs" onClick={() => markAll('Absent')}>Mark All Absent</Button>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Name</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-gray-800">{student.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{student.email}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                          student.status === 'Absent' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button 
                          variant={student.status === 'Present' ? 'danger' : 'primary'}
                          className="text-[10px] px-3 py-1 uppercase font-black"
                          onClick={() => toggleStatus(student.id)}
                        >
                          Mark {student.status === 'Present' ? 'Absent' : 'Present'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col items-center">
              <Button 
                className="px-16 py-4 text-lg shadow-2xl shadow-primary/30"
                onClick={saveAttendance}
                disabled={saving}
              >
                {saving ? 'Saving Records...' : 'Submit Attendance'}
              </Button>
              <p className="text-[10px] text-gray-400 mt-4 font-medium italic">
                Note: Once submitted, these records will be immediately visible to students.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        !loading && (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
            <div className="text-gray-300 mb-4 flex justify-center">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-400">No students found</h3>
            <p className="text-gray-400 mt-2">Select a subject and section then click 'Load Student List'.</p>
          </div>
        )
      )}
    </div>
  );
};

export default MarkAttendance;
