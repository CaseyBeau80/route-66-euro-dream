
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
      console.log('⚠️ Map not available yet');
      return;
    }

    // Prevent multiple initializations
    if (initializationRef.current) {
      console.log('⚠️ Route already initialized, skipping');
      return;
    }

    console.log('🚗 Initializing Route 66 rendering service');
    initializationRef.current = true;

    // Small delay to ensure map is fully ready
    setTimeout(() => {
      renderRoute66();
    }, 100);

    function renderRoute66() {
      console.log('🎯 Starting Route 66 rendering with waypoints:', historicRoute66Waypoints.length);

      // Clean up any existing elements first
      cleanup();

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

      // Create the Route 66 polyline with maximum visibility
      polylineRef.current = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 15, // Extra thick for visibility
        zIndex: 999999, // Maximum z-index
        clickable: true,
        visible: true,
        icons: []
      });

      // Add polyline to map
      polylineRef.current.setMap(map);
      console.log('✅ Route 66 polyline created and added to map');

      // Log polyline properties for debugging
      console.log('🔍 Polyline properties:', {
        path: polylineRef.current.getPath()?.getLength(),
        visible: polylineRef.current.getVisible(),
        map: polylineRef.current.getMap() ? 'attached' : 'not attached',
        strokeColor: '#FF0000',
        strokeWeight: 15,
        zIndex: 999999
      });

      // Create start marker (Chicago)
      startMarkerRef.current = new google.maps.Marker({
        position: routePath[0],
        map: map,
        title: 'Route 66 Start - Chicago, IL',
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#22C55E" stroke="#fff" stroke-width="3"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">START</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20)
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
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="#fff" stroke-width="3"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">END</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20)
        },
        zIndex: 1000000
      });

      console.log('📍 Start and end markers created');

      // Add click listener for debugging
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

      // Set up map bounds to show the entire route
      const bounds = new google.maps.LatLngBounds();
      routePath.forEach(point => bounds.extend(point));
      
      console.log('🗺️ Setting map bounds to show full route');
      map.fitBounds(bounds, {
        top: 80,
        right: 80,
        bottom: 80,
        left: 80
      });

      // Add zoom listener for debugging
      const zoomListener = map.addListener('zoom_changed', () => {
        const currentZoom = map.getZoom();
        console.log(`🔍 Zoom level: ${currentZoom}`);
        
        // Force polyline visibility check at different zoom levels
        if (polylineRef.current) {
          const isVisible = polylineRef.current.getVisible();
          console.log(`👁️ Polyline visible at zoom ${currentZoom}: ${isVisible}`);
          
          // Force visibility if needed
          if (!isVisible) {
            console.log('🔧 Forcing polyline visibility');
            polylineRef.current.setVisible(true);
          }
        }
      });

      // Test zoom to specific area after 2 seconds
      setTimeout(() => {
        console.log('🎯 Testing zoom to Chicago area');
        const chicagoBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(41.4, -88.5),
          new google.maps.LatLng(42.2, -87.0)
        );
        map.fitBounds(chicagoBounds);
        
        // Check polyline visibility after zoom
        setTimeout(() => {
          if (polylineRef.current) {
            console.log('🔍 Post-zoom polyline check:', {
              visible: polylineRef.current.getVisible(),
              pathLength: polylineRef.current.getPath()?.getLength(),
              strokeWeight: polylineRef.current.get('strokeWeight'),
              strokeColor: polylineRef.current.get('strokeColor')
            });
          }
        }, 500);
      }, 2000);

      console.log('✅ Route 66 initialization complete');
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
      console.log('🧹 Component unmounting - cleaning up Route 66 service');
      cleanup();
      initializationRef.current = false;
    };
  }, [map]);

  return null;
};

export default SimpleRoute66Service;
