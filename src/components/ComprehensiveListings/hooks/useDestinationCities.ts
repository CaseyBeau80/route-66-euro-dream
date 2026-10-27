import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
        ;
        ;
        
        // Use type assertion since table may not exist yet in generated types
        const { data: cities, error } = await (supabase as any)
          .from('destination_cities')
          .select('id,name,state,latitude,longitude,description,image_url,thumbnail_url,website,population,elevation_ft,founded_year,featured,status')
          .limit(6);
        
        ;

        if (!error && cities) {
          const typedCities = cities as DestinationCityRow[];
          ;
          ;
          
          const springfieldMO = typedCities.find(c => c.name === 'Springfield' && c.state === 'MO');
          ;
          
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
          ;
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
