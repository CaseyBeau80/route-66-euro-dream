
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

    // Small delay to ensure map is fully ready
    setTimeout(() => {
      renderRoute66();
    }, 500);

    function renderRoute66() {
      console.log('🎯 SimpleRoute66Service: Starting Route 66 rendering with waypoints:', historicRoute66Waypoints.length);

      // Clean up any existing elements first
      cleanup();

      // Validate waypoints
      if (!historicRoute66Waypoints || historicRoute66Waypoints.length === 0) {
        console.error('❌ No waypoints available');
        return;
      }

      // Create the route path from waypoints
      const routePath = historicRoute66Waypoints.map(waypoint => ({
        lat: waypoint.lat,
        lng: waypoint.lng
      }));

      console.log('📍 Route path created:', {
        totalWaypoints: routePath.length,
        firstPoint: routePath[0],
        lastPoint: routePath[routePath.length - 1]
      });

      // Create the Route 66 polyline with enhanced visibility
      const polylineOptions: google.maps.PolylineOptions = {
        path: routePath,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 10,
        zIndex: 999999,
        clickable: true,
        visible: true
      };

      polylineRef.current = new google.maps.Polyline(polylineOptions);

      // Add polyline to map
      polylineRef.current.setMap(map);
      console.log('✅ SimpleRoute66Service: Route 66 polyline created and added to map');

      // Verify polyline attachment
      setTimeout(() => {
        if (polylineRef.current) {
          console.log('🔍 SimpleRoute66Service: Polyline verification:', {
            visible: polylineRef.current.getVisible(),
            map: polylineRef.current.getMap() ? 'attached' : 'not attached',
            pathLength: polylineRef.current.getPath()?.getLength()
          });

          // Force visibility if needed
          if (!polylineRef.current.getVisible()) {
            console.log('🔧 SimpleRoute66Service: Forcing visibility');
            polylineRef.current.setVisible(true);
          }
        }
      }, 200);

      // Create markers with simplified icons
      const startIcon = {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
            <circle cx="12.5" cy="12.5" r="10" fill="#22C55E" stroke="#fff" stroke-width="2"/>
            <text x="12.5" y="16" text-anchor="middle" fill="white" font-family="Arial" font-size="7" font-weight="bold">START</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(25, 25),
        anchor: new google.maps.Point(12.5, 12.5)
      };

      const endIcon = {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
            <circle cx="12.5" cy="12.5" r="10" fill="#EF4444" stroke="#fff" stroke-width="2"/>
            <text x="12.5" y="16" text-anchor="middle" fill="white" font-family="Arial" font-size="7" font-weight="bold">END</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(25, 25),
        anchor: new google.maps.Point(12.5, 12.5)
      };

      startMarkerRef.current = new google.maps.Marker({
        position: routePath[0],
        map: map,
        title: 'Route 66 Start - Chicago, IL',
        icon: startIcon,
        zIndex: 1000000
      });

      endMarkerRef.current = new google.maps.Marker({
        position: routePath[routePath.length - 1],
        map: map,
        title: 'Route 66 End - Santa Monica, CA',
        icon: endIcon,
        zIndex: 1000000
      });

      console.log('📍 SimpleRoute66Service: Start and end markers created');

      // Add click listener for debugging
      if (polylineRef.current) {
        polylineRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
          console.log('🎯 SimpleRoute66Service: Route 66 polyline clicked!', event.latLng?.toString());
          const infoWindow = new google.maps.InfoWindow({
            content: '<div style="color: red; font-weight: bold; padding: 10px;">🛣️ Route 66 - The Mother Road</div>',
            position: event.latLng
          });
          infoWindow.open(map);
        });
      }

      // Set up map bounds to show the entire route
      const bounds = new google.maps.LatLngBounds();
      routePath.forEach(point => bounds.extend(point));
      
      console.log('🗺️ SimpleRoute66Service: Setting map bounds to show full route');
      map.fitBounds(bounds, {
        top: 80,
        right: 80,
        bottom: 80,
        left: 80
      });

      console.log('✅ SimpleRoute66Service: Route 66 initialization complete');
    }

    function cleanup() {
      console.log('🧹 SimpleRoute66Service: Cleaning up existing Route 66 elements');
      
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
