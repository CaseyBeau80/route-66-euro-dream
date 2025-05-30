
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HiddenGem } from './types';

export const useHiddenGems = () => {
  const [hiddenGems, setHiddenGems] = useState<HiddenGem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHiddenGems();
  }, []);

  const fetchHiddenGems = async () => {
    try {
      console.log('🔍 Fetching hidden gems from database...');
      const { data, error } = await supabase
        .from('hidden_gems')
        .select('*')
        .order('title');

      if (error) {
        console.error('Error fetching hidden gems:', error);
        return;
      }

      console.log(`✨ Found ${data?.length || 0} hidden gems`, data);
      setHiddenGems(data || []);
    } catch (error) {
      console.error('Error in fetchHiddenGems:', error);
    } finally {
      setLoading(false);
    }
  };

  return { hiddenGems, loading };
};
