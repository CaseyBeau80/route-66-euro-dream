
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SequenceOrderService } from '../services/SequenceOrderService';

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
        ;
        
        const { data, error } = await (supabase as any)
          .from('destination_cities')
          .select('id, name, state, latitude, longitude, description, image_url, featured');

        if (error) {
          console.error('❌ Error fetching destination cities:', error);
          setError(error.message);
          return;
        }

        if (!data || data.length === 0) {
          ;
          setError('No destination cities found');
          return;
        }

        ;

        // ULTRA SIMPLE: Apply basic ordering without complex validation
        const orderedCities = SequenceOrderService.getOrderedDestinationCities(data);
        
        ;
        orderedCities.slice(0, 10).forEach((city, index) => {
          ;
        });

        // Skip complex metadata validation that could cause loops
        ;

        setDestinationCities(orderedCities);
        
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
    getReversedCities: () => [...destinationCities].reverse(),
    // ULTRA SIMPLE: Helper that always returns valid metadata
    getSequenceMetadata: () => SequenceOrderService.createSequenceMetadata(destinationCities)
  };
};
