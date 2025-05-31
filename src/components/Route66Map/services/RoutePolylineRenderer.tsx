
import React from 'react';

interface RoutePolylineRendererProps {
  map: google.maps.Map;
  polylineRef: React.MutableRefObject<google.maps.Polyline | null>;
}

// This service is completely disabled to prevent route conflicts
// All route rendering is now handled by Route66StaticPolyline component
export const RoutePolylineRenderer = {
  createPolyline: ({ map, polylineRef }: RoutePolylineRendererProps) => {
    console.log('⚠️ RoutePolylineRenderer: createPolyline disabled to prevent conflicts with single Route66StaticPolyline');
    return null;
  },

  verifyPolylineVisibility: (polylineRef: React.MutableRefObject<google.maps.Polyline | null>) => {
    console.log('⚠️ RoutePolylineRenderer: verifyPolylineVisibility disabled to prevent conflicts');
  },

  addClickListener: (
    polylineRef: React.MutableRefObject<google.maps.Polyline | null>, 
    map: google.maps.Map
  ) => {
    console.log('⚠️ RoutePolylineRenderer: addClickListener disabled to prevent conflicts');
  }
};
