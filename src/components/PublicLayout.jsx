import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';

// Official SJDC Assets
import logoPrimary from '../assets/img/logo-primary.png';

// Creator Portraits
import creatorMukheeth from '../assets/img/students/mukheeth.jpeg';
import creatorFarooq from '../assets/img/students/farooq.jpeg';

const PublicLayout = () => {
  const { user, role } = useAuth();

  const getDashboardPath = () => {
    if (!role) return '/login';
    return `/${role}/dashboard`;
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <Link to="/">
            <img
              src={logoPrimary}
              alt="SJDC Logo"
              className="h-12 object-contain"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-600 uppercase tracking-widest">
            <Link to="/#about" className="hover:text-primary transition-colors">About</Link>
            
            {/* Departments Dropdown */}
            <div className="relative group py-4">
              <span className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                Departments <span className="text-[10px] opacity-50">▼</span>
              </span>
              <div className="absolute top-[80%] left-0 w-64 bg-white border border-gray-100 shadow-2xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 flex flex-col z-50">
                <Link to="/page/computer-science-department" className="px-4 py-3 text-xs text-gray-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors font-bold">Computer Science</Link>
                <Link to="/page/commercemgt-department" className="px-4 py-3 text-xs text-gray-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors font-bold">Commerce & Management</Link>
                <Link to="/page/botany-department" className="px-4 py-3 text-xs text-gray-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors font-bold">Botany</Link>
                <Link to="/page/chemistry-department" className="px-4 py-3 text-xs text-gray-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors font-bold">Chemistry</Link>
                <Link to="/page/electronics-department" className="px-4 py-3 text-xs text-gray-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors font-bold">Electronics</Link>
              </div>
            </div>

            <Link to="/#courses" className="hover:text-primary transition-colors">Courses</Link>
            <Link to="/#faculty" className="hover:text-primary transition-colors">Faculty</Link>
            <Link to="/#contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <div>
            {user ? (
              <Link to={getDashboardPath()}>
                <Button className="px-8 shadow-xl shadow-primary/20">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="px-8 shadow-xl shadow-primary/20">Portal Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Main Content Area ── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 border-t border-white/5">
        {/* Main Footer Grid */}
        <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div className="space-y-5">
            <img
              src={logoPrimary}
              alt="SJDC Logo"
              className="h-14 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              St. Joseph's Degree College, Kurnool — shaping futures through knowledge, integrity, and excellence since 1966.
            </p>
            <p className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-[10px] font-black text-secondary uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse inline-block" />
              <span>NAAC A++ Accredited</span>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Quick Links</p>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'About Us', href: '/#about' },
                { label: 'Courses & Programs', href: '/#courses' },
                { label: 'Student Portal', href: '/login' },
                { label: 'Contact Admissions', href: '/#contact' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-gray-400 hover:text-secondary transition-colors font-medium flex items-center space-x-2"
                  >
                    <span className="text-gray-700">›</span>
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Contact Us</p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-2">
                <span>📍</span>
                <span>8-3-5, Fort Road, Kurnool – 518 001, Andhra Pradesh, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>✉️</span>
                <span>info@sjcknl.edu.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🌐</span>
                <span>www.sjcknl.edu.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-8">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] text-center md:text-left">
              © 2026 St. Joseph's Degree College, Kurnool. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em]">Developed by</span>
              
              {/* Creator 1: Syed Mukheeth */}
              <a 
                href="https://www.linkedin.com/in/syedmukheeth/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-secondary transition-colors shrink-0">
                  <img 
                    src={creatorMukheeth} 
                    alt="Syed Mukheeth" 
                    className="w-full h-full object-cover object-[center_10%] group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <span className="text-[10px] font-black text-gray-500 group-hover:text-secondary uppercase tracking-widest">Syed Mukheeth</span>
              </a>

              <div className="w-px h-4 bg-white/5" />

              {/* Creator 2: Farooq Shaik */}
              <a 
                href="https://www.linkedin.com/in/farooq-shaik-50a511354" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-secondary transition-colors shrink-0">
                  <img 
                    src={creatorFarooq} 
                    alt="Farooq Shaik" 
                    className="w-full h-full object-cover object-[center_15%] group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <span className="text-[10px] font-black text-gray-500 group-hover:text-secondary uppercase tracking-widest">Farooq Shaik</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
