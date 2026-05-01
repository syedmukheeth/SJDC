import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

// Official SJDC Assets
import logoPrimary from '../assets/img/logo-primary.png';
import logoFooter from '../assets/img/logo-footer.png';
import heroBanner from '../assets/img/banner/4.jpg';
import coursesBCA from '../assets/img/courses/mecs.jpg';
import coursesBBA from '../assets/img/courses/bbc.jpg';
import coursesBCom from '../assets/img/courses/bcom.jpg';
import courseMPC from '../assets/img/courses/mpcs.jpg';
import courseMBC from '../assets/img/courses/mbc.jpg';
import courseMECS from '../assets/img/courses/mecs.jpg';

// Creator Portraits
import creatorMukheeth from '../assets/img/students/mukheeth.jpeg';
import creatorFarooq from '../assets/img/students/farooq.jpeg';

// Department Head Portraits
import facultyPrincipal from '../assets/img/Head-persons/1.jpg';
import facultyCSHOD from '../assets/img/Head-persons/ComputerScience_SLathaRani.jpg';
import facultyEnglish from '../assets/img/Head-persons/English_P_Shahnaz.jpg';
import facultyMaths from '../assets/img/Head-persons/Mathematics_T_MohanReddy.jpg';
import facultyPhysics from '../assets/img/Head-persons/Physics_DrKSRChandarSekharRao.jpg';
import facultyCommerce from '../assets/img/Head-persons/Nagaraju(commerece).jpg';
import facultyIT from '../assets/img/Head-persons/Satyanarayana(IT).jpg';
import facultyLibrary from '../assets/img/Head-persons/Library_SRafia.jpg';

const courses = [
  {
    name: 'BCA',
    full: 'Bachelor of Computer Applications',
    img: coursesBCA,
    desc: 'A tech-forward program designed for future software engineers, data scientists, and digital entrepreneurs.',
  },
  {
    name: 'BBA',
    full: 'Bachelor of Business Administration',
    img: coursesBBA,
    desc: 'Build leadership and managerial skills for the corporate world through practical and industry-driven coursework.',
  },
  {
    name: 'B.Com',
    full: 'Bachelor of Commerce',
    img: coursesBCom,
    desc: 'A comprehensive commerce education covering accounting, finance, and trade to launch a thriving career.',
  },
  {
    name: 'MPC',
    full: 'Maths, Physics & Chemistry',
    img: courseMPC,
    desc: 'A rigorous science stream preparing students for engineering and technology careers.',
  },
  {
    name: 'MBC',
    full: 'Maths, Biology & Chemistry',
    img: courseMBC,
    desc: 'The ideal blend of biology and physical sciences for aspiring medical and life-science professionals.',
  },
  {
    name: 'MECS',
    full: 'Maths, Economics, Commerce & Science',
    img: courseMECS,
    desc: 'An interdisciplinary program for students aiming at finance, economics, and analytical career paths.',
  },
];

const Home = () => {
  const { user, role } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const getDashboardPath = () => {
    if (!role) return '/login';
    return `/${role}/dashboard`;
  };

  return (
    <div className="min-h-screen bg-white font-sans">


      {/* ── Hero Section ── */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        {/* Background Banner Image */}
        <img
          src={heroBanner}
          alt="SJDC Campus"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 h-full flex items-center">
          <div className="space-y-8 animate-fade-in max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-secondary/20 border border-secondary/40 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-[11px] font-black text-secondary uppercase tracking-widest">Admissions Open 2026–27</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter drop-shadow-lg">
              Empowering <br />
              <span className="text-secondary">Next-Gen</span> <br />
              Leaders.
            </h1>
            <p className="text-lg text-white/80 max-w-md font-medium leading-relaxed">
              St. Joseph's Degree College, Kurnool — where innovation, discipline, and excellence converge to shape tomorrow's changemakers.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#courses">
                <Button className="px-10 py-4 text-lg shadow-2xl shadow-black/30">Explore Programs</Button>
              </a>
              <Link to="/login">
                <Button variant="outline" className="px-10 py-4 text-lg border-white text-white hover:bg-white/10">
                  Student Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Badge */}
        <div className="absolute bottom-8 right-8 z-10 hidden md:flex items-center space-x-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
          {[
            { val: '2500+', label: 'Students' },
            { val: '120+', label: 'Faculty' },
            { val: 'A++', label: 'NAAC' },
            { val: '50+', label: 'Years' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center px-4 border-r border-white/20 last:border-0">
              <p className="text-2xl font-black text-secondary">{val}</p>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { val: '2500+', label: 'Students Enrolled' },
            { val: '120+', label: 'Expert Faculty' },
            { val: '15+', label: 'Global Partners' },
            { val: 'A++', label: 'NAAC Accredited' },
          ].map(({ val, label }) => (
            <div key={label}>
              <p className="text-5xl font-black text-secondary mb-2">{val}</p>
              <p className="text-xs font-black text-white/50 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="py-32 max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="text-xs font-black text-accent uppercase tracking-[0.2em]">Our Legacy</p>
            <h2 className="text-5xl font-black text-primary tracking-tighter leading-tight">
              50+ Years of <br />Academic Excellence
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              Founded on the principles of integrity and innovation, St. Joseph's Degree College, Kurnool (SJDC) is a premier institution affiliated with Yogi Vemana University. We have nurtured generations of leaders, scientists, and entrepreneurs.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Accredited <strong className="text-primary">A++ by NAAC</strong>, SJDC offers a holistic education that goes beyond textbooks — fostering critical thinking, leadership, and social responsibility.
            </p>
            <a href="#courses">
              <Button variant="outline" className="mt-4">Explore Our Programs →</Button>
            </a>
          </div>
          <div className="relative h-[480px] rounded-[40px] overflow-hidden shadow-2xl">
            <img
              src={heroBanner}
              alt="SJDC Campus"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Est. 1966 · Kurnool, A.P.</p>
              <p className="font-bold text-primary text-lg">St. Joseph's Degree College</p>
              <p className="text-sm text-gray-500">Affiliated with Yogi Vemana University</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses Section ── */}
      <section id="courses" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20 space-y-4">
            <p className="text-xs font-black text-accent uppercase tracking-[0.2em]">Academic Excellence</p>
            <h2 className="text-5xl font-black text-primary tracking-tighter">Premier Degree Programs</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Choose from a wide range of UG programs, each designed to equip you with the skills and knowledge to excel in your chosen field.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.name}
                className="group bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.img}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <span className="text-white text-2xl font-black">{course.name}</span>
                  </div>
                </div>
                {/* Course Info */}
                <div className="p-7 space-y-3">
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest">{course.full}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{course.desc}</p>
                  <a
                    href="#contact"
                    className="text-sm font-black text-primary uppercase tracking-widest flex items-center group-hover:text-accent transition-colors pt-2"
                  >
                    Enquire Now
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Faculty Section ── */}
      <section id="faculty" className="py-32 max-w-7xl mx-auto px-8">
        <div className="text-center mb-20 space-y-4">
          <p className="text-xs font-black text-accent uppercase tracking-[0.2em]">Our People</p>
          <h2 className="text-5xl font-black text-primary tracking-tighter">Meet Our Department Heads</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Led by experienced academics and industry experts, our faculty brings decades of research and practical knowledge to shape every student's journey.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { img: facultyPrincipal,  name: 'Dr. Principal',           dept: 'Principal & Management' },
            { img: facultyCSHOD,      name: 'S. Latha Rani',           dept: 'Computer Science HOD' },
            { img: facultyMaths,      name: 'T. Mohan Reddy',          dept: 'Mathematics HOD' },
            { img: facultyPhysics,    name: 'Dr. K.S.R. Chandar Sekhar', dept: 'Physics HOD' },
            { img: facultyEnglish,    name: 'P. Shahnaz',              dept: 'English HOD' },
            { img: facultyCommerce,   name: 'Nagaraju',                dept: 'Commerce HOD' },
            { img: facultyIT,         name: 'Satyanarayana',           dept: 'Information Technology' },
            { img: facultyLibrary,    name: 'S. Rafia',                dept: 'Librarian' },
          ].map(({ img, name, dept }) => (
            <div
              key={name}
              className="group text-center space-y-4"
            >
              {/* Portrait */}
              <div className="relative mx-auto w-full aspect-square rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {/* Info */}
              <div>
                <p className="font-black text-gray-800 text-sm">{name}</p>
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-0.5">{dept}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="mt-20 bg-primary/5 border border-primary/10 rounded-3xl p-10 text-center space-y-4">
          <p className="text-xs font-black text-accent uppercase tracking-[0.2em]">120+ Expert Faculty</p>
          <h3 className="text-3xl font-black text-primary tracking-tight">Guided by the Best in the Field</h3>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Our faculty holds advanced degrees from premier institutions and brings real-world experience to the classroom — ensuring every student is industry-ready.
          </p>
        </div>
      </section>

      {/* ── Contact / CTA Section ── */}
      <section id="contact" className="py-32 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-8 text-center space-y-8">
          <p className="text-xs font-black text-secondary uppercase tracking-[0.3em]">Get in Touch</p>
          <h2 className="text-5xl font-black tracking-tighter leading-tight">
            Ready to Begin Your <br />
            <span className="text-secondary">Academic Journey?</span>
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
            Contact our admissions office or visit our campus in Kurnool. We're here to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/login">
              <Button className="bg-secondary text-primary hover:opacity-90 px-10 py-4 text-base font-black shadow-2xl">
                Access Student Portal
              </Button>
            </Link>
            <a href="tel:+918518221234">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-10 py-4 text-base">
                📞 Call Admissions
              </Button>
            </a>
          </div>
          <div className="pt-8 border-t border-white/10 text-white/50 text-sm space-y-1">
            <p>📍 8-3-5, Fort Road, Kurnool – 518 001, Andhra Pradesh, India</p>
            <p>✉️ info@sjcknl.edu.in &nbsp;|&nbsp; 🌐 www.sjcknl.edu.in</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
