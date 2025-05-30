
import React, { useEffect, useRef } from 'react';
import { historicRoute66Waypoints } from './HistoricRoute66Waypoints';

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

    // Prevent multiple initializations
    if (initializationRef.current) {
      console.log('⚠️ SimpleRoute66Service: Route already initialized, skipping');
      return;
    }

    console.log('🚗 SimpleRoute66Service: Initializing Route 66 rendering service');
    initializationRef.current = true;

    // Validate waypoints first
    if (!historicRoute66Waypoints || historicRoute66Waypoints.length === 0) {
      console.error('❌ No waypoints available for Route 66');
      return;
    }

    console.log('📍 Route waypoints loaded:', {
      total: historicRoute66Waypoints.length,
      first: historicRoute66Waypoints[0],
      last: historicRoute66Waypoints[historicRoute66Waypoints.length - 1]
    });

    // Immediate rendering to test
    renderRoute66();

    function renderRoute66() {
      console.log('🎯 SimpleRoute66Service: Starting Route 66 rendering IMMEDIATELY');

      // Clean up any existing elements first
      cleanup();

      // Create the route path from waypoints
      const routePath = historicRoute66Waypoints.map(waypoint => ({
        lat: waypoint.lat,
        lng: waypoint.lng
      }));

      console.log('🛣️ Creating Route 66 polyline with', routePath.length, 'points');
      console.log('📍 First 3 points:', routePath.slice(0, 3));
      console.log('📍 Last 3 points:', routePath.slice(-3));

      // Create the Route 66 polyline with maximum visibility
      const polylineOptions: google.maps.PolylineOptions = {
        path: routePath,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 15, // Even thicker for maximum visibility
        zIndex: 999999,
        clickable: true,
        visible: true
      };

      console.log('🔧 Creating polyline with options:', polylineOptions);

      polylineRef.current = new google.maps.Polyline(polylineOptions);
      console.log('✅ Polyline object created:', polylineRef.current);
      
      polylineRef.current.setMap(map);
      console.log('✅ Route 66 polyline attached to map');

      // Force visibility and verify immediately
      setTimeout(() => {
        if (polylineRef.current) {
          console.log('🔍 IMMEDIATE polyline verification:');
          console.log('  - Polyline exists:', !!polylineRef.current);
          console.log('  - Attached to map:', !!polylineRef.current.getMap());
          console.log('  - Visible:', polylineRef.current.getVisible());
          console.log('  - Path length:', polylineRef.current.getPath()?.getLength());
          console.log('  - Stroke color:', polylineRef.current.get('strokeColor'));
          console.log('  - Stroke weight:', polylineRef.current.get('strokeWeight'));
          console.log('  - Z-index:', polylineRef.current.get('zIndex'));

          // Force all properties again
          polylineRef.current.setOptions({
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 15,
            zIndex: 999999,
            visible: true
          });

          console.log('🔧 Forced all polyline properties again');
        }
      }, 50);

      // Add click listener to polyline
      if (polylineRef.current) {
        polylineRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
          console.log('🎯 Route 66 polyline clicked!', event.latLng?.toString());
          const infoWindow = new google.maps.InfoWindow({
            content: '<div style="color: red; font-weight: bold; padding: 10px;">🛣️ Route 66 - The Mother Road</div>',
            position: event.latLng
          });
          infoWindow.open(map);
        });
      }

      // Create start marker (Chicago) with higher visibility
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

      // Create end marker (Santa Monica) with higher visibility
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

      console.log('✅ Start and end markers created');

      // Fit map bounds to show the entire route
      const bounds = new google.maps.LatLngBounds();
      routePath.forEach(point => bounds.extend(point));
      
      map.fitBounds(bounds, {
        top: 80,
        right: 80,
        bottom: 80,
        left: 80
      });

      console.log('✅ Map bounds fitted to route');
      console.log('✅ SimpleRoute66Service: Route 66 initialization complete');
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

    // Cleanup function
    return () => {
      console.log('🧹 SimpleRoute66Service: Component unmounting - cleaning up Route 66 service');
      cleanup();
      initializationRef.current = false;
    };
  }, [map]);

  return null;
};

export default SimpleRoute66Service;
