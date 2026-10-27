
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { NativeAmericanSite } from './types';

export const useNativeAmericanSites = () => {
  const [sites, setSites] = useState<NativeAmericanSite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNativeAmericanSites();
  }, []);

  const fetchNativeAmericanSites = async () => {
    try {
      console.log('🪶 Fetching native american sites from native_american_sites table...');
      
      const { data, error } = await (supabase as any)
        .from('native_american_sites')
        .select('id,name,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,tribe_nation,site_type')
        .order('name');

      if (error) {
        console.error('❌ Error fetching native american sites:', error);
        return;
      }

      console.log(`🪶 Found ${data?.length || 0} items from native_american_sites table`);
      
      // Validate and process the data
      const validSites = (data || []).filter((site: any) => {
        const lat = parseFloat(site.latitude?.toString() || '0');
        const lng = parseFloat(site.longitude?.toString() || '0');
        
        // Check for valid coordinates
        const isValidLat = lat >= -90 && lat <= 90 && lat !== 0;
        const isValidLng = lng >= -180 && lng <= 180 && lng !== 0;
        
        if (!isValidLat || !isValidLng) {
          console.warn(`⚠️ Invalid coordinates for ${site.name}: lat=${lat}, lng=${lng}`);
          return false;
        }
        
        console.log(`✅ Valid coordinates for ${site.name}: lat=${lat}, lng=${lng}`);
        return true;
      }).map((site: any) => ({
        ...site,
        latitude: parseFloat(site.latitude?.toString() || '0'),
        longitude: parseFloat(site.longitude?.toString() || '0')
      }));
      
      console.log(`🪶 Valid native american sites to display: ${validSites.length}`);
      validSites.forEach((site: NativeAmericanSite) => {
        console.log(`  - ${site.name}: ${site.latitude}, ${site.longitude} (${site.tribe_nation || 'Unknown tribe'})`);
      });
      
      setSites(validSites);
    } catch (error) {
      console.error('❌ Error in fetchNativeAmericanSites:', error);
    } finally {
      setLoading(false);
    }
  };

  return { sites, loading };
};
