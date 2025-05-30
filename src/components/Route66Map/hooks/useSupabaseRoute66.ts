
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Route66Waypoint } from '../types/supabaseTypes';

export const useSupabaseRoute66 = () => {
  const [waypoints, setWaypoints] = useState<Route66Waypoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaypoints = async () => {
      try {
        console.log("🗺️ Fetching enhanced Route 66 waypoints from Supabase...");
        
        const { data, error } = await supabase
          .from('route66_waypoints')
          .select('*')
          .order('sequence_order');

        if (error) {
          console.error("❌ Error fetching waypoints:", error);
          setError(error.message);
          return;
        }

        if (!data || data.length === 0) {
          console.log("❌ No waypoints found in database");
          setError("No waypoints found in database");
          return;
        }

        console.log(`✅ Fetched ${data.length} enhanced waypoints from Supabase`);
        console.log(`Major stops: ${data.filter(w => w.is_major_stop).length}`);
        console.log(`Intermediate waypoints: ${data.filter(w => !w.is_major_stop).length}`);
        
        setWaypoints(data);
      } catch (err) {
        console.error("❌ Error fetching Route 66 waypoints:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaypoints();
  }, []);

  return { waypoints, isLoading, error };
};
