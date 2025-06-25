
import React, { useEffect, useState, useRef } from 'react';
import { DirectRouteRenderer } from '../services/DirectRouteRenderer';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  const [routeRenderer, setRouteRenderer] = useState<DirectRouteRenderer | null>(null);
  const [isRouteCreated, setIsRouteCreated] = useState(false);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  console.log('🛣️ RoutePolyline: Rendering with', {
    waypointsCount: waypoints.length,
    hasMap: !!map,
    isRouteCreated,
    hasRenderer: !!routeRenderer
  });

  // Initialize renderer when map is available
  useEffect(() => {
    if (map && !routeRenderer) {
      console.log('🛣️ RoutePolyline: Initializing DirectRouteRenderer');
      const renderer = new DirectRouteRenderer(map);
      setRouteRenderer(renderer);
    }
  }, [map, routeRenderer]);

  // Create route when renderer and waypoints are available
  useEffect(() => {
    if (!routeRenderer || !waypoints.length || isRouteCreated) {
      return;
    }

    console.log('🛣️ RoutePolyline: Creating route with DirectRouteRenderer');
    
    try {
      // Clear any existing polylines first
      polylinesRef.current.forEach(polyline => {
        polyline.setMap(null);
      });
      polylinesRef.current = [];

      routeRenderer.createVisibleRoute(waypoints);
      
      // Get the polylines from the renderer and store them
      const newPolylines = routeRenderer.getPolylines();
      polylinesRef.current = newPolylines;
      
      console.log('🔍 RoutePolyline: Created polylines:', {
        count: newPolylines.length,
        attached: newPolylines.map(p => p.getMap() === map)
      });

      // Verify the route was created successfully after a short delay
      setTimeout(() => {
        const isVisible = routeRenderer.isRouteVisible();
        console.log('🔍 RoutePolyline: Route visibility check:', isVisible);
        
        if (isVisible && newPolylines.length > 0) {
          setIsRouteCreated(true);
          console.log('✅ RoutePolyline: Route successfully created and verified');
          
          // Double-check each polyline is still attached
          newPolylines.forEach((polyline, index) => {
            const attached = polyline.getMap() === map;
            console.log(`🔍 Polyline ${index + 1} still attached:`, attached);
            if (!attached) {
              console.log('🔧 Re-attaching polyline to map');
              polyline.setMap(map);
            }
          });
        } else {
          console.error('❌ RoutePolyline: Route creation failed verification');
        }
      }, 500); // Increased timeout to 500ms
      
    } catch (error) {
      console.error('❌ RoutePolyline: Error creating route:', error);
    }
  }, [routeRenderer, waypoints, isRouteCreated, map]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (routeRenderer) {
        console.log('🧹 RoutePolyline: Cleanup on unmount');
        routeRenderer.clearRoute();
      }
      // Also clean up our local references
      polylinesRef.current.forEach(polyline => {
        try {
          polyline.setMap(null);
        } catch (error) {
          console.warn('⚠️ Error cleaning up polyline:', error);
        }
      });
      polylinesRef.current = [];
    };
  }, [routeRenderer]);

  return null;
};

export default RoutePolyline;
