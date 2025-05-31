
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
    console.log(`📍 Adding ${majorStops.length} yellow star markers out of ${waypoints.length} total waypoints`);
    
    majorStops.forEach((waypoint) => {
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 2l2.25 6.75h6.75l-5.25 3.75 2.25 6.75L12 15.75 6.75 19.5l2.25-6.75L3.75 8.75h6.75L12 2z" 
                    fill="#FFD700" stroke="#B8860B" stroke-width="0.75"/>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        },
        title: `${waypoint.name} - ${waypoint.state}`,
        zIndex: 20000
      });

      // Create enhanced info window for major stops
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 280px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #B8860B; font-size: 16px; font-weight: bold;">${waypoint.name}</h3>
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
                Route 66 major stop
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

    console.log(`✅ Enhanced Route 66 fully displayed with ${markersRef.current.length} yellow star markers`);

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
