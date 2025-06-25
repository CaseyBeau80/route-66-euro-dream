
import React, { useEffect, useState } from 'react';
import { SimplifiedRouteRenderer } from '../services/routing/SimplifiedRouteRenderer';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  const [renderer, setRenderer] = useState<SimplifiedRouteRenderer | null>(null);
  const [routeCreated, setRouteCreated] = useState(false);

  console.log('🛣️ RoutePolyline: SIMPLIFIED APPROACH', {
    waypointsCount: waypoints.length,
    hasMap: !!map,
    hasRenderer: !!renderer,
    routeCreated
  });

  // Initialize renderer
  useEffect(() => {
    if (map && !renderer) {
      console.log('🔧 RoutePolyline: Initializing SimplifiedRouteRenderer');
      const newRenderer = new SimplifiedRouteRenderer(map);
      setRenderer(newRenderer);
    }
  }, [map, renderer]);

  // Create route when we have renderer and waypoints
  useEffect(() => {
    if (!renderer || !waypoints.length || routeCreated) {
      return;
    }

    console.log('🛣️ RoutePolyline: Creating route with simplified approach');
    
    try {
      renderer.createRoute66(waypoints);
      
      // Verify creation
      setTimeout(() => {
        const isVisible = renderer.isVisible();
        console.log('🔍 Route visibility after creation:', isVisible);
        
        if (isVisible) {
          setRouteCreated(true);
          console.log('✅ RoutePolyline: Route successfully created and visible');
        } else {
          console.error('❌ RoutePolyline: Route not visible after creation');
        }
      }, 200);
      
    } catch (error) {
      console.error('❌ RoutePolyline: Error creating route:', error);
    }
  }, [renderer, waypoints, routeCreated]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (renderer) {
        console.log('🧹 RoutePolyline: Cleanup');
        renderer.clearRoute();
      }
    };
  }, [renderer]);

  return null;
};

export default RoutePolyline;
