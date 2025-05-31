
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RouteMarkersProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RouteMarkers: React.FC<RouteMarkersProps> = ({ map, waypoints }) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<WeakMap<google.maps.Marker, google.maps.InfoWindow>>(new WeakMap());

  const createDestinationCityIcon = (cityName: string) => {
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

  const createRegularStopIcon = () => {
    const iconWidth = 20;
    const iconHeight = 20;
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconWidth}" height="${iconHeight}" viewBox="0 0 ${iconWidth} ${iconHeight}">
          <defs>
            <filter id="stopShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0.5" dy="1" stdDeviation="1" flood-color="#000000" flood-opacity="0.25"/>
            </filter>
            
            <linearGradient id="stopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#B91C1C;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Outer circle -->
          <circle cx="10" cy="10" r="8" 
                  fill="url(#stopGradient)" 
                  stroke="#FFFFFF" 
                  stroke-width="2"
                  filter="url(#stopShadow)"/>
          
          <!-- Inner circle -->
          <circle cx="10" cy="10" r="4" 
                  fill="#FFFFFF" 
                  opacity="0.9"/>
          
          <!-- Center dot -->
          <circle cx="10" cy="10" r="1.5" 
                  fill="#DC2626"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(iconWidth, iconHeight),
      anchor: new google.maps.Point(iconWidth/2, iconHeight/2)
    };
  };

  const createDestinationInfoWindow = (waypoint: Route66Waypoint) => {
    const cityName = waypoint.name.split(',')[0].split(' - ')[0].trim();
    
    return new google.maps.InfoWindow({
      content: `
        <div style="padding: 14px; max-width: 320px; font-family: Arial, sans-serif;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #F8F6F0, #E6E4DE); border: 2px solid #000; border-radius: 4px; margin-right: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 8px; font-weight: bold; color: #000;">66</span>
            </div>
            <h3 style="margin: 0; color: #DC2626; font-size: 18px; font-weight: bold;">${waypoint.name}</h3>
          </div>
          
          <div style="margin-bottom: 10px;">
            <p style="margin: 0; font-size: 14px; color: #666; font-weight: 500;">
              <strong>Destination City</strong> • ${waypoint.state}${waypoint.highway_designation ? ` • ${waypoint.highway_designation}` : ''}
            </p>
          </div>
          
          ${waypoint.description ? `
            <p style="margin: 10px 0; font-size: 13px; color: #333; line-height: 1.5; background: #F9F9F9; padding: 8px; border-radius: 4px;">
              ${waypoint.description}
            </p>
          ` : ''}
          
          <div style="margin-top: 12px; padding-top: 10px; border-top: 2px solid #DC2626;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <p style="margin: 0; font-size: 11px; color: #999;">
                Major Route 66 destination
              </p>
              <div style="background: #DC2626; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: bold;">
                STOP #${waypoint.sequence_order}
              </div>
            </div>
          </div>
        </div>
      `,
      maxWidth: 350
    });
  };

  const createRegularStopInfoWindow = (waypoint: Route66Waypoint) => {
    return new google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 260px; font-family: Arial, sans-serif;">
          <h3 style="margin: 0 0 6px 0; color: #DC2626; font-size: 15px; font-weight: bold;">${waypoint.name}</h3>
          
          <div style="margin-bottom: 8px;">
            <p style="margin: 0; font-size: 12px; color: #666; font-weight: 500;">
              Route 66 Stop • ${waypoint.state}${waypoint.highway_designation ? ` • ${waypoint.highway_designation}` : ''}
            </p>
          </div>
          
          ${waypoint.description ? `
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #333; line-height: 1.4;">
              ${waypoint.description}
            </p>
          ` : ''}
          
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 10px; color: #999;">
              Waypoint #${waypoint.sequence_order}
            </p>
          </div>
        </div>
      `,
      maxWidth: 280
    });
  };

  useEffect(() => {
    if (!map || !waypoints.length) return;

    // Separate waypoints into destinations and regular stops
    const destinationCities = waypoints.filter(waypoint => waypoint.is_major_stop);
    const regularStops = waypoints.filter(waypoint => !waypoint.is_major_stop);
    
    console.log(`📍 Adding ${destinationCities.length} destination cities and ${regularStops.length} regular stops`);
    
    // Create destination city markers (higher zIndex)
    destinationCities.forEach((waypoint) => {
      const cityName = waypoint.name.split(',')[0].split(' - ')[0].trim();
      
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: createDestinationCityIcon(cityName),
        title: `${waypoint.name} - ${waypoint.state} (Destination)`,
        zIndex: 30000 // Higher zIndex for destinations
      });

      const infoWindow = createDestinationInfoWindow(waypoint);

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

      infoWindowsRef.current.set(marker, infoWindow);
      markersRef.current.push(marker);
    });

    // Create regular stop markers (lower zIndex)
    regularStops.forEach((waypoint) => {
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: createRegularStopIcon(),
        title: `${waypoint.name} - ${waypoint.state}`,
        zIndex: 20000 // Lower zIndex for regular stops
      });

      const infoWindow = createRegularStopInfoWindow(waypoint);

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

      infoWindowsRef.current.set(marker, infoWindow);
      markersRef.current.push(marker);
    });

    console.log(`✅ Route 66 markers fully displayed: ${destinationCities.length} destinations + ${regularStops.length} regular stops = ${markersRef.current.length} total markers`);

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
