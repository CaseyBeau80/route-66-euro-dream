
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
      console.log('💎 Fetching hidden gems from hidden_gems table AND specific attractions...');
      
      // Fetch from both tables in parallel
      const [hiddenGemsResult, specificAttractionsResult] = await Promise.all([
        supabase
          .from('hidden_gems')
          .select('*')
          .order('title'),
        supabase
          .from('attractions')
          .select('*')
          .or('name.ilike.%waterfalls%,name.ilike.%shoal creek%')
          .order('name')
      ]);

      if (hiddenGemsResult.error) {
        console.error('❌ Error fetching hidden gems:', hiddenGemsResult.error);
      }

      if (specificAttractionsResult.error) {
        console.error('❌ Error fetching specific attractions:', specificAttractionsResult.error);
      }

      const allGems: any[] = [];

      // Process hidden_gems data
      if (hiddenGemsResult.data) {
        console.log(`💎 Found ${hiddenGemsResult.data.length} items from hidden_gems table`);
        hiddenGemsResult.data.forEach(gem => {
          allGems.push({
            ...gem,
            source: 'hidden_gems'
          });
        });
      }

      // Process specific attractions data (format to match HiddenGem interface)
      if (specificAttractionsResult.data) {
        console.log(`🎯 Found ${specificAttractionsResult.data.length} specific attractions for hidden gem display`);
        specificAttractionsResult.data.forEach(attraction => {
          console.log(`🎯 Processing attraction: ${attraction.name} at ${attraction.latitude}, ${attraction.longitude}`);
          allGems.push({
            id: attraction.id,
            title: attraction.name, // Map name to title
            description: attraction.description,
            city_name: attraction.city_name,
            latitude: attraction.latitude,
            longitude: attraction.longitude,
            website: attraction.website,
            image_url: attraction.image_url,
            thumbnail_url: attraction.thumbnail_url,
            created_at: attraction.created_at,
            updated_at: attraction.updated_at,
            source: 'attractions'
          });
        });
      }

      console.log(`💎 Total items found: ${allGems.length}`);
      
      // Validate and process the data
      const validHiddenGems = allGems.filter(gem => {
        const lat = parseFloat(gem.latitude?.toString() || '0');
        const lng = parseFloat(gem.longitude?.toString() || '0');
        
        // Check for valid coordinates
        const isValidLat = lat >= -90 && lat <= 90 && lat !== 0;
        const isValidLng = lng >= -180 && lng <= 180 && lng !== 0;
        
        if (!isValidLat || !isValidLng) {
          console.warn(`⚠️ Invalid coordinates for ${gem.title}: lat=${lat}, lng=${lng}`);
          return false;
        }
        
        console.log(`✅ Valid coordinates for ${gem.title} (${gem.source}): lat=${lat}, lng=${lng}`);
        return true;
      }).map(gem => ({
        ...gem,
        latitude: parseFloat(gem.latitude?.toString() || '0'),
        longitude: parseFloat(gem.longitude?.toString() || '0')
      }));
      
      console.log(`💎 Valid hidden gems to display: ${validHiddenGems.length}`);
      validHiddenGems.forEach(gem => {
        console.log(`  - ${gem.title} (${gem.source}): ${gem.latitude}, ${gem.longitude}`);
      });

      // Specific logging for the locations you're looking for
      const waterfalls = validHiddenGems.find(gem => gem.title?.toLowerCase().includes('waterfalls'));
      const shoalCreek = validHiddenGems.find(gem => gem.title?.toLowerCase().includes('shoal creek'));
      
      if (waterfalls) {
        console.log(`🔍 Found "The Waterfalls" from ${waterfalls.source}: lat=${waterfalls.latitude}, lng=${waterfalls.longitude}`);
      } else {
        console.warn('⚠️ "The Waterfalls" not found in combined data');
      }
      
      if (shoalCreek) {
        console.log(`🔍 Found "Shoal Creek Overlook" from ${shoalCreek.source}: lat=${shoalCreek.latitude}, lng=${shoalCreek.longitude}`);
      } else {
        console.warn('⚠️ "Shoal Creek Overlook" not found in combined data');
      }
      
      setHiddenGems(validHiddenGems);
    } catch (error) {
      console.error('❌ Error in fetchHiddenGems:', error);
    } finally {
      setLoading(false);
    }
  };

  return { hiddenGems, loading };
};
