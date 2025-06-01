
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
        
        // Enhanced logging for destination city analysis
        const majorStops = data.filter(w => w.is_major_stop === true);
        const nonMajorStops = data.filter(w => w.is_major_stop !== true);
        
        console.log(`🏛️ Destination cities analysis:`, {
          totalWaypoints: data.length,
          majorStops: majorStops.length,
          nonMajorStops: nonMajorStops.length
        });
        
        console.log(`📍 Major stops (destination cities):`, majorStops.map(stop => `${stop.name} (${stop.state}) - Seq: ${stop.sequence_order}`));
        
        // Special check for Santa Monica
        const santaMonica = data.find(w => w.name.toLowerCase().includes('santa monica'));
        if (santaMonica) {
          console.log(`🎯 SANTA MONICA FOUND!`, {
            name: santaMonica.name,
            state: santaMonica.state,
            sequence_order: santaMonica.sequence_order,
            is_major_stop: santaMonica.is_major_stop,
            latitude: santaMonica.latitude,
            longitude: santaMonica.longitude
          });
        } else {
          console.log(`❌ SANTA MONICA NOT FOUND in waypoints!`);
        }
        
        if (nonMajorStops.length > 0) {
          console.log(`📍 Non-major stops:`, nonMajorStops.map(stop => `${stop.name} (${stop.state}) - Major: ${stop.is_major_stop}`));
        }
        
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
