import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent } from '../../components/ui/Card';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    subjects: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // 1. Total Students
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      // 2. Total Faculty
      const { count: facultyCount } = await supabase
        .from('faculty')
        .select('*', { count: 'exact', head: true });

      // 3. Total Subjects
      const { count: subjectCount } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true });

      // 3. Overall Attendance Rate
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('status');
      
      let rate = 0;
      if (attendanceData?.length > 0) {
        const present = attendanceData.filter(a => a.status === 'Present').length;
        rate = Math.round((present / attendanceData.length) * 100);
      }

      setStats({
        students: studentCount || 0,
        faculty: facultyCount || 0,
        subjects: subjectCount || 0,
        attendanceRate: rate
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-black text-primary tracking-tight">Admin Overview</h1>
        <p className="text-gray-500 mt-1">Global statistics for the SJDC Portal.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg shadow-blue-500/5">
          <CardContent className="p-8">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Students</p>
            <p className="text-5xl font-black mt-2 text-primary">{stats.students}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg shadow-blue-500/5">
          <CardContent className="p-8">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Faculty</p>
            <p className="text-5xl font-black mt-2 text-gray-800">{stats.faculty}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg shadow-blue-500/5">
          <CardContent className="p-8">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subjects</p>
            <p className="text-5xl font-black mt-2 text-gray-800">{stats.subjects}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent to-emerald-600 text-white border-none shadow-xl shadow-accent/20">
          <CardContent className="p-8">
            <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Avg Attendance</p>
            <p className="text-5xl font-black mt-2">{stats.attendanceRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 bg-gray-50 border-dashed border-2 flex flex-col items-center justify-center min-h-[300px]">
          <div className="text-gray-300 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="font-bold text-gray-400">Attendance Trends Chart Coming Soon</p>
        </Card>

        <Card className="p-8 bg-gray-50 border-dashed border-2 flex flex-col items-center justify-center min-h-[300px]">
          <div className="text-gray-300 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <p className="font-bold text-gray-400">Course Distribution Chart Coming Soon</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
