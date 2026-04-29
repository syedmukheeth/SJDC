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
    // Check Admins table
    const { data: admin } = await supabase.from('admins').select('role').eq('user_id', userId).single();
    if (admin) return 'admin';

    // Check Faculty table
    const { data: faculty } = await supabase.from('faculty').select('id').eq('user_id', userId).single();
    if (faculty) return 'faculty';

    // Check Students table
    const { data: student } = await supabase.from('students').select('id').eq('user_id', userId).single();
    if (student) return 'student';

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
