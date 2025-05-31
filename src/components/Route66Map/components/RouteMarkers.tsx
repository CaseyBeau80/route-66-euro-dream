
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
    console.log(`📍 Adding ${majorStops.length} Route 66 shield markers out of ${waypoints.length} total waypoints`);
    
    majorStops.forEach((waypoint) => {
      // Extract city name from waypoint name (remove state abbreviation)
      const cityName = waypoint.name.split(',')[0].trim().toUpperCase();
      
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="100" viewBox="0 0 80 100">
              <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
                </filter>
              </defs>
              
              <!-- US Route Shield Shape -->
              <path d="M40 8
                       L12 8
                       C8 8 4 12 4 16
                       L4 40
                       C4 48 8 56 16 64
                       C24 70 32 74 40 76
                       C48 74 56 70 64 64
                       C72 56 76 48 76 40
                       L76 16
                       C76 12 72 8 68 8
                       L40 8 Z" 
                    fill="#F8F6F0" 
                    stroke="#000000" 
                    stroke-width="3"
                    filter="url(#shadow)"/>
              
              <!-- Inner shield border -->
              <path d="M40 12
                       L16 12
                       C13 12 10 15 10 18
                       L10 38
                       C10 45 13 52 19 58
                       C25 63 32 66 40 68
                       C48 66 55 63 61 58
                       C67 52 70 45 70 38
                       L70 18
                       C70 15 67 12 64 12
                       L40 12 Z" 
                    fill="none" 
                    stroke="#000000" 
                    stroke-width="1.5"/>
              
              <!-- City name at top -->
              <text x="40" y="25" text-anchor="middle" 
                    fill="#000000" 
                    font-family="Arial, sans-serif" 
                    font-size="${cityName.length > 7 ? '8' : '10'}" 
                    font-weight="bold"
                    letter-spacing="0.5px">${cityName}</text>
              
              <!-- Horizontal dividing line -->
              <line x1="16" y1="32" x2="64" y2="32" 
                    stroke="#000000" 
                    stroke-width="2"/>
              
              <!-- ROUTE text -->
              <text x="40" y="45" text-anchor="middle" 
                    fill="#000000" 
                    font-family="Arial, sans-serif" 
                    font-size="9" 
                    font-weight="bold"
                    letter-spacing="0.5px">ROUTE</text>
              
              <!-- Horizontal dividing line -->
              <line x1="16" y1="50" x2="64" y2="50" 
                    stroke="#000000" 
                    stroke-width="2"/>
              
              <!-- Large 66 numbers -->
              <text x="40" y="68" text-anchor="middle" 
                    fill="#000000" 
                    font-family="Arial, sans-serif" 
                    font-size="18" 
                    font-weight="900">66</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(80, 100),
          anchor: new google.maps.Point(40, 100)
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

    console.log(`✅ Enhanced Route 66 fully displayed with ${markersRef.current.length} Route 66 shield markers`);

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
