import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import studentAvatar from '../../assets/img/students/mukheeth.jpeg';

const StudentProfile = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('students')
        .update({ name: profile.name })
        .eq('user_id', user.id);
      if (error) throw error;
      addToast('Profile updated successfully!');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="animate-pulse p-8 text-center text-gray-400">Loading Profile...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-black text-primary tracking-tight">Your Profile</h1>
        <p className="text-gray-500 mt-1">Manage your academic and personal information.</p>
      </header>

      <Card>
        <CardHeader title="General Information" subtitle="Update your display name and view your course details." />
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative w-24 h-24 rounded-3xl overflow-hidden shadow-xl shadow-primary/20 border-2 border-primary/10">
                <img
                  src={studentAvatar}
                  alt={profile?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-primary flex items-center justify-center text-white text-4xl font-black" style={{ display: 'none' }}>
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Student Identity</p>
                <p className="text-xl font-bold text-gray-800">{profile?.name}</p>
                <p className="text-xs text-gray-400 mt-1 italic">Verified Student of SJDC</p>
                <span className="mt-2 inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest rounded-full">Active</span>
              </div>
            </div>

            <Input 
              label="Full Name" 
              value={profile?.name || ''} 
              onChange={(e) => setProfile({...profile, name: e.target.value})}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Course" value={profile?.course || ''} disabled className="bg-gray-50 opacity-70" />
              <Input label="Section" value={profile?.section || ''} disabled className="bg-gray-50 opacity-70" />
            </div>

            <Input label="Email Address" value={profile?.email || ''} disabled className="bg-gray-50 opacity-70" />

            <div className="pt-4">
              <Button type="submit" disabled={isUpdating} className="w-full py-3">
                {isUpdating ? 'Saving Changes...' : 'Save Profile Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-100 bg-red-50/30">
        <CardHeader title="Security" subtitle="Update your login credentials." />
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">To update your password, please use the "Forgot Password" link on the login page or contact support.</p>
          <Button variant="outline" disabled className="w-full">Change Password</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
