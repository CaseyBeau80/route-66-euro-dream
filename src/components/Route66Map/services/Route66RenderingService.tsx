
import React, { useEffect, useRef, useState } from 'react';
import { historicRoute66Waypoints } from '../components/HistoricRoute66Waypoints';

interface Route66RenderingServiceProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const Route66RenderingService: React.FC<Route66RenderingServiceProps> = ({ 
  map, 
  isMapReady 
}) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const startMarkerRef = useRef<google.maps.Marker | null>(null);
  const endMarkerRef = useRef<google.maps.Marker | null>(null);
  const [routeRendered, setRouteRendered] = useState(false);
  const renderAttemptRef = useRef(0);

  useEffect(() => {
    if (!map || !isMapReady || routeRendered) {
      console.log('🔍 Route rendering conditions:', {
        hasMap: !!map,
        isMapReady,
        routeRendered,
        shouldRender: !!(map && isMapReady && !routeRendered)
      });
      return;
    }

    renderAttemptRef.current += 1;
    const attemptNumber = renderAttemptRef.current;
    
    console.log(`🎨 Route66RenderingService: Starting render attempt #${attemptNumber}`);

    // Add a small delay to ensure map is fully stabilized
    const renderTimeout = setTimeout(() => {
      renderRoute66(attemptNumber);
    }, 200);

    return () => {
      clearTimeout(renderTimeout);
    };
  }, [map, isMapReady, routeRendered]);

  const renderRoute66 = (attemptNumber: number) => {
    try {
      console.log(`🚗 Rendering Route 66 (attempt #${attemptNumber})`);
      
      // Clean up existing elements
      cleanup();

      // Validate waypoints
      if (!historicRoute66Waypoints || historicRoute66Waypoints.length === 0) {
        console.error('❌ No waypoints available for Route 66');
        return;
      }

      // Create route path
      const routePath = historicRoute66Waypoints.map(waypoint => ({
        lat: waypoint.lat,
        lng: waypoint.lng
      }));

      console.log('📍 Route path prepared:', {
        waypointCount: routePath.length,
        firstPoint: routePath[0],
        lastPoint: routePath[routePath.length - 1]
      });

      // Create polyline with maximum visibility settings
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
      
      // Attach to map
      polylineRef.current.setMap(map);
      
      console.log('✅ Polyline created and attached to map');

      // Force visibility check
      setTimeout(() => {
        if (polylineRef.current) {
          const isVisible = polylineRef.current.getVisible();
          const attachedMap = polylineRef.current.getMap();
          
          console.log('🔍 Polyline status check:', {
            visible: isVisible,
            attachedToMap: !!attachedMap,
            pathLength: polylineRef.current.getPath()?.getLength()
          });

          // Force visibility if needed
          if (!isVisible) {
            console.log('🔧 Forcing polyline visibility');
            polylineRef.current.setVisible(true);
          }

          // Re-attach to map if needed
          if (!attachedMap) {
            console.log('🔧 Re-attaching polyline to map');
            polylineRef.current.setMap(map);
          }
        }
      }, 300);

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

      console.log('📍 Start and end markers created');

      // Add click listener for polyline
      if (polylineRef.current) {
        const clickListener = polylineRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
          console.log('🎯 Route 66 polyline clicked!', event.latLng?.toString());
          const infoWindow = new google.maps.InfoWindow({
            content: '<div style="color: red; font-weight: bold; padding: 10px;">🛣️ Route 66 - The Mother Road</div>',
            position: event.latLng
          });
          infoWindow.open(map);
        });
      }

      // Set map bounds to show route
      const bounds = new google.maps.LatLngBounds();
      routePath.forEach(point => bounds.extend(point));
      
      console.log('🗺️ Fitting map bounds to show full route');
      map.fitBounds(bounds, {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
      });

      // Mark as rendered
      setRouteRendered(true);
      console.log('✅ Route 66 rendering completed successfully');

    } catch (error) {
      console.error('❌ Error rendering Route 66:', error);
      
      // Retry after a delay if this was the first attempt
      if (attemptNumber === 1) {
        console.log('🔄 Retrying route rendering in 1 second...');
        setTimeout(() => {
          renderRoute66(2);
        }, 1000);
      }
    }
  };

  const cleanup = () => {
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
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Route66RenderingService unmounting - cleaning up');
      cleanup();
    };
  }, []);

  return null;
};

export default Route66RenderingService;
