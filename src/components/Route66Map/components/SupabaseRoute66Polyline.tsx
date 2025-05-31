
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';

interface SupabaseRoute66PolylineProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const SupabaseRoute66Polyline: React.FC<SupabaseRoute66PolylineProps> = ({ 
  map, 
  isMapReady 
}) => {
  const { waypoints, isLoading, error } = useSupabaseRoute66();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !isMapReady || isLoading || error || waypoints.length === 0) {
      return;
    }

    // Clear any existing polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    console.log(`🛣️ Creating Route 66 road from ${waypoints.length} Supabase waypoints`);

    // Sort waypoints by sequence order to ensure proper route continuity
    const sortedWaypoints = [...waypoints].sort((a, b) => a.sequence_order - b.sequence_order);

    // Create the route path from Supabase waypoints
    const routePath = sortedWaypoints.map(waypoint => ({
      lat: Number(waypoint.latitude),
      lng: Number(waypoint.longitude)
    }));

    console.log(`🗺️ Route path created with ${routePath.length} coordinates from Chicago to Santa Monica`);

    // Create the Route 66 polyline
    polylineRef.current = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#DC2626', // Route 66 red color
      strokeOpacity: 1.0,
      strokeWeight: 4,
      map: map,
      zIndex: 100
    });

    console.log('✅ Route 66 road successfully rendered from Supabase data');

    // Log some statistics
    const majorStops = sortedWaypoints.filter(w => w.is_major_stop);
    const states = [...new Set(sortedWaypoints.map(w => w.state))];
    
    console.log(`📊 Route 66 Statistics:`, {
      totalWaypoints: sortedWaypoints.length,
      majorStops: majorStops.length,
      states: states.length,
      stateList: states.join(', ')
    });

  }, [map, isMapReady, waypoints, isLoading, error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        console.log('🧹 Cleaning up Route 66 polyline');
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, []);

  if (isLoading) {
    console.log('⏳ Loading Route 66 waypoints from Supabase...');
    return null;
  }

  if (error) {
    console.error('❌ Error loading Route 66 waypoints:', error);
    return null;
  }

  if (waypoints.length === 0) {
    console.warn('⚠️ No Route 66 waypoints found in Supabase');
    return null;
  }

  return null; // This component only manages the polyline, no UI to render
};

export default SupabaseRoute66Polyline;
