
import React from 'react';

interface RouteMarkersManagerProps {
  map: google.maps.Map;
  routePath: google.maps.LatLngLiteral[];
  startMarkerRef: React.MutableRefObject<google.maps.Marker | null>;
  endMarkerRef: React.MutableRefObject<google.maps.Marker | null>;
}

export const RouteMarkersManager = {
  createStartEndMarkers: ({ map, routePath, startMarkerRef, endMarkerRef }: RouteMarkersManagerProps) => {
    console.log('⚠️ RouteMarkersManager.createStartEndMarkers: DISABLED to prevent yellow circles');
    console.log('🚫 Not creating start/end markers that might have yellow circles');
    
    // Clear any existing markers
    if (startMarkerRef.current) {
      startMarkerRef.current.setMap(null);
      startMarkerRef.current = null;
    }
    
    if (endMarkerRef.current) {
      endMarkerRef.current.setMap(null);
      endMarkerRef.current = null;
    }
    
    console.log('✅ RouteMarkersManager: Start/end marker creation disabled');
    return;
  }
};
