import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

const AttendanceReports = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCourse, setFilterCourse] = useState('All');

  useEffect(() => {
    fetchReport();
  }, [filterCourse]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      // 1. Fetch all students
      let query = supabase.from('students').select('id, name, course, section');
      if (filterCourse !== 'All') query = query.eq('course', filterCourse);
      const { data: students } = await query;

      const studentMap = new Map();
      students.forEach(s => studentMap.set(s.id, { ...s, total: 0, present: 0 }));

      // 2. Fetch all attendance
      const { data: attendance } = await supabase.from('attendance').select('student_id, status');

      // 3. Process data in O(n)
      attendance.forEach(record => {
        if (studentMap.has(record.student_id)) {
          const stats = studentMap.get(record.student_id);
          stats.total += 1;
          if (record.status === 'Present') stats.present += 1;
        }
      });

      const processed = Array.from(studentMap.values()).map(s => ({
        ...s,
        percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0
      }));

      setReport(processed.sort((a, b) => a.percentage - b.percentage));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Attendance Reports</h1>
          <p className="text-gray-500 mt-1">Identify students with low attendance across courses.</p>
        </div>
        <select 
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary shadow-sm"
        >
          <option value="All">All Courses</option>
          <option value="BCA">BCA</option>
          <option value="BBA">BBA</option>
          <option value="BSc-CS">BSc-CS</option>
        </select>
      </header>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Sessions</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Percentage</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="p-12 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Generating Report...</td></tr>
              ) : report.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-800">{row.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{row.course} | Sec {row.section}</p>
                  </td>
                  <td className="px-8 py-6 text-center text-gray-600 font-medium">
                    {row.present} / {row.total}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`text-xl font-black ${row.percentage < 75 ? 'text-red-600' : 'text-primary'}`}>
                      {row.percentage}%
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {row.percentage < 75 ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Defaulter</span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Regular</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceReports;
