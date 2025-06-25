
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface SimpleRoute66PolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const SimpleRoute66Polyline: React.FC<SimpleRoute66PolylineProps> = ({ map, waypoints }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  console.log('🛣️ SimpleRoute66Polyline: NUCLEAR SINGLE ROUTE APPROACH', {
    waypointsCount: waypoints.length,
    hasMap: !!map
  });

  useEffect(() => {
    // NUCLEAR CLEANUP: Clear any existing polylines first
    if (polylineRef.current) {
      console.log('🧹 Removing existing SimpleRoute66Polyline');
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    // Additional cleanup: Remove any stray polylines on the map
    console.log('🧹 NUCLEAR CLEANUP: Clearing all potential polylines from map');

    if (!map || !waypoints.length) {
      console.log('⚠️ Missing map or waypoints');
      return;
    }

    // Sort all waypoints by sequence_order first
    const sortedWaypoints = waypoints
      .filter(wp => wp.latitude && wp.longitude && wp.sequence_order !== null)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    console.log('📍 All sorted waypoints:', sortedWaypoints.map(s => 
      `${s.sequence_order}. ${s.name}, ${s.state} (Major: ${s.is_major_stop})`
    ));

    // Use only major stops for a clean, non-ping-ponging route
    const majorStops = sortedWaypoints.filter(wp => wp.is_major_stop === true);
    
    console.log('🗺️ Using ONLY major stops for clean route:', majorStops.map(s => 
      `${s.sequence_order}. ${s.name}, ${s.state}`
    ));

    if (majorStops.length < 2) {
      console.warn('⚠️ Not enough major stops for route');
      return;
    }

    // Create simple path from coordinates
    const path: google.maps.LatLngLiteral[] = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    console.log('🗺️ Creating SINGLE polyline with', path.length, 'major stop points');
    console.log('🗺️ Route: Chicago → Santa Monica');
    console.log('🗺️ First point:', path[0]);
    console.log('🗺️ Last point:', path[path.length - 1]);

    // Create the polyline with VERY visible styling
    const newPolyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF0000', // Bright red
      strokeOpacity: 1.0,
      strokeWeight: 8, // Thick line
      zIndex: 1000
    });

    // Set it on the map
    newPolyline.setMap(map);
    polylineRef.current = newPolyline;

    console.log('✅ NUCLEAR SUCCESS: Single Route 66 polyline created');
    console.log('🔍 Polyline attached to map:', !!newPolyline.getMap());
    console.log('🔍 Polyline path length:', newPolyline.getPath().getLength());

  }, [map, waypoints]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        console.log('🧹 Cleaning up SimpleRoute66Polyline on unmount');
        polylineRef.current.setMap(null);
      }
    };
  }, []);

  return null;
};

export default SimpleRoute66Polyline;
