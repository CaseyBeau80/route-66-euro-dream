
import React, { useEffect, useState } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  console.log('🛣️ RoutePolyline: Simple waypoint-based route creation', {
    waypointsCount: waypoints.length,
    hasMap: !!map
  });

  useEffect(() => {
    // Clear any existing polyline first
    if (polyline) {
      polyline.setMap(null);
      setPolyline(null);
    }

    if (!map || !waypoints.length) {
      return;
    }

    console.log('🗺️ Creating simple Route 66 polyline from waypoints');

    // Get major stops only and sort by sequence_order
    const majorStops = waypoints
      .filter(wp => wp.is_major_stop === true)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    console.log('📍 Major stops:', majorStops.map(s => `${s.sequence_order}. ${s.name}, ${s.state}`));

    if (majorStops.length < 2) {
      console.warn('⚠️ Need at least 2 major stops for route');
      return;
    }

    // Create simple path from coordinates
    const routePath: google.maps.LatLngLiteral[] = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    // Create the polyline
    const newPolyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 6,
      zIndex: 1000,
      map: map
    });

    setPolyline(newPolyline);

    console.log('✅ Simple Route 66 polyline created with', routePath.length, 'points');

    // Cleanup function
    return () => {
      if (newPolyline) {
        newPolyline.setMap(null);
      }
    };
  }, [map, waypoints, polyline]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (polyline) {
        polyline.setMap(null);
      }
    };
  }, [polyline]);

  return null;
};

export default RoutePolyline;
