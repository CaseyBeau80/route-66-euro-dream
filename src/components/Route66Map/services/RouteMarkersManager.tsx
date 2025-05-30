
import React from 'react';

interface RouteMarkersManagerProps {
  map: google.maps.Map;
  routePath: google.maps.LatLngLiteral[];
  startMarkerRef: React.MutableRefObject<google.maps.Marker | null>;
  endMarkerRef: React.MutableRefObject<google.maps.Marker | null>;
}

export const RouteMarkersManager = {
  createStartEndMarkers: ({ map, routePath, startMarkerRef, endMarkerRef }: RouteMarkersManagerProps) => {
    console.log('📍 RouteMarkersManager: Creating start and end markers');

    // Create start marker icon
    const startIcon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
          <circle cx="12.5" cy="12.5" r="10" fill="#22C55E" stroke="#fff" stroke-width="2"/>
          <text x="12.5" y="16" text-anchor="middle" fill="white" font-family="Arial" font-size="7" font-weight="bold">START</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    };

    // Create end marker icon
    const endIcon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
          <circle cx="12.5" cy="12.5" r="10" fill="#EF4444" stroke="#fff" stroke-width="2"/>
          <text x="12.5" y="16" text-anchor="middle" fill="white" font-family="Arial" font-size="7" font-weight="bold">END</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    };

    // Create start marker (Chicago)
    startMarkerRef.current = new google.maps.Marker({
      position: routePath[0],
      map: map,
      title: 'Route 66 Start - Chicago, IL',
      icon: startIcon,
      zIndex: 1000000
    });

    // Create end marker (Santa Monica)
    endMarkerRef.current = new google.maps.Marker({
      position: routePath[routePath.length - 1],
      map: map,
      title: 'Route 66 End - Santa Monica, CA',
      icon: endIcon,
      zIndex: 1000000
    });

    console.log('📍 RouteMarkersManager: Start and end markers created');
  }
};
