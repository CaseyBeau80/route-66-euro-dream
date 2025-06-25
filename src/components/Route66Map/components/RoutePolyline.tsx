
import React, { useEffect, useState } from 'react';
import { AuthoritativeRoute66Renderer } from '../services/AuthoritativeRoute66Renderer';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  const [renderer, setRenderer] = useState<AuthoritativeRoute66Renderer | null>(null);

  console.log('🚀 RoutePolyline: AUTHORITATIVE APPROACH ONLY', {
    waypointsCount: waypoints.length,
    hasMap: !!map,
    hasRenderer: !!renderer
  });

  // Clear all existing instances when component mounts
  useEffect(() => {
    console.log('🧹 RoutePolyline: Clearing all existing route instances');
    AuthoritativeRoute66Renderer.clearAllInstances();
    
    // Create the ONE authoritative renderer
    const newRenderer = new AuthoritativeRoute66Renderer(map);
    setRenderer(newRenderer);

    return () => {
      console.log('🧹 RoutePolyline: Component cleanup');
      AuthoritativeRoute66Renderer.clearAllInstances();
    };
  }, [map]);

  // Create route when we have renderer and waypoints
  useEffect(() => {
    if (!renderer || !waypoints.length) {
      return;
    }

    console.log('🛣️ RoutePolyline: Creating Route 66 with authoritative renderer');
    
    try {
      renderer.createRoute66(waypoints);
      
      // Verify creation
      setTimeout(() => {
        const isVisible = renderer.isVisible();
        console.log('🔍 Route visibility after creation:', isVisible);
        
        if (!isVisible) {
          console.error('❌ RoutePolyline: Route not visible - THIS SHOULD NOT HAPPEN');
        } else {
          console.log('✅ RoutePolyline: Route successfully created and visible');
        }
      }, 200);
      
    } catch (error) {
      console.error('❌ RoutePolyline: Error creating route:', error);
    }
  }, [renderer, waypoints]);

  return null;
};

export default RoutePolyline;
