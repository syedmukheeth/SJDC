import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// A handful of teacher portraits for the "My Classes" section placeholder
import teacher0 from '../../assets/img/teachers/0.jpg';
import teacher4 from '../../assets/img/teachers/4.jpg';
import teacher7 from '../../assets/img/teachers/7.jpg';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Mark Attendance',
      desc: 'Quickly mark attendance for your scheduled classes today.',
      btn: 'Select Class',
      btnVariant: 'primary',
      href: '/faculty/mark',
      icon: '✅',
    },
    {
      title: 'View Reports',
      desc: 'Analyze and export attendance data for your subjects.',
      btn: 'Open Reports',
      btnVariant: 'outline',
      href: '/faculty/reports',
      icon: '📈',
    },
  ];

  const recentFaculty = [
    { img: teacher0, name: 'Dr. A. Srinivasa Rao', subject: 'Mathematics', sessions: 24 },
    { img: teacher4, name: 'Ms. P. Shahnaz', subject: 'English Literature', sessions: 18 },
    { img: teacher7, name: 'Mr. T. Mohan Reddy', subject: 'Physics', sessions: 21 },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-black text-primary tracking-tight">Faculty Portal</h1>
        <p className="text-gray-500">Welcome back, <span className="font-bold text-primary">{user?.email?.split('@')[0]}</span>. Here's your overview for today.</p>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map(({ title, desc, btn, btnVariant, href, icon }) => (
          <Card key={title} className="p-6 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
                  {icon}
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-800">{title}</h2>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
              <Button variant={btnVariant} onClick={() => navigate(href)}>
                {btn}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Faculty / Department Snapshot */}
      <Card>
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-800">Department Snapshot</h2>
          <p className="text-sm text-gray-400 mt-1">A quick look at colleague activity this semester.</p>
        </div>
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-50">
            {recentFaculty.map(({ img, name, subject, sessions }) => (
              <li key={name} className="flex items-center space-x-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <img
                  src={img}
                  alt={name}
                  className="w-12 h-12 rounded-2xl object-cover shadow-md"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm">{name}</p>
                  <p className="text-xs text-gray-400">{subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-primary">{sessions}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sessions</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-center space-x-4">
        <div className="text-4xl">🎓</div>
        <div>
          <p className="font-black text-primary text-sm">SJDC Attendance Policy</p>
          <p className="text-gray-500 text-xs mt-1">Students must maintain a minimum of <strong className="text-primary">75% attendance</strong> per subject to be eligible for final examinations.</p>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
