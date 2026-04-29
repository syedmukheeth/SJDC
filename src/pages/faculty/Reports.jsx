import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { COURSES } from '../../utils/constants';

const FacultyReports = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { data, error } = await supabase.from('subjects').select('*');
    if (error) addToast(error.message, 'error');
    else {
      setSubjects(data);
      if (data.length > 0) setSelectedSubject(data[0].id);
    }
  };

  const generateReport = async () => {
    if (!selectedSubject) return;
    setLoading(true);
    try {
      // 1. Fetch attendance for this subject
      const { data: attendance, error } = await supabase
        .from('attendance')
        .select(`
          status,
          students (id, name, section)
        `)
        .eq('subject_id', selectedSubject);

      if (error) throw error;

      // 2. Process Stats
      const studentStats = {};
      attendance.forEach(rec => {
        const student = rec.students;
        if (!studentStats[student.id]) {
          studentStats[student.id] = { name: student.name, section: student.section, total: 0, present: 0 };
        }
        studentStats[student.id].total += 1;
        if (rec.status === 'Present') studentStats[student.id].present += 1;
      });

      const processed = Object.values(studentStats).map(s => ({
        ...s,
        percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0
      }));

      setStats(processed.sort((a, b) => b.percentage - a.percentage));
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Subject Reports</h1>
          <p className="text-gray-500">Analyze attendance performance by subject.</p>
        </div>
      </header>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1 block">Select Subject</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl outline-none focus:border-primary transition-all font-bold text-gray-700"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.course})</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={generateReport} disabled={loading} className="px-8 h-[52px]">
                {loading ? 'Analyzing...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats && (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Section</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Present/Total</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Percentage</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800">{s.name}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">Sec {s.section}</td>
                      <td className="px-6 py-4 font-bold text-gray-600">{s.present}/{s.total}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[60px]">
                            <div 
                              className={`h-full rounded-full ${s.percentage < 75 ? 'bg-red-500' : 'bg-accent'}`}
                              style={{ width: `${s.percentage}%` }}
                            />
                          </div>
                          <span className="font-black text-sm text-gray-700">{s.percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {s.percentage < 75 ? (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest">Defaulter</span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">Safe</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FacultyReports;
