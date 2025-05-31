
import React from 'react';

interface PolylineServiceProps {
  map: google.maps.Map;
  polylineRef: React.MutableRefObject<google.maps.Polyline | null>;
}

// This service is completely disabled to prevent route conflicts
// All route rendering is now handled by Route66StaticPolyline component
export const PolylineService = {
  createRoutePolyline: ({ map, polylineRef }: PolylineServiceProps) => {
    console.log('⚠️ PolylineService: createRoutePolyline disabled to prevent conflicts with single Route66StaticPolyline');
    return null;
  },

  verifyVisibility: (polylineRef: React.MutableRefObject<google.maps.Polyline | null>) => {
    console.log('⚠️ PolylineService: verifyVisibility disabled to prevent conflicts');
  },

  addClickListener: (polylineRef: React.MutableRefObject<google.maps.Polyline | null>, map: google.maps.Map) => {
    console.log('⚠️ PolylineService: addClickListener disabled to prevent conflicts');
  }
};
