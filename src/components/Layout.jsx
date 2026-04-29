import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = {
    student: [
      { name: 'Dashboard', path: '/student/dashboard' },
      { name: 'Attendance History', path: '/student/history' },
      { name: 'My Profile', path: '/student/profile' },
    ],
    faculty: [
      { name: 'Dashboard', path: '/faculty/dashboard' },
      { name: 'Mark Attendance', path: '/faculty/mark' },
      { name: 'Reports', path: '/faculty/reports' },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard' },
      { name: 'Students', path: '/admin/students' },
      { name: 'Subjects', path: '/admin/subjects' },
      { name: 'Reports', path: '/admin/reports' },
      { name: 'CMS', path: '/admin/cms' },
    ],
  };

  const currentNav = navItems[role] || [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white hidden md:flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-gray-700">
          SJDC Portal
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {currentNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-secondary text-primary' : 'hover:bg-gray-700'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 border-b border-gray-100">
          <div className="md:hidden font-bold text-primary">SJDC Portal</div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">System Live</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{role}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 text-gray-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
