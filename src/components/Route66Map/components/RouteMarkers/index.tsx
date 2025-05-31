
import React, { useEffect, useRef } from 'react';
import type { RouteMarkersProps } from './types';
import { MarkerManager } from './MarkerManager';

const RouteMarkers: React.FC<RouteMarkersProps> = ({ map, waypoints }) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<WeakMap<google.maps.Marker, google.maps.InfoWindow>>(new WeakMap());

  useEffect(() => {
    if (!map || !waypoints.length) return;

    // Separate waypoints into destinations and regular stops
    const destinationCities = waypoints.filter(waypoint => waypoint.is_major_stop);
    const regularStops = waypoints.filter(waypoint => !waypoint.is_major_stop);
    
    console.log(`📍 Adding ${destinationCities.length} destination cities and ${regularStops.length} regular stops`);
    
    const markerRefs = { markersRef, infoWindowsRef };

    // Create destination city markers (higher zIndex)
    MarkerManager.createDestinationMarkers(destinationCities, map, markerRefs);

    // Create regular stop markers (lower zIndex)
    MarkerManager.createRegularStopMarkers(regularStops, map, markerRefs);

    console.log(`✅ Route 66 markers fully displayed: ${destinationCities.length} destinations + ${regularStops.length} regular stops = ${markersRef.current.length} total markers`);

    return () => {
      MarkerManager.cleanupMarkers(markerRefs);
    };
  }, [map, waypoints]);

  return null;
};

export default RouteMarkers;
