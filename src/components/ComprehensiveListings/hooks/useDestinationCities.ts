
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
        // Fetching destination cities with images
        
        const { data: cities, error } = await supabase
          .from('destination_cities')
          .select('*')
          .limit(6);

        if (!error && cities) {
          // Fetched cities successfully
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
        }
      } catch (error) {
        console.error('❌ Error fetching destination cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationCities();
  }, []);

  return { items, loading };
};
