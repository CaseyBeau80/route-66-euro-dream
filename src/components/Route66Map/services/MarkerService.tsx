
import React from 'react';

interface MarkerServiceProps {
  map: google.maps.Map;
  routePath: google.maps.LatLngLiteral[];
  startMarkerRef: React.MutableRefObject<google.maps.Marker | null>;
  endMarkerRef: React.MutableRefObject<google.maps.Marker | null>;
}

export const MarkerService = {
  createStartEndMarkers: ({ map, routePath, startMarkerRef, endMarkerRef }: MarkerServiceProps) => {
    console.log('📍 MarkerService: Creating start and end markers');

    // Create start marker (Chicago)
    startMarkerRef.current = new google.maps.Marker({
      position: routePath[0],
      map: map,
      title: 'Route 66 Start - Chicago, IL',
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="12" fill="#22C55E" stroke="#fff" stroke-width="2"/>
            <text x="15" y="19" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">START</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15)
      },
      zIndex: 1000000
    });

    // Create end marker (Santa Monica)
    endMarkerRef.current = new google.maps.Marker({
      position: routePath[routePath.length - 1],
      map: map,
      title: 'Route 66 End - Santa Monica, CA',
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="12" fill="#EF4444" stroke="#fff" stroke-width="2"/>
            <text x="15" y="19" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">END</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15)
      },
      zIndex: 1000000
    });

    console.log('📍 MarkerService: Start and end markers created');
  }
};
