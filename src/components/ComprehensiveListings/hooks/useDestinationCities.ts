
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ListingItem } from '../types';
import { generateTags } from '../utils/tagGenerator';

export const useDestinationCities = () => {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinationCities = async () => {
      try {
        console.log('🏙️ [DEBUG] Starting to fetch destination cities with images...');
        console.log('🔗 [DEBUG] Supabase client status:', !!supabase);
        
        const { data: cities, error } = await supabase
          .from('destination_cities')
          .select('*')
          .limit(6);
        
        console.log('📊 [DEBUG] Supabase response:', { cities, error, count: cities?.length });

        if (!error && cities) {
          console.log(`🏙️ [DEBUG] Successfully fetched ${cities.length} destination cities`);
          console.log('🏙️ [DEBUG] City names:', cities.map(c => `${c.name}, ${c.state}`));
          
          const springfieldMO = cities.find(c => c.name === 'Springfield' && c.state === 'MO');
          console.log('🔍 [DEBUG] Springfield, MO found:', !!springfieldMO, springfieldMO);
          
          setItems(cities.map(city => ({
            id: city.id,
            name: city.name,
            description: city.description,
            city_name: city.name,
            state: city.state,
            image_url: city.image_url,
            website: city.website,
            latitude: city.latitude,
            longitude: city.longitude,
            category: 'destination_cities',
            tags: generateTags(city, 'destination_cities'),
            population: city.population,
            founded_year: city.founded_year,
            featured: city.featured
          })));
        } else {
          console.error('❌ [DEBUG] Supabase error or empty data:', error);
        }
      } catch (error) {
        console.error('❌ [DEBUG] Exception fetching destination cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationCities();
  }, []);

  return { items, loading };
};
