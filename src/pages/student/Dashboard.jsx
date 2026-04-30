import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Student Profile
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (studentError) throw studentError;
      setStudentInfo(student);

      // 2. Fetch Attendance Logs with Subject Details
      const { data: logs, error: logsError } = await supabase
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

      if (logsError) throw logsError;
      setAttendanceData(logs || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-500 animate-pulse">Loading your academic record...</p>
      </div>
    );
  }

  if (!studentInfo) {
    return (
      <Card className="p-8 text-center bg-red-50 border-red-100">
        <h2 className="text-xl font-bold text-red-600">Profile Not Found</h2>
        <p className="text-red-500 mt-2">We couldn't locate your student profile. Please contact the administrator.</p>
      </Card>
    );
  }

  // Calculate Stats
  const totalClasses = attendanceData.length;
  const presentCount = attendanceData.filter(log => log.status === 'Present').length;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  // Group by Subject
  const subjectWise = attendanceData.reduce((acc, log) => {
    const subjectName = log.subjects?.name || 'Unknown';
    if (!acc[subjectName]) {
      acc[subjectName] = { total: 0, present: 0 };
    }
    acc[subjectName].total += 1;
    if (log.status === 'Present') acc[subjectName].present += 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome & Student Info */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Academic Portal</h1>
          <p className="text-gray-500 mt-1">Viewing records for <span className="text-primary font-bold">{studentInfo.name}</span></p>
        </div>
        <div className="flex bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 divide-x divide-gray-100">
          <div className="pr-4">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Course</p>
            <p className="font-bold text-gray-800">{studentInfo.course}</p>
          </div>
          <div className="pl-4">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Section</p>
            <p className="font-bold text-gray-800">Section {studentInfo.section}</p>
          </div>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary to-blue-900 text-white border-none">
          <CardContent className="p-8">
            <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">Overall Attendance</p>
            <div className="flex items-baseline space-x-2 mt-4">
              <span className="text-5xl font-black">{attendancePercentage}%</span>
              <span className="text-blue-200 text-sm">{presentCount}/{totalClasses} Days</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Total Sessions</p>
            <p className="text-5xl font-black mt-4 text-gray-800">{totalClasses}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Present Count</p>
            <p className="text-5xl font-black mt-4 text-accent">{presentCount}</p>
          </CardContent>
        </Card>

        {/* Study Hub Shortcut */}
        <Card className="md:col-span-3 bg-white border-blue-100 hover:border-blue-300 transition-all cursor-pointer group" onClick={() => navigate('/student/resources')}>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-2xl group-hover:scale-110 transition-transform">
                📚
              </div>
              <div>
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Academic Resources</p>
                <h3 className="text-xl font-black text-gray-800">Study Hub</h3>
                <p className="text-xs text-gray-500 font-medium">Access syllabus, PYQs, and class notes instantly.</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:translate-x-1 transition-transform">
              →
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject-wise Table */}
        <Card>
          <CardHeader title="Subject Performance" subtitle="Breakdown of attendance per subject." />
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Subject</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Sessions</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Object.entries(subjectWise).length > 0 ? (
                    Object.entries(subjectWise).map(([name, data]) => (
                      <tr key={name} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-700">{name}</td>
                        <td className="px-6 py-4 text-center text-gray-600">{data.present}/{data.total}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-black ${
                            (data.present/data.total) < 0.75 ? 'text-red-600' : 'text-primary'
                          }`}>
                            {Math.round((data.present / data.total) * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">No subject data available yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity List */}
        <Card>
          <CardHeader title="Recent Activity" subtitle="Your latest attendance updates." />
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto">
              <ul className="divide-y divide-gray-50">
                {attendanceData.length > 0 ? (
                  attendanceData.slice(0, 10).map((log) => (
                    <li key={log.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                      <div className="space-y-1">
                        <p className="font-bold text-gray-800">{log.subjects?.name || 'General'}</p>
                        <p className="text-xs text-gray-400 font-medium">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        log.status === 'Absent' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {log.status}
                      </span>
                    </li>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center text-gray-400">
                    <p className="italic">No recent attendance recorded.</p>
                  </div>
                )}
              </ul>
            </div>
            {attendanceData.length > 10 && (
              <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                <button className="text-xs font-bold text-primary hover:underline">View Full History</button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
