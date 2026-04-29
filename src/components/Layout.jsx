import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logoPrimary from '../assets/img/logo-primary.png';

// Creator Portraits
import creatorMukheeth from '../assets/img/students/mukheeth.jpeg';
import creatorFarooq from '../assets/img/students/farooq.jpeg';

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
      { name: 'Dashboard', path: '/student/dashboard', icon: '📊' },
      { name: 'Attendance History', path: '/student/history', icon: '📅' },
      { name: 'My Profile', path: '/student/profile', icon: '👤' },
    ],
    faculty: [
      { name: 'Dashboard', path: '/faculty/dashboard', icon: '📊' },
      { name: 'Mark Attendance', path: '/faculty/mark', icon: '✅' },
      { name: 'Reports', path: '/faculty/reports', icon: '📈' },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
      { name: 'Students', path: '/admin/students', icon: '🎓' },
      { name: 'Subjects', path: '/admin/subjects', icon: '📚' },
      { name: 'Reports', path: '/admin/reports', icon: '📈' },
      { name: 'CMS', path: '/admin/cms', icon: '🛠️' },
    ],
  };

  const currentNav = navItems[role] || [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-primary text-white hidden md:flex flex-col shadow-2xl shadow-black/20">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link to="/">
            <img
              src={logoPrimary}
              alt="SJDC"
              className="h-12 object-contain brightness-0 invert"
            />
          </Link>
        </div>

        {/* Role Badge */}
        <div className="px-4 py-3 bg-white/5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
            {role} Portal
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {currentNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                location.pathname === item.path
                  ? 'bg-secondary text-primary shadow-lg shadow-secondary/20'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom User Card */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary font-black text-sm shadow-md">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white rounded-xl transition-all duration-200 text-xs font-black uppercase tracking-widest"
          >
            Logout
          </button>
        </div>

        {/* Developed By */}
        <div className="px-6 pb-6 pt-2 space-y-3">
          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Developed by</p>
          <div className="flex flex-col space-y-2">
            <a 
              href="https://www.linkedin.com/in/syedmukheeth/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 transition-all duration-200"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-white/5 group-hover:border-secondary transition-colors shrink-0">
                <img src={creatorMukheeth} alt="Syed Mukheeth" className="w-full h-full object-cover object-[center_10%]" />
              </div>
              <span className="text-[9px] font-bold text-white/30 group-hover:text-secondary transition-colors">Syed Mukheeth</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/farooq-shaik-50a511354" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 transition-all duration-200"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-white/5 group-hover:border-secondary transition-colors shrink-0">
                <img src={creatorFarooq} alt="Farooq Shaik" className="w-full h-full object-cover object-[center_15%]" />
              </div>
              <span className="text-[9px] font-bold text-white/30 group-hover:text-secondary transition-colors">Farooq Shaik</span>
            </a>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 border-b border-gray-100">
          {/* Mobile: show logo */}
          <div className="md:hidden">
            <img src={logoPrimary} alt="SJDC" className="h-9 object-contain" />
          </div>
          {/* Desktop: page breadcrumb */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">System Live</span>
          </div>

          {/* User Info */}
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

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 text-gray-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
