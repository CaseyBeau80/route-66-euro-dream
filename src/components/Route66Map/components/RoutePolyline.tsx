
import React, { useEffect, useState } from 'react';
import { DirectRouteRenderer } from '../services/DirectRouteRenderer';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  const [routeRenderer, setRouteRenderer] = useState<DirectRouteRenderer | null>(null);
  const [isRouteCreated, setIsRouteCreated] = useState(false);

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
      routeRenderer.createVisibleRoute(waypoints);
      
      // Verify the route was created successfully
      setTimeout(() => {
        const isVisible = routeRenderer.isRouteVisible();
        console.log('🔍 RoutePolyline: Route visibility check:', isVisible);
        
        if (isVisible) {
          setIsRouteCreated(true);
          console.log('✅ RoutePolyline: Route successfully created and verified');
        } else {
          console.error('❌ RoutePolyline: Route creation failed verification');
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ RoutePolyline: Error creating route:', error);
    }
  }, [routeRenderer, waypoints, isRouteCreated]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (routeRenderer) {
        console.log('🧹 RoutePolyline: Cleanup on unmount');
        routeRenderer.clearRoute();
      }
    };
  }, [routeRenderer]);

  return null;
};

export default RoutePolyline;
