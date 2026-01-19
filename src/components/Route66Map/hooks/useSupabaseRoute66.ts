
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
        console.log("🗺️ Fetching Route 66 waypoints from route66_waypoints table ONLY...");
        
        const { data, error } = await (supabase as any)
          .from('route66_waypoints')
          .select('*')
          .order('sequence_order', { ascending: true }); // Explicitly ascending order

        if (error) {
          console.error("❌ Database error fetching waypoints:", error);
          setError(error.message);
          return;
        }

        if (!data || data.length === 0) {
          console.log("❌ No waypoints found in route66_waypoints table");
          setError("No waypoints found in route66_waypoints table");
          return;
        }

        console.log(`✅ Fetched ${data.length} waypoints from route66_waypoints table`);
        
        // Detailed validation logging
        console.log('🔍 DATABASE QUERY RESULT VALIDATION:');
        console.log('   Query: SELECT * FROM route66_waypoints ORDER BY sequence_order ASC');
        console.log(`   Result count: ${data.length}`);
        
        // Log sequence order validation
        const sequenceOrders = data.map(wp => wp.sequence_order).sort((a, b) => a - b);
        const minSeq = Math.min(...sequenceOrders);
        const maxSeq = Math.max(...sequenceOrders);
        console.log(`   Sequence range: ${minSeq} to ${maxSeq}`);
        
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
        console.log('📍 FIRST 5 waypoints from database:');
        data.slice(0, 5).forEach((wp, i) => {
          console.log(`   ${i + 1}. SEQ ${wp.sequence_order}: ${wp.name}, ${wp.state}`);
        });
        
        console.log('📍 LAST 5 waypoints from database:');
        data.slice(-5).forEach((wp, i) => {
          console.log(`   ${data.length - 4 + i}. SEQ ${wp.sequence_order}: ${wp.name}, ${wp.state}`);
        });
        
        // Verify Chicago is first and Santa Monica is last
        const firstWaypoint = data[0];
        const lastWaypoint = data[data.length - 1];
        console.log(`🎯 Route validation: Start = ${firstWaypoint.name}, ${firstWaypoint.state} (Seq: ${firstWaypoint.sequence_order})`);
        console.log(`🎯 Route validation: End = ${lastWaypoint.name}, ${lastWaypoint.state} (Seq: ${lastWaypoint.sequence_order})`);
        
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
