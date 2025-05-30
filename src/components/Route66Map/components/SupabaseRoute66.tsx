
import React, { useEffect } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import RoutePolyline from './RoutePolyline';
import RouteMarkers from './RouteMarkers';
import type { SupabaseRoute66Props } from '../types/supabaseTypes';

const SupabaseRoute66: React.FC<SupabaseRoute66Props> = ({ map }) => {
  const { waypoints, isLoading, error } = useSupabaseRoute66();

  useEffect(() => {
    if (!map) {
      console.log("❌ No map provided to SupabaseRoute66");
      return;
    }

    if (error) {
      console.error("❌ Error loading Route 66 data:", error);
      return;
    }

    if (isLoading) {
      console.log("⏳ Loading Route 66 waypoints...");
      return;
    }

    console.log(`✅ SupabaseRoute66 ready to display route with ${waypoints.length} waypoints`);
  }, [map, waypoints, isLoading, error]);

  // Cleanup function
  useEffect(() => {
    return () => {
      console.log("🧹 Cleaning up Supabase Route 66 display");
    };
  }, []);

  if (!map || isLoading || error || !waypoints.length) {
    return null;
  }

  return (
    <>
      <RoutePolyline map={map} waypoints={waypoints} />
      <RouteMarkers map={map} waypoints={waypoints} />
    </>
  );
};

export default SupabaseRoute66;
