import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ListingItem } from '../types';
import { generateTags } from '../utils/tagGenerator';

// Define the expected city shape from the database
interface DestinationCityRow {
  id: string;
  name: string;
  description: string | null;
  state: string | null;
  image_url: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  population: number | null;
  founded_year: number | null;
  featured: boolean | null;
}

export const useDestinationCities = () => {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinationCities = async () => {
      try {
        console.log('🏙️ [DEBUG] Starting to fetch destination cities with images...');
        console.log('🔗 [DEBUG] Supabase client status:', !!supabase);
        
        // Use type assertion since table may not exist yet in generated types
        const { data: cities, error } = await (supabase as any)
          .from('destination_cities')
          .select('*')
          .limit(6);
        
        console.log('📊 [DEBUG] Supabase response:', { cities, error, count: cities?.length });

        if (!error && cities) {
          const typedCities = cities as DestinationCityRow[];
          console.log(`🏙️ [DEBUG] Successfully fetched ${typedCities.length} destination cities`);
          console.log('🏙️ [DEBUG] City names:', typedCities.map(c => `${c.name}, ${c.state}`));
          
          const springfieldMO = typedCities.find(c => c.name === 'Springfield' && c.state === 'MO');
          console.log('🔍 [DEBUG] Springfield, MO found:', !!springfieldMO, springfieldMO);
          
          setItems(typedCities.map(city => ({
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
        } else if (error) {
          // Table may not exist yet - this is expected
          console.log('🏙️ Destination cities table not available yet:', error.message);
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
