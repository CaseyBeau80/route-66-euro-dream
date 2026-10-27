
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Route66Waypoint } from '../types/supabaseTypes';

export const useSupabaseRoute66 = () => {
  const [waypoints, setWaypoints] = useState<Route66Waypoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaypoints = async () => {
      try {
        ;
        
        const { data, error } = await (supabase as any)
          .from('route66_waypoints')
          .select('id,name,state,latitude,longitude,description,image_url,thumbnail_url,sequence_order,is_major_stop,highway_designation')
          .order('sequence_order', { ascending: true }); // Explicitly ascending order

        if (error) {
          console.error("❌ Database error fetching waypoints:", error);
          setError(error.message);
          return;
        }

        if (!data || data.length === 0) {
          ;
          setError("No waypoints found in route66_waypoints table");
          return;
        }

        ;
        
        // Detailed validation logging
        ;
        ;
        ;
        
        // Log sequence order validation
        const sequenceOrders = data.map(wp => wp.sequence_order).sort((a, b) => a - b);
        const minSeq = Math.min(...sequenceOrders);
        const maxSeq = Math.max(...sequenceOrders);
        ;
        
        // Check for duplicates
        const duplicates = sequenceOrders.filter((seq, index) => sequenceOrders.indexOf(seq) !== index);
        if (duplicates.length > 0) {
          console.warn('⚠️ DUPLICATE sequence_orders found:', duplicates);
        }
        
        // Check for gaps
        const gaps = [];
        for (let i = minSeq; i <= maxSeq; i++) {
          if (!sequenceOrders.includes(i)) {
            gaps.push(i);
          }
        }
        if (gaps.length > 0) {
          console.warn('⚠️ GAPS in sequence_order found:', gaps);
        }
        
        // Log first 5 and last 5 waypoints for verification
        ;
        data.slice(0, 5).forEach((wp, i) => {
          ;
        });
        
        ;
        data.slice(-5).forEach((wp, i) => {
          ;
        });
        
        // Verify Chicago is first and Santa Monica is last
        const firstWaypoint = data[0];
        const lastWaypoint = data[data.length - 1];
        ;
        ;
        
        if (!firstWaypoint.name.toLowerCase().includes('chicago')) {
          console.warn('⚠️ WARNING: First waypoint is not Chicago!');
        }
        if (!lastWaypoint.name.toLowerCase().includes('santa monica')) {
          console.warn('⚠️ WARNING: Last waypoint is not Santa Monica!');
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
