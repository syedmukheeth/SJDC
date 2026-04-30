import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import logoPrimary from '../assets/img/logo-primary.png';
import heroBanner from '../assets/img/banner/5.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, role } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      // Wait for AuthProvider to update the role
      setTimeout(() => {
        if (!role) {
          setError('Account authorized, but no portal profile found. This usually means your account exists but hasn\'t been assigned a role yet.');
          setIsSubmitting(false);
        }
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (role) {
      navigate(`/${role}/dashboard`, { replace: true });
    }
  }, [role, navigate]);

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel: Branding ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden"
      >
        {/* Background */}
        <img
          src={heroBanner}
          alt="SJDC Campus"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-primary/50" />

        {/* Top Logo */}
        <div className="relative z-10 p-10">
          <Link to="/">
            <img src={logoPrimary} alt="SJDC" className="h-16 object-contain brightness-0 invert" />
          </Link>
        </div>

        {/* Center Copy */}
        <div className="relative z-10 px-12 pb-12 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-secondary/20 border border-secondary/40 rounded-full">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-[11px] font-black text-secondary uppercase tracking-widest">Secure Portal Access</span>
          </div>
          <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
            Your Academic <br />
            <span className="text-secondary">Records. Secured.</span>
          </h1>
          <p className="text-white/70 leading-relaxed">
            Access your attendance, courses, and academic profile — all in one place, secured by role-based authentication.
          </p>
          <div className="pt-4 border-t border-white/10 space-y-2 text-white/50 text-xs">
            <p>📍 Fort Road, Kurnool – 518 001, Andhra Pradesh</p>
            <p>🌐 www.sjcknl.edu.in</p>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
        {/* Mobile Logo */}
        <Link to="/" className="lg:hidden mb-8">
          <img src={logoPrimary} alt="SJDC" className="h-14 object-contain" />
        </Link>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-10 space-y-7">
          <div className="text-center space-y-1">
            <Link to="/" className="text-xs font-black text-accent uppercase tracking-widest hover:underline inline-block mb-4">
              ← Back to Website
            </Link>
            <h2 className="text-3xl font-black text-primary tracking-tight">Portal Login</h2>
            <p className="text-gray-400 text-sm">Sign in to manage your attendance</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              id="login-email"
              placeholder="student@sjcknl.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              id="login-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button
              type="submit"
              id="login-submit"
              className="w-full py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (role ? 'Redirecting...' : 'Checking profile...') : 'Sign In'}
            </Button>
          </form>

          <div className="text-center space-y-3 pt-2 border-t border-gray-50">
            <p className="text-sm text-gray-400">
              St. Joseph's Degree College, Kurnool
            </p>
            <p className="text-xs text-gray-300 italic">
              For credentials, contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
