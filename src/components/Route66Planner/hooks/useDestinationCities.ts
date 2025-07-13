
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
          .select('*');

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

        // Define Route 66 order from Chicago to Santa Monica
        const route66Order = [
          'Chicago', 'Joliet', 'Pontiac', 'Springfield, IL', 'St. Louis', 'Rolla', 
          'Lebanon', 'Springfield, MO', 'Joplin', 'Tulsa', 'Oklahoma City', 'Elk City',
          'Shamrock', 'Amarillo', 'Tucumcari', 'Santa Rosa', 'Santa Fe', 'Albuquerque',
          'Gallup', 'Holbrook', 'Winslow', 'Flagstaff', 'Williams', 'Seligman',
          'Kingman', 'Needles', 'Barstow', 'Santa Monica'
        ];

        // Sort cities according to Route 66 order
        const sortedCities = data.sort((a, b) => {
          const aKey = a.state === 'IL' && a.name === 'Springfield' ? 'Springfield, IL' :
                      a.state === 'MO' && a.name === 'Springfield' ? 'Springfield, MO' : a.name;
          const bKey = b.state === 'IL' && b.name === 'Springfield' ? 'Springfield, IL' :
                      b.state === 'MO' && b.name === 'Springfield' ? 'Springfield, MO' : b.name;
          
          const aIndex = route66Order.indexOf(aKey);
          const bIndex = route66Order.indexOf(bKey);
          
          // If both found in order, sort by their position
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          // If only one found, put it first
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          // If neither found, sort alphabetically
          return a.name.localeCompare(b.name);
        });

        console.log(`✅ Fetched ${sortedCities.length} destination cities in Route 66 order`);
        setDestinationCities(sortedCities);
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
