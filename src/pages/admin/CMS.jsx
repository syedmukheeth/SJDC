import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

const CMS = () => {
  const { addToast } = useToast();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase.from('website_content').select('*');
    if (error) addToast(error.message, 'error');
    else setContent(data || []);
    setLoading(false);
  };

  const handleUpdate = async (id, newContent) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('website_content')
        .update({ content: newContent, updated_at: new Date() })
        .eq('id', id);
      if (error) throw error;
      addToast('Content updated successfully!');
      fetchContent();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading CMS...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-3xl font-black text-primary tracking-tight">Website CMS</h1>
        <p className="text-gray-500">Manage your homepage content and public announcements.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content.length === 0 && (
          <div className="col-span-2 p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl">
            <p className="text-gray-400">No content found. Please initialize the `website_content` table.</p>
          </div>
        )}
        
        {content.map((item) => (
          <Card key={item.id}>
            <CardHeader title={item.section} subtitle={`Page: ${item.page}`} />
            <CardContent>
              <div className="space-y-4">
                <textarea 
                  className="w-full h-32 px-4 py-3 border-2 border-gray-100 rounded-2xl outline-none focus:border-primary transition-all font-medium text-gray-700"
                  value={item.content}
                  onChange={(e) => {
                    const newList = [...content];
                    const index = newList.findIndex(i => i.id === item.id);
                    newList[index].content = e.target.value;
                    setContent(newList);
                  }}
                />
                <Button 
                  onClick={() => handleUpdate(item.id, item.content)} 
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? 'Saving...' : 'Update Section'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary text-white">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-xl font-bold">Need to add new sections?</h3>
          <p className="text-gray-400 text-sm">New content sections must be initialized in the database schema first.</p>
          <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">Contact Support</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CMS;
