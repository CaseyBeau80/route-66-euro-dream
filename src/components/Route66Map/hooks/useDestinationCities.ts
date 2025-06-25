
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
        console.log('🏛️ ENHANCED: Fetching destination cities with SEQUENCE VALIDATION...');
        
        const { data, error } = await supabase
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

        console.log(`🏛️ ENHANCED: Fetched ${data.length} destination cities - applying sequence validation...`);

        // ENHANCED: Apply sequence validation and ordering
        const orderedCities = SequenceOrderService.getOrderedDestinationCities(data);
        
        // Log the final sequence for verification
        console.log('🎯 ENHANCED: Final destination cities sequence (PING-PONG PROOF):');
        orderedCities.forEach((city, index) => {
          console.log(`  ${index + 1}. ${city.name}, ${city.state} (${city.longitude.toFixed(2)}°)`);
        });

        // Validate critical sequence points
        const metadata = SequenceOrderService.createSequenceMetadata(orderedCities);
        console.log('📊 ENHANCED: Destination cities metadata:', metadata);
        
        if (metadata.springfieldSequence.includes('incorrect')) {
          console.error('🚨 PING-PONG ALERT in destination cities sequence!');
        } else {
          console.log('✅ ENHANCED: Springfield sequence verified - no ping-ponging will occur');
        }

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
    // ENHANCED: Helper to get sequence metadata
    getSequenceMetadata: () => SequenceOrderService.createSequenceMetadata(destinationCities)
  };
};
