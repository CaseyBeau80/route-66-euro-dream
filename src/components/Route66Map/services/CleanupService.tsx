
import React from 'react';

interface CleanupServiceProps {
  polylineRef: React.MutableRefObject<google.maps.Polyline | null>;
  startMarkerRef: React.MutableRefObject<google.maps.Marker | null>;
  endMarkerRef: React.MutableRefObject<google.maps.Marker | null>;
}

export const CleanupService = {
  cleanupMapElements: ({ polylineRef, startMarkerRef, endMarkerRef }: CleanupServiceProps) => {
    console.log('🧹 CleanupService: Cleaning up existing Route 66 elements');
    
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
