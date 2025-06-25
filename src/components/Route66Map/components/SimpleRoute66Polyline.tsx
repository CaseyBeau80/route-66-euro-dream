
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface SimpleRoute66PolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const SimpleRoute66Polyline: React.FC<SimpleRoute66PolylineProps> = ({ map, waypoints }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  console.log('🛣️ SimpleRoute66Polyline: Creating robust route', {
    waypointsCount: waypoints.length,
    hasMap: !!map
  });

  useEffect(() => {
    // Clear any existing polyline first
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

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

    // Try major stops first, but fallback to all waypoints if needed
    let routeWaypoints = sortedWaypoints.filter(wp => wp.is_major_stop === true);
    
    if (routeWaypoints.length < 2) {
      console.log('⚠️ Not enough major stops, using ALL waypoints for route');
      routeWaypoints = sortedWaypoints;
    }

    console.log('🗺️ Using waypoints for route:', routeWaypoints.map(s => 
      `${s.sequence_order}. ${s.name}, ${s.state}`
    ));

    if (routeWaypoints.length < 2) {
      console.warn('⚠️ Still not enough waypoints for route');
      return;
    }

    // Create simple path from coordinates
    const path: google.maps.LatLngLiteral[] = routeWaypoints.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    console.log('🗺️ Creating polyline with', path.length, 'points');
    console.log('🗺️ First point:', path[0]);
    console.log('🗺️ Last point:', path[path.length - 1]);

    // Create the polyline with VERY visible styling
    const newPolyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF0000', // Bright red
      strokeOpacity: 1.0,
      strokeWeight: 8, // Thicker line
      zIndex: 1000
    });

    // Set it on the map
    newPolyline.setMap(map);
    polylineRef.current = newPolyline;

    console.log('✅ Route 66 polyline created and attached to map');
    console.log('🔍 Polyline map reference:', newPolyline.getMap());
    console.log('🔍 Polyline path length:', newPolyline.getPath().getLength());

  }, [map, waypoints]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, []);

  return null;
};

export default SimpleRoute66Polyline;
