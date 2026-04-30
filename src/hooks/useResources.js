import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Senior-level hook for managing academic resources.
 * Handles fetching, filtering, and state management for Syllabus/PYQs.
 */
export const useResources = (filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { subjectId = 'all', category = 'syllabus', searchTerm = '' } = filters;

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('resources')
        .select(`
          *,
          subjects (
            id,
            name
          )
        `);

      // Apply dynamic filters
      if (subjectId !== 'all') {
        query = query.eq('subject_id', subjectId);
      }
      
      if (category) {
        query = query.eq('category', category);
      }

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data: res, error: err } = await query.order('created_at', { ascending: false });

      if (err) throw err;
      setData(res || []);
    } catch (err) {
      console.error('Hook Error [useResources]:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [subjectId, category, searchTerm]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchResources 
  };
};
