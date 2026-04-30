import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserChange(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserChange(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserChange = async (user) => {
    setUser(user);
    if (user) {
      const userRole = await fetchUserRole(user.id);
      setRole(userRole);
    } else {
      setRole(null);
    }
    setLoading(false);
  };

  const fetchUserRole = async (userId) => {
    console.log('🔍 Fetching role for user ID:', userId);
    
    // Retry logic: sometimes RLS takes a moment to recognize the session
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`🔄 Retry attempt ${attempt}...`);
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Check Admins table
        const { data: admin, error: adminErr } = await supabase.from('admins').select('role').eq('user_id', userId).maybeSingle();
        if (admin) {
          console.log('✅ Found in Admins table');
          return 'admin';
        }

        // Check Faculty table
        const { data: faculty, error: facultyErr } = await supabase.from('faculty').select('id').eq('user_id', userId).maybeSingle();
        if (faculty) {
          console.log('✅ Found in Faculty table');
          return 'faculty';
        }

        // Check Students table
        const { data: student, error: studentErr } = await supabase.from('students').select('id').eq('user_id', userId).maybeSingle();
        if (student) {
          console.log('✅ Found in Students table');
          return 'student';
        }
      } catch (err) {
        console.error(`❌ Attempt ${attempt} failed:`, err);
      }
    }

    console.warn('⚠️ No profile found after retries for ID:', userId);
    return null;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
