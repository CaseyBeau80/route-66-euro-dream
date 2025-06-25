
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface CleanSingleRouteProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const CleanSingleRoute: React.FC<CleanSingleRouteProps> = ({ map, waypoints }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  console.log('🛣️ CleanSingleRoute: Creating simple Route 66 polyline', {
    waypointsCount: waypoints.length,
    hasMap: !!map
  });

  useEffect(() => {
    // Clean up any existing polyline first
    if (polylineRef.current) {
      console.log('🧹 Cleaning up existing polyline');
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (!map || !waypoints.length) {
      console.log('❌ Missing map or waypoints');
      return;
    }

    // Filter to major stops only and sort by sequence
    const majorStops = waypoints
      .filter(wp => 
        wp.latitude && 
        wp.longitude && 
        wp.sequence_order !== null &&
        wp.is_major_stop === true
      )
      .sort((a, b) => a.sequence_order - b.sequence_order);

    console.log('📍 Creating route with major stops:', majorStops.map(s => 
      `${s.sequence_order}. ${s.name}, ${s.state}`
    ));

    if (majorStops.length < 2) {
      console.warn('❌ Not enough major stops for route');
      return;
    }

    // Create path from major stops
    const path: google.maps.LatLngLiteral[] = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    console.log('🗺️ Creating polyline with path:', {
      pathLength: path.length,
      start: `${path[0].lat}, ${path[0].lng}`,
      end: `${path[path.length - 1].lat}, ${path[path.length - 1].lng}`
    });

    // Create the polyline
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 6,
      zIndex: 100
    });

    // Add to map
    polyline.setMap(map);
    polylineRef.current = polyline;

    console.log('✅ Route 66 polyline created successfully');

  }, [map, waypoints]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        console.log('🧹 Cleaning up polyline on unmount');
        polylineRef.current.setMap(null);
      }
    };
  }, []);

  return null;
};

export default CleanSingleRoute;
