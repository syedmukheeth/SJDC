import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

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
      // The role will be updated by the AuthProvider, so we need to wait for it or navigate based on it
      // For now, we'll use a small timeout or just let the app-wide redirection handle it if we have it in App.jsx
      // But usually, it's better to navigate directly after role is known
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // React to role change for redirection
  React.useEffect(() => {
    if (role) {
      navigate(`/${role}/dashboard`, { replace: true });
    }
  }, [role, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <Link to="/" className="text-xs font-black text-accent uppercase tracking-widest hover:underline mb-4 inline-block">← Back to Website</Link>
          <h1 className="text-3xl font-bold text-primary">SJDC Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your attendance</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="student@sjcknl.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button 
            type="submit" 
            className="w-full py-3" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-400">
            St. Joseph's Degree College, Kurnool
          </p>
          <div className="pt-4 border-t border-gray-50">
            <p className="text-xs text-gray-400 italic">
              Testing Tip: Use the credentials from your Supabase Auth dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
