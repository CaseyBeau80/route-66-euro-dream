
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface DirectRoute66PolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const DirectRoute66Polyline: React.FC<DirectRoute66PolylineProps> = ({ map, waypoints }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  console.log('🛣️ DirectRoute66Polyline: Creating single Route 66 polyline', {
    waypointsCount: waypoints.length,
    hasMap: !!map
  });

  useEffect(() => {
    // Clear any existing polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (!map || !waypoints.length) {
      console.log('❌ Missing map or waypoints');
      return;
    }

    // Sort waypoints by sequence_order and filter out invalid coordinates
    const validWaypoints = waypoints
      .filter(wp => wp.latitude && wp.longitude && wp.sequence_order !== null)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    console.log('📍 Valid waypoints for route:', validWaypoints.length);

    if (validWaypoints.length < 2) {
      console.warn('❌ Not enough valid waypoints for route');
      return;
    }

    // Create path from all valid waypoints
    const path: google.maps.LatLngLiteral[] = validWaypoints.map(waypoint => ({
      lat: waypoint.latitude,
      lng: waypoint.longitude
    }));

    console.log('🗺️ Creating polyline with path:', {
      pathLength: path.length,
      firstPoint: path[0],
      lastPoint: path[path.length - 1]
    });

    // Create the polyline
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF4444',
      strokeOpacity: 1.0,
      strokeWeight: 6,
      zIndex: 100
    });

    // Add to map
    polyline.setMap(map);
    polylineRef.current = polyline;

    console.log('✅ Route 66 polyline created and added to map');

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

export default DirectRoute66Polyline;
