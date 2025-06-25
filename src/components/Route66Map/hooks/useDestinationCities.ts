
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DestinationCity {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  description?: string;
  image_url?: string;
  featured?: boolean;
}

export const useDestinationCities = () => {
  const [destinationCities, setDestinationCities] = useState<DestinationCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinationCities = async () => {
      try {
        console.log('🏛️ Fetching destination cities with PROPER ORDERING...');
        
        const { data, error } = await supabase
          .from('destination_cities')
          .select('id, name, state, latitude, longitude, description, image_url, featured')
          .order('longitude', { ascending: false }); // East to West ordering by longitude

        if (error) {
          console.error('❌ Error fetching destination cities:', error);
          setError(error.message);
          return;
        }

        if (!data || data.length === 0) {
          console.log('❌ No destination cities found');
          setError('No destination cities found');
          return;
        }

        // Additional manual sorting to ensure perfect Route 66 sequence
        const sortedCities = [...data].sort((a, b) => {
          // Manual ordering for key Route 66 cities to prevent ping-ponging
          const cityOrder = {
            'chicago': 1,
            'springfield': a.state === 'IL' ? 2 : 5, // Springfield, IL before Springfield, MO
            'st. louis': 3,
            'saint louis': 3,
            'joplin': 6,
            'tulsa': 7,
            'oklahoma city': 8,
            'amarillo': 9,
            'albuquerque': 10,
            'flagstaff': 11,
            'los angeles': 12,
            'santa monica': 13
          };

          const aOrder = cityOrder[a.name.toLowerCase()] || 99;
          const bOrder = cityOrder[b.name.toLowerCase()] || 99;

          if (aOrder !== 99 || bOrder !== 99) {
            return aOrder - bOrder;
          }

          // Fall back to longitude ordering for cities not in manual list
          return b.longitude - a.longitude;
        });

        console.log('🏛️ Destination cities loaded and sorted:', 
          sortedCities.map(city => `${city.name}, ${city.state} (${city.longitude.toFixed(2)})`));

        // Validate the sequence
        const hasChicago = sortedCities.some(city => city.name.toLowerCase().includes('chicago'));
        const hasSantaMonica = sortedCities.some(city => city.name.toLowerCase().includes('santa monica'));
        
        if (!hasChicago) {
          console.warn('⚠️ Chicago not found in destination cities');
        }
        if (!hasSantaMonica) {
          console.warn('⚠️ Santa Monica not found in destination cities');
        }

        setDestinationCities(sortedCities);
        
      } catch (err) {
        console.error('❌ Error in fetchDestinationCities:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinationCities();
  }, []);

  return { 
    destinationCities, 
    isLoading, 
    error,
    // Helper to get cities in reverse order if needed
    getReversedCities: () => [...destinationCities].reverse()
  };
};
