
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';
import { fitMapToRoute } from '../utils/mapBoundsUtils';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !waypoints.length) return;

    // Convert waypoints to Google Maps LatLng objects
    const routePath = waypoints.map(waypoint => ({
      lat: waypoint.latitude,
      lng: waypoint.longitude
    }));

    // Create the Route 66 polyline with enhanced visibility
    const route66Polyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FF0000', // Bright red for better visibility
      strokeOpacity: 0.9,
      strokeWeight: 6, // Slightly thicker for better visibility
      zIndex: 10000, // Higher z-index to ensure visibility
      clickable: false
    });

    // Set the polyline on the map
    route66Polyline.setMap(map);
    polylineRef.current = route66Polyline;
    console.log(`✅ Route 66 polyline added to map with ${waypoints.length} waypoints`);

    // Fit the map to show the entire route
    fitMapToRoute(map, routePath);

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, waypoints]);

  return null;
};

export default RoutePolyline;
