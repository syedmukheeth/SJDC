import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

const Home = () => {
  const { user, role } = useAuth();

  const getDashboardPath = () => {
    if (!role) return '/login';
    return `/${role}/dashboard`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black text-primary tracking-tighter">
          SJDC<span className="text-accent">.</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-600 uppercase tracking-widest">
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#courses" className="hover:text-primary transition-colors">Courses</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
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
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-accent/10 rounded-full">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">Admissions Open 2026</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-primary leading-[0.9] tracking-tighter">
              Empowering <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Next-Gen</span> <br />
              Leaders.
            </h1>
            <p className="text-xl text-gray-500 max-w-md font-medium leading-relaxed">
              St. Joseph's Degree College provides a transformative educational experience focused on innovation, discipline, and excellence.
            </p>
            <div className="flex items-center space-x-4 pt-4">
              <Button className="px-10 py-4 text-lg shadow-2xl shadow-primary/30">Apply Now</Button>
              <Button variant="outline" className="px-10 py-4 text-lg">Explore Courses</Button>
            </div>
          </div>
          <div className="relative md:h-[600px] bg-gray-100 rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-right duration-1000">
             {/* Placeholder for Hero Image */}
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
             <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white font-black text-xl">98%</div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Placement Success</p>
                    <p className="text-sm font-bold text-gray-800">Top Multi-National Companies</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <p className="text-5xl font-black text-secondary mb-2">2500+</p>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Students enrolled</p>
          </div>
          <div>
            <p className="text-5xl font-black text-secondary mb-2">120+</p>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Expert Faculty</p>
          </div>
          <div>
            <p className="text-5xl font-black text-secondary mb-2">15+</p>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Partners</p>
          </div>
          <div>
            <p className="text-5xl font-black text-secondary mb-2">A++</p>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">NAAC Accredited</p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-32 max-w-7xl mx-auto px-8">
        <div className="text-center mb-20 space-y-4">
          <p className="text-xs font-black text-accent uppercase tracking-[0.2em]">Academic Excellence</p>
          <h2 className="text-5xl font-black text-primary tracking-tighter">Premier Degree Programs</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {['BCA', 'BBA', 'B.Com'].map((course) => (
            <div key={course} className="group p-10 bg-gray-50 rounded-[40px] border-2 border-transparent hover:border-accent/20 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl font-black text-primary mb-8 group-hover:scale-110 transition-transform">
                {course.charAt(0)}
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-4">{course}</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-8">
                In-depth curriculum designed for modern industry standards and practical skills.
              </p>
              <a href="#" className="text-sm font-black text-primary uppercase tracking-widest flex items-center group-hover:text-accent transition-colors">
                Learn More 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8 text-center space-y-8">
          <div className="text-3xl font-black text-primary tracking-tighter">
            SJDC<span className="text-accent">.</span>
          </div>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Leading the way in higher education through innovation, integrity, and inspiration.
          </p>
          <div className="flex justify-center space-x-6 text-gray-400">
             {/* Social Links Placeholder */}
          </div>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
            © 2026 St. Joseph's Degree College. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
