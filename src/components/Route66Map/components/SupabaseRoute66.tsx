
import React, { useEffect } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import RoutePolyline from './RoutePolyline';
import RouteMarkers from './RouteMarkers';
import type { SupabaseRoute66Props } from '../types/supabaseTypes';

interface EnhancedSupabaseRoute66Props extends SupabaseRoute66Props {
  onRouteError?: () => void;
  onRouteSuccess?: () => void;
}

const SupabaseRoute66: React.FC<EnhancedSupabaseRoute66Props> = ({ 
  map, 
  onRouteError,
  onRouteSuccess
}) => {
  const { waypoints, isLoading, error } = useSupabaseRoute66();

  useEffect(() => {
    if (!map) {
      console.log("❌ No map provided to SupabaseRoute66");
      return;
    }

    if (error) {
      console.error("❌ Error loading Route 66 data:", error);
      if (onRouteError) {
        onRouteError();
      }
      return;
    }

    if (isLoading) {
      console.log("⏳ Loading enhanced Route 66 waypoints from Supabase...");
      return;
    }

    if (waypoints.length === 0) {
      console.log("❌ No waypoints loaded from Supabase");
      if (onRouteError) {
        onRouteError();
      }
      return;
    }

    console.log(`✅ SupabaseRoute66 ready to display enhanced route with ${waypoints.length} waypoints`);
    console.log(`📍 Major stops: ${waypoints.filter(w => w.is_major_stop).length}`);
    console.log(`🛤️ Intermediate waypoints: ${waypoints.filter(w => !w.is_major_stop).length}`);
    
    // Notify success
    if (onRouteSuccess) {
      setTimeout(() => {
        onRouteSuccess();
      }, 100);
    }
  }, [map, waypoints, isLoading, error, onRouteError, onRouteSuccess]);

  // Cleanup function
  useEffect(() => {
    return () => {
      console.log("🧹 Cleaning up enhanced Supabase Route 66 display");
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
