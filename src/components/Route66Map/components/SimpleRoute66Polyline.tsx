
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface SimpleRoute66PolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const SimpleRoute66Polyline: React.FC<SimpleRoute66PolylineProps> = ({ map, waypoints }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  console.log('🛣️ SimpleRoute66Polyline: Creating clean route', {
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

    // Get only major stops and sort them properly
    const majorStops = waypoints
      .filter(wp => wp.is_major_stop === true)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    console.log('📍 Major stops for route:', majorStops.map(s => 
      `${s.sequence_order}. ${s.name}, ${s.state} (${s.latitude}, ${s.longitude})`
    ));

    if (majorStops.length < 2) {
      console.warn('⚠️ Need at least 2 major stops for route');
      return;
    }

    // Create simple path from coordinates
    const path: google.maps.LatLngLiteral[] = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    console.log('🗺️ Creating polyline with path:', path);

    // Create the polyline with clear styling
    const newPolyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#DC2626', // Red color
      strokeOpacity: 1.0,
      strokeWeight: 4,
      zIndex: 1000
    });

    // Set it on the map
    newPolyline.setMap(map);
    polylineRef.current = newPolyline;

    console.log('✅ Simple Route 66 polyline created successfully');

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
