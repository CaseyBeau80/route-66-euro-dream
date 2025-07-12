import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Attraction } from '@/components/Route66Map/types/attractions';

export const useAttractions = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        console.log('🎯 Fetching attractions from attractions table...');
        
        const { data, error } = await supabase
          .from('attractions')
          .select('*')
          .order('name');

        if (error) {
          console.error('❌ Error fetching attractions:', error);
          return;
        }

        console.log(`✅ Fetched ${data?.length || 0} attractions from database`);
        
        // Debug: Log all attraction names to see what we have
        if (data) {
          console.log('🔍 ALL ATTRACTIONS IN DATABASE:');
          data.forEach((attraction, index) => {
            console.log(`  ${index + 1}. "${attraction.name}" in ${attraction.city_name}, ${attraction.state}`);
            console.log(`     Coordinates: ${attraction.latitude}, ${attraction.longitude}`);
          });
          
          // Specifically look for the missing attractions
          const waterfalls = data.find(a => a.name.toLowerCase().includes('waterfall'));
          const shoalCreek = data.find(a => a.name.toLowerCase().includes('shoal creek'));
          
          console.log('🔍 LOOKING FOR SPECIFIC ATTRACTIONS:');
          console.log('  The Waterfalls:', waterfalls ? `FOUND - ${waterfalls.name}` : 'NOT FOUND');
          console.log('  Shoal Creek Overlook:', shoalCreek ? `FOUND - ${shoalCreek.name}` : 'NOT FOUND');
          
          if (waterfalls) {
            console.log(`    Waterfalls details: lat=${waterfalls.latitude}, lng=${waterfalls.longitude}, city=${waterfalls.city_name}`);
          }
          if (shoalCreek) {
            console.log(`    Shoal Creek details: lat=${shoalCreek.latitude}, lng=${shoalCreek.longitude}, city=${shoalCreek.city_name}`);
          }
        }
        
        setAttractions(data || []);
      } catch (error) {
        console.error('❌ Error in fetchAttractions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []);

  return { attractions, loading };
};