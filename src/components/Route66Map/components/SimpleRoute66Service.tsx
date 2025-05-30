
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

    // Small delay to ensure map is fully ready
    setTimeout(() => {
      renderRoute66();
    }, 500);

    function renderRoute66() {
      console.log('🎯 SimpleRoute66Service: Starting Route 66 rendering');

      // Clean up any existing elements first
      cleanup();

      // Create the route path from waypoints
      const routePath = historicRoute66Waypoints.map(waypoint => ({
        lat: waypoint.lat,
        lng: waypoint.lng
      }));

      console.log('🛣️ Creating Route 66 polyline with', routePath.length, 'points');

      // Create the Route 66 polyline with maximum visibility
      const polylineOptions: google.maps.PolylineOptions = {
        path: routePath,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 12, // Extra thick for visibility
        zIndex: 999999,
        clickable: true,
        visible: true
      };

      polylineRef.current = new google.maps.Polyline(polylineOptions);
      polylineRef.current.setMap(map);
      
      console.log('✅ Route 66 polyline created and added to map');

      // Verify polyline is visible after a short delay
      setTimeout(() => {
        if (polylineRef.current) {
          const isVisible = polylineRef.current.getVisible();
          const attachedMap = polylineRef.current.getMap();
          
          console.log('🔍 Polyline verification:', {
            visible: isVisible,
            attachedToMap: !!attachedMap,
            pathLength: polylineRef.current.getPath()?.getLength()
          });

          // Force visibility if needed
          if (!isVisible) {
            console.log('🔧 Forcing polyline visibility');
            polylineRef.current.setVisible(true);
          }
        }
      }, 200);

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

      // Fit map bounds to show the entire route
      const bounds = new google.maps.LatLngBounds();
      routePath.forEach(point => bounds.extend(point));
      
      map.fitBounds(bounds, {
        top: 80,
        right: 80,
        bottom: 80,
        left: 80
      });

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
