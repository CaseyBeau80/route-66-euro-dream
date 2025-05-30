
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RouteMarkersProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RouteMarkers: React.FC<RouteMarkersProps> = ({ map, waypoints }) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<WeakMap<google.maps.Marker, google.maps.InfoWindow>>(new WeakMap());

  useEffect(() => {
    if (!map || !waypoints.length) return;

    // Filter for major stops only to avoid clutter
    const majorStops = waypoints.filter(waypoint => waypoint.is_major_stop);
    console.log(`Adding ${majorStops.length} major stop markers out of ${waypoints.length} total waypoints`);
    
    majorStops.forEach((waypoint, index) => {
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#FF0000" stroke="#FFFFFF" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">${index + 1}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        },
        title: `${waypoint.name} - ${waypoint.state}`,
        zIndex: 20000
      });

      // Add info window for major stops
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 5px 0; color: #FF0000; font-size: 14px;">${waypoint.name}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">
              ${waypoint.state}${waypoint.highway_designation ? ` • ${waypoint.highway_designation}` : ''}
            </p>
            ${waypoint.description ? `<p style="margin: 5px 0 0 0; font-size: 11px; color: #333;">${waypoint.description}</p>` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        // Close any other open info windows
        markersRef.current.forEach(m => {
          const infoWin = infoWindowsRef.current.get(m);
          if (infoWin) {
            infoWin.close();
          }
        });
        infoWindow.open(map, marker);
      });

      // Store reference to info window using WeakMap
      infoWindowsRef.current.set(marker, infoWindow);
      markersRef.current.push(marker);
    });

    // Add special start and end markers
    if (waypoints.length > 0) {
      const startPoint = waypoints[0];
      const endPoint = waypoints[waypoints.length - 1];

      const startMarker = new google.maps.Marker({
        position: { lat: startPoint.latitude, lng: startPoint.longitude },
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" fill="#00AA00" stroke="#FFFFFF" stroke-width="3"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">START</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        },
        title: `Route 66 Start - ${startPoint.name}`,
        zIndex: 30000
      });

      const endMarker = new google.maps.Marker({
        position: { lat: endPoint.latitude, lng: endPoint.longitude },
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" fill="#FF0000" stroke="#FFFFFF" stroke-width="3"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">END</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        },
        title: `Route 66 End - ${endPoint.name}`,
        zIndex: 30000
      });

      markersRef.current.push(startMarker, endMarker);
    }

    console.log(`✅ Route 66 fully displayed with ${markersRef.current.length} markers`);

    return () => {
      markersRef.current.forEach(marker => {
        const infoWindow = infoWindowsRef.current.get(marker);
        if (infoWindow) {
          infoWindow.close();
        }
        marker.setMap(null);
      });
      markersRef.current = [];
      infoWindowsRef.current = new WeakMap();
    };
  }, [map, waypoints]);

  return null;
};

export default RouteMarkers;
