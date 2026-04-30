import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

const FacultyReports = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
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
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubjectsLoading(false);
    }
  };

  const generateReport = async () => {
    if (!selectedSubject) {
      addToast('Please select a subject first', 'warning');
      return;
    }
    setLoading(true);
    setStats(null);
    try {
      const { data: attendance, error } = await supabase
        .from('attendance')
        .select(`
          status,
          students (id, name, section)
        `)
        .eq('subject_id', selectedSubject);

      if (error) throw error;

      if (!attendance || attendance.length === 0) {
        addToast('No attendance records found for this subject.', 'info');
        setLoading(false);
        return;
      }

      const studentStats = {};
      attendance.forEach(rec => {
        const student = rec.students;
        if (!student || !student.id) return;
        
        if (!studentStats[student.id]) {
          studentStats[student.id] = { 
            name: student.name, 
            section: student.section, 
            total: 0, 
            present: 0 
          };
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
    <div className="space-y-8 animate-fade-in pb-12">
      <header>
        <h1 className="text-4xl font-black text-primary tracking-tight">Subject Reports</h1>
        <p className="text-gray-500 font-medium mt-1">Detailed attendance analytics and defaulter tracking.</p>
      </header>

      <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[32px] overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">
                Select Subject to Analyze
              </label>
              <div className="relative">
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={subjectsLoading}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-800 appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">{subjectsLoading ? 'Loading subjects...' : '-- Choose a Subject --'}</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.course})</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 font-black">
                  ▼
                </div>
              </div>
            </div>
            <Button 
              onClick={generateReport} 
              disabled={loading || !selectedSubject} 
              className="w-full md:w-auto px-10 h-[64px] rounded-2xl shadow-xl shadow-primary/20 text-lg"
            >
              {loading ? 'Analyzing Data...' : 'Generate Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {stats ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-[24px] shadow-sm border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Students</p>
              <p className="text-3xl font-black text-primary mt-1">{stats.length}</p>
            </div>
            <div className="p-6 bg-white rounded-[24px] shadow-sm border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Attendance</p>
              <p className="text-3xl font-black text-gray-800 mt-1">
                {Math.round(stats.reduce((acc, s) => acc + s.percentage, 0) / stats.length)}%
              </p>
            </div>
            <div className="p-6 bg-red-50 rounded-[24px] border border-red-100">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Defaulters (&lt;75%)</p>
              <p className="text-3xl font-black text-red-600 mt-1">
                {stats.filter(s => s.percentage < 75).length}
              </p>
            </div>
          </div>

          <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[32px] overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Section</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Attendance</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.map((s, i) => (
                      <tr key={i} className="group hover:bg-primary/[0.02] transition-all duration-300">
                        <td className="px-8 py-6">
                          <p className="font-black text-gray-800 tracking-tight">{s.name}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg font-bold text-xs uppercase tracking-widest">
                            Section {s.section}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden min-w-[120px]">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${s.percentage < 75 ? 'bg-red-500' : 'bg-primary'}`}
                                style={{ width: `${s.percentage}%` }}
                              />
                            </div>
                            <span className="font-black text-sm text-gray-700 w-12">{s.percentage}%</span>
                            <span className="text-xs text-gray-400 font-bold">({s.present}/{s.total})</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {s.percentage < 75 ? (
                            <span className="px-4 py-1.5 bg-red-100 text-red-700 rounded-xl text-[10px] font-black uppercase tracking-widest">Defaulter</span>
                          ) : (
                            <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-widest">Safe</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-100">
          <div className="text-5xl mb-4 opacity-20">📊</div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Select a subject and click generate to view analytics</p>
        </div>
      )}
    </div>
  );
};

export default FacultyReports;
