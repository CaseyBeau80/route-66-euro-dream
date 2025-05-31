
import React, { useEffect, useRef } from 'react';
import type { RouteMarkersProps } from './types';
import { MarkerManager } from './MarkerManager';

const RouteMarkers: React.FC<RouteMarkersProps> = ({ map, waypoints }) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<WeakMap<google.maps.Marker, google.maps.InfoWindow>>(new WeakMap());

  useEffect(() => {
    console.log('⚠️ RouteMarkers: COMPLETELY DISABLED - replaced by DestinationCitiesContainer');
    console.log('🏛️ All destination markers are now handled by DestinationCitiesContainer to prevent overlapping yellow circles');
    
    // Clean up any existing markers immediately
    const markerRefs = { markersRef, infoWindowsRef };
    MarkerManager.cleanupMarkers(markerRefs);
    
    return () => {
      console.log('🧹 RouteMarkers cleanup - ensuring no old markers remain');
      MarkerManager.cleanupMarkers(markerRefs);
    };
  }, [map, waypoints]);

  // Return null - this component is completely disabled
  return null;
};

export default RouteMarkers;
