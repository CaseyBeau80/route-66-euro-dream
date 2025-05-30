
import React from 'react';

interface RouteCleanupHelperProps {
  polylineRef: React.MutableRefObject<google.maps.Polyline | null>;
  startMarkerRef: React.MutableRefObject<google.maps.Marker | null>;
  endMarkerRef: React.MutableRefObject<google.maps.Marker | null>;
}

export const RouteCleanupHelper = {
  cleanup: ({ polylineRef, startMarkerRef, endMarkerRef }: RouteCleanupHelperProps) => {
    console.log('🧹 RouteCleanupHelper: Cleaning up existing Route 66 elements');
    
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    
    if (startMarkerRef.current) {
      startMarkerRef.current.setMap(null);
      startMarkerRef.current = null;
    }
    
    if (endMarkerRef.current) {
      endMarkerRef.current.setMap(null);
      endMarkerRef.current = null;
    }
  }
};
