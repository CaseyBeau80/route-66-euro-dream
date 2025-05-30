
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
    console.log(`📍 Adding ${majorStops.length} major stop markers out of ${waypoints.length} total waypoints`);
    
    majorStops.forEach((waypoint, index) => {
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="12" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>
              <circle cx="14" cy="14" r="6" fill="#FFFFFF"/>
              <text x="14" y="18" text-anchor="middle" fill="#DC2626" font-family="Arial" font-size="8" font-weight="bold">${index + 1}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(28, 28),
          anchor: new google.maps.Point(14, 14)
        },
        title: `${waypoint.name} - ${waypoint.state}`,
        zIndex: 20000
      });

      // Create enhanced info window for major stops
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 280px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #DC2626; font-size: 16px; font-weight: bold;">${waypoint.name}</h3>
            <div style="margin-bottom: 8px;">
              <p style="margin: 0; font-size: 13px; color: #666; font-weight: 500;">
                ${waypoint.state}${waypoint.highway_designation ? ` • ${waypoint.highway_designation}` : ''}
              </p>
            </div>
            ${waypoint.description ? `
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #333; line-height: 1.4;">
                ${waypoint.description}
              </p>
            ` : ''}
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
              <p style="margin: 0; font-size: 10px; color: #999;">
                Stop ${index + 1} of ${majorStops.length} major stops
              </p>
            </div>
          </div>
        `,
        maxWidth: 300
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

    console.log(`✅ Enhanced Route 66 fully displayed with ${markersRef.current.length} major stop markers`);

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
