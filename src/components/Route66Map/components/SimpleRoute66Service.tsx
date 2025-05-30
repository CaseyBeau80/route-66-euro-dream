
import React, { useEffect, useRef } from 'react';
import { comprehensiveRoute66Waypoints, validateComprehensiveWaypoints } from './waypoints/ComprehensiveRoute66Waypoints';

interface SimpleRoute66ServiceProps {
  map: google.maps.Map;
}

const SimpleRoute66Service: React.FC<SimpleRoute66ServiceProps> = ({ map }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const startMarkerRef = useRef<google.maps.Marker | null>(null);
  const endMarkerRef = useRef<google.maps.Marker | null>(null);
  const initializationRef = useRef<boolean>(false);

  useEffect(() => {
    if (!map) {
      console.log('⚠️ SimpleRoute66Service: Map not available yet');
      return;
    }

    if (initializationRef.current) {
      console.log('⚠️ SimpleRoute66Service: Route already initialized, skipping');
      return;
    }

    console.log('🚗 SimpleRoute66Service: Initializing Route 66 with comprehensive highway-accurate waypoints');
    initializationRef.current = true;

    // Validate waypoints before proceeding
    if (!validateComprehensiveWaypoints()) {
      console.error('❌ Waypoint validation failed');
      return;
    }

    renderRoute66();

    function renderRoute66() {
      console.log('🎯 SimpleRoute66Service: Creating highway-accurate Route 66 polyline');

      cleanup();

      // Use the comprehensive waypoints that follow actual highways
      const routePath = comprehensiveRoute66Waypoints.map(waypoint => ({
        lat: waypoint.lat,
        lng: waypoint.lng
      }));

      console.log('📍 Highway-accurate waypoints loaded:', {
        total: routePath.length,
        start: routePath[0],
        end: routePath[routePath.length - 1],
        highways: 'I-55, I-44, I-40, Historic US-66'
      });

      // Create the Route 66 polyline with enhanced visibility
      const polylineOptions: google.maps.PolylineOptions = {
        path: routePath,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 8,
        zIndex: 999999,
        clickable: true,
        visible: true
      };

      polylineRef.current = new google.maps.Polyline(polylineOptions);
      polylineRef.current.setMap(map);
      console.log('✅ Highway-accurate Route 66 polyline attached to map');

      // Immediate visibility verification and enhancement
      setTimeout(() => {
        if (polylineRef.current) {
          console.log('🔍 Polyline verification:');
          console.log('  - Polyline exists:', !!polylineRef.current);
          console.log('  - Attached to map:', !!polylineRef.current.getMap());
          console.log('  - Visible:', polylineRef.current.getVisible());
          console.log('  - Path length:', polylineRef.current.getPath()?.getLength());
          console.log('  - Following highways: I-55, I-44, I-40, Historic US-66');

          // Force visibility and styling
          polylineRef.current.setOptions({
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 8,
            zIndex: 999999,
            visible: true,
            geodesic: true
          });
        }
      }, 50);

      // Add click listener for route information
      if (polylineRef.current) {
        polylineRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
          console.log('🎯 Highway-accurate Route 66 clicked!', event.latLng?.toString());
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="color: red; font-weight: bold; padding: 10px;">
                🛣️ Route 66 - The Mother Road<br>
                <small>Following I-55, I-44, I-40 & Historic US-66</small>
              </div>
            `,
            position: event.latLng
          });
          infoWindow.open(map);
        });
      }

      // Create enhanced start marker (Chicago)
      startMarkerRef.current = new google.maps.Marker({
        position: routePath[0],
        map: map,
        title: 'Route 66 Start - Chicago, IL',
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="#22C55E" stroke="#fff" stroke-width="3"/>
              <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">START</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20)
        },
        zIndex: 1000000
      });

      // Create enhanced end marker (Santa Monica)
      endMarkerRef.current = new google.maps.Marker({
        position: routePath[routePath.length - 1],
        map: map,
        title: 'Route 66 End - Santa Monica, CA',
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="#EF4444" stroke="#fff" stroke-width="3"/>
              <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">END</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20)
        },
        zIndex: 1000000
      });

      console.log('✅ Enhanced start and end markers created');

      // Fit map bounds to show the entire route with padding
      const bounds = new google.maps.LatLngBounds();
      routePath.forEach(point => bounds.extend(point));
      
      map.fitBounds(bounds, {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100
      });

      console.log('✅ Highway-accurate Route 66 initialization complete');
    }

    function cleanup() {
      console.log('🧹 Cleaning up existing Route 66 elements');
      
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      
      if (startMarkerRef.current) {
        startMarkerRef.current.setMap(null);
        startMarkerRef.current = null;
      }
      
      if (endMarkerRef.current) {
        endMarkerRef.current.setMap(null);
        endMarkerRef.current = null;
      }
    }

    return () => {
      console.log('🧹 SimpleRoute66Service: Component unmounting - cleaning up highway-accurate service');
      cleanup();
      initializationRef.current = false;
    };
  }, [map]);

  return null;
};

export default SimpleRoute66Service;
