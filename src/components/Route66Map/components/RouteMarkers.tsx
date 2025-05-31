
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RouteMarkersProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RouteMarkers: React.FC<RouteMarkersProps> = ({ map, waypoints }) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<WeakMap<google.maps.Marker, google.maps.InfoWindow>>(new WeakMap());

  const createRoute66CityIcon = (cityName: string) => {
    // Use consistent sizing like the original Route 66 icons
    const iconWidth = 40;
    const iconHeight = 40;
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconWidth}" height="${iconHeight}" viewBox="0 0 ${iconWidth} ${iconHeight}">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
            </filter>
            
            <!-- Asphalt texture gradient -->
            <linearGradient id="asphaltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#F8F6F0;stop-opacity:1" />
              <stop offset="15%" style="stop-color:#F5F3ED;stop-opacity:1" />
              <stop offset="30%" style="stop-color:#F2F0EA;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#EFEDE7;stop-opacity:1" />
              <stop offset="70%" style="stop-color:#ECEAE4;stop-opacity:1" />
              <stop offset="85%" style="stop-color:#E9E7E1;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#E6E4DE;stop-opacity:1" />
            </linearGradient>
            
            <!-- Sun-faded worn effect -->
            <radialGradient id="sunFadeGradient" cx="50%" cy="30%" r="60%">
              <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.1" />
              <stop offset="40%" style="stop-color:#F8F6F0;stop-opacity:0.05" />
              <stop offset="100%" style="stop-color:#E6E4DE;stop-opacity:0" />
            </radialGradient>
          </defs>
          
          <!-- Classic US Route Shield Shape with textured background -->
          <path d="M20 4
                   L8 4
                   C6 4 4 6 4 8
                   L4 20
                   C4 24 6 28 10 32
                   C14 35 17 37 20 38
                   C23 37 26 35 30 32
                   C34 28 36 24 36 20
                   L36 8
                   C36 6 34 4 32 4
                   L20 4 Z" 
                fill="url(#asphaltGradient)" 
                stroke="#000000" 
                stroke-width="2"
                filter="url(#shadow)"/>
          
          <!-- Add sun-faded overlay -->
          <path d="M20 4
                   L8 4
                   C6 4 4 6 4 8
                   L4 20
                   C4 24 6 28 10 32
                   C14 35 17 37 20 38
                   C23 37 26 35 30 32
                   C34 28 36 24 36 20
                   L36 8
                   C36 6 34 4 32 4
                   L20 4 Z" 
                fill="url(#sunFadeGradient)"/>
          
          <!-- Inner shield border for authentic look -->
          <path d="M20 6
                   L10 6
                   C8.5 6 7 7.5 7 9
                   L7 19
                   C7 22.5 8.5 26 11.5 29
                   C14.5 31.5 17 33 20 33.5
                   C23 33 25.5 31.5 28.5 29
                   C31.5 26 33 22.5 33 19
                   L33 9
                   C33 7.5 31.5 6 30 6
                   L20 6 Z" 
                fill="none" 
                stroke="#000000" 
                stroke-width="1"/>
          
          <!-- City name at top (abbreviated if too long) -->
          <text x="20" y="15" text-anchor="middle" 
                fill="#000000" 
                font-family="Arial, sans-serif" 
                font-size="6" 
                font-weight="bold"
                letter-spacing="0.3px">${cityName.length > 8 ? cityName.substring(0, 8).toUpperCase() : cityName.toUpperCase()}</text>
          
          <!-- Horizontal dividing line -->
          <line x1="9" y1="18" x2="31" y2="18" 
                stroke="#000000" 
                stroke-width="1.5"/>
          
          <!-- Large 66 numbers -->
          <text x="20" y="31" text-anchor="middle" 
                fill="#000000" 
                font-family="Arial, sans-serif" 
                font-size="15" 
                font-weight="900">66</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(iconWidth, iconHeight),
      anchor: new google.maps.Point(iconWidth/2, iconHeight)
    };
  };

  useEffect(() => {
    if (!map || !waypoints.length) return;

    // Filter for major stops only to avoid clutter
    const majorStops = waypoints.filter(waypoint => waypoint.is_major_stop);
    console.log(`📍 Adding ${majorStops.length} Route 66 city shield markers out of ${waypoints.length} total waypoints`);
    
    majorStops.forEach((waypoint) => {
      // Extract city name from waypoint name (remove any extra descriptive text)
      const cityName = waypoint.name.split(',')[0].split(' - ')[0].trim();
      
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: createRoute66CityIcon(cityName),
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
                Route 66 destination
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

    console.log(`✅ Route 66 city shields fully displayed with ${markersRef.current.length} destination markers`);

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
