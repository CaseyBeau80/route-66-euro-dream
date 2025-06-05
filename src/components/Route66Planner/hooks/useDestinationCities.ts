
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DestinationCity } from '../types';

export const useDestinationCities = () => {
  const [destinationCities, setDestinationCities] = useState<DestinationCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinationCities = async () => {
      try {
        console.log("🏛️ Fetching destination cities for planner...");
        
        const { data, error } = await supabase
          .from('destination_cities')
          .select('*')
          .order('name');

        if (error) {
          console.error("❌ Error fetching destination cities:", error);
          setError(error.message);
          return;
        }

        if (!data || data.length === 0) {
          console.log("❌ No destination cities found");
          setError("No destination cities found");
          return;
        }

        console.log(`✅ Fetched ${data.length} destination cities for planner`);
        setDestinationCities(data);
      } catch (err) {
        console.error("❌ Error fetching destination cities:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinationCities();
  }, []);

  return { destinationCities, isLoading, error };
};
