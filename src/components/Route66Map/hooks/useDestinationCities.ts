
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
        console.log('🏛️ ULTRA SIMPLE: Fetching destination cities...');
        
        const { data, error } = await (supabase as any)
          .from('destination_cities')
          .select('id, name, state, latitude, longitude, description, image_url, featured');

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

        console.log(`🏛️ ULTRA SIMPLE: Fetched ${data.length} destination cities`);

        // ULTRA SIMPLE: Apply basic ordering without complex validation
        const orderedCities = SequenceOrderService.getOrderedDestinationCities(data);
        
        console.log('🎯 ULTRA SIMPLE: Final destination cities sequence:');
        orderedCities.slice(0, 10).forEach((city, index) => {
          console.log(`  ${index + 1}. ${city.name}, ${city.state}`);
        });

        // Skip complex metadata validation that could cause loops
        console.log('✅ ULTRA SIMPLE: Cities ordered successfully - no validation barriers');

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
