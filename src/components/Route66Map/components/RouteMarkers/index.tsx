
import React, { useEffect, useRef } from 'react';
import type { RouteMarkersProps } from './types';
import { MarkerManager } from './MarkerManager';

const RouteMarkers: React.FC<RouteMarkersProps> = ({ map, waypoints }) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<WeakMap<google.maps.Marker, google.maps.InfoWindow>>(new WeakMap());

  useEffect(() => {
    console.log('🚫 RouteMarkers: COMPLETELY DISABLED - all yellow circle prevention active');
    console.log('🧹 RouteMarkers: Ensuring no yellow circle markers are created for', waypoints.length, 'waypoints');
    
    // Immediately clean up any existing markers to prevent yellow circles
    const markerRefs = { markersRef, infoWindowsRef };
    MarkerManager.cleanupMarkers(markerRefs);
    
    // Clear the refs to ensure nothing remains
    markersRef.current = [];
    infoWindowsRef.current = new WeakMap();
    
    return () => {
      console.log('🧹 RouteMarkers cleanup - aggressively removing any potential yellow circle markers');
      MarkerManager.cleanupMarkers(markerRefs);
      markersRef.current = [];
      infoWindowsRef.current = new WeakMap();
    };
  }, [map, waypoints]);

  // Return null - this component is completely disabled to prevent yellow circles
  return null;
};

export default RouteMarkers;
