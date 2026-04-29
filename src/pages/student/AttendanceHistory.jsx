import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

const AttendanceHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('All');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      
      // Get student ID first
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!student) return;

      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id,
          date,
          status,
          subjects (
            name
          )
        `)
        .eq('student_id', student.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setHistory(data || []);

      // Extract unique subjects for filter
      const uniqueSubjects = Array.from(new Set(data.map(log => log.subjects?.name).filter(Boolean)));
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error('Error fetching history:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = filterSubject === 'All' 
    ? history 
    : history.filter(log => log.subjects?.name === filterSubject);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-500 animate-pulse">Fetching full history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Attendance Logs</h1>
          <p className="text-gray-500 mt-1">Review every session marked for your profile.</p>
        </div>
        <div className="flex bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <select 
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 px-4 py-2 cursor-pointer"
          >
            <option value="All">All Subjects</option>
            {subjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </header>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Date</th>
                  <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Subject</th>
                  <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Status</th>
                  <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 font-medium text-gray-700">
                        {new Date(log.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-black text-gray-800">{log.subjects?.name}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                          log.status === 'Absent' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-[10px] font-mono text-gray-300">ID: {log.id.slice(0, 8)}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400">
                      <p className="text-lg font-medium">No records found</p>
                      <p className="text-sm mt-1">Try adjusting your filters or contact your lecturer.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceHistory;
