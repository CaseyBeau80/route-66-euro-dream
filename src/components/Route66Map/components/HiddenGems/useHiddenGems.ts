
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HiddenGem } from './types';

export const useHiddenGems = () => {
  const [hiddenGems, setHiddenGems] = useState<HiddenGem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHiddenGems();
  }, []);

  const fetchHiddenGems = async () => {
    try {
      console.log('💎 Fetching hidden gems from hidden_gems table only...');
      
      const { data, error } = await (supabase as any)
        .from('hidden_gems')
        .select('id,name,title,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,founded_year,year_opened')
        .order('title');

      if (error) {
        console.error('❌ Error fetching hidden gems:', error);
        return;
      }

      console.log(`💎 Found ${data?.length || 0} items from hidden_gems table`);
      
      // Validate and process the data
      const validHiddenGems = (data || []).filter(gem => {
        const lat = parseFloat(gem.latitude?.toString() || '0');
        const lng = parseFloat(gem.longitude?.toString() || '0');
        
        // Check for valid coordinates
        const isValidLat = lat >= -90 && lat <= 90 && lat !== 0;
        const isValidLng = lng >= -180 && lng <= 180 && lng !== 0;
        
        if (!isValidLat || !isValidLng) {
          console.warn(`⚠️ Invalid coordinates for ${gem.title}: lat=${lat}, lng=${lng}`);
          return false;
        }
        
        console.log(`✅ Valid coordinates for ${gem.title}: lat=${lat}, lng=${lng}`);
        return true;
      }).map(gem => ({
        ...gem,
        latitude: parseFloat(gem.latitude?.toString() || '0'),
        longitude: parseFloat(gem.longitude?.toString() || '0')
      }));
      
      console.log(`💎 Valid hidden gems to display: ${validHiddenGems.length}`);
      validHiddenGems.forEach(gem => {
        console.log(`  - ${gem.title}: ${gem.latitude}, ${gem.longitude}`);
      });
      
      setHiddenGems(validHiddenGems);
    } catch (error) {
      console.error('❌ Error in fetchHiddenGems:', error);
    } finally {
      setLoading(false);
    }
  };

  return { hiddenGems, loading };
};
