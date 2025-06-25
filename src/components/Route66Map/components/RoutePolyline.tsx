
import React, { useEffect, useState } from 'react';
import { AuthoritativeRoute66Renderer } from '../services/AuthoritativeRoute66Renderer';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  const [renderer, setRenderer] = useState<AuthoritativeRoute66Renderer | null>(null);

  console.log('🚀 RoutePolyline: THE SINGLE AUTHORITATIVE ROUTE SYSTEM', {
    waypointsCount: waypoints.length,
    hasMap: !!map,
    hasRenderer: !!renderer
  });

  // Clear all existing instances when component mounts - NUCLEAR APPROACH
  useEffect(() => {
    console.log('🧨 RoutePolyline: NUCLEAR CLEANUP - Clearing ALL route instances');
    AuthoritativeRoute66Renderer.clearAllInstances();
    
    // Wait a moment for cleanup, then create the ONE authoritative renderer
    setTimeout(() => {
      console.log('🏗️ RoutePolyline: Creating THE SINGLE authoritative renderer');
      const newRenderer = new AuthoritativeRoute66Renderer(map);
      setRenderer(newRenderer);
    }, 100);

    return () => {
      console.log('🧨 RoutePolyline: Component cleanup - NUCLEAR');
      AuthoritativeRoute66Renderer.clearAllInstances();
    };
  }, [map]);

  // Create route when we have renderer and waypoints
  useEffect(() => {
    if (!renderer || !waypoints.length) {
      return;
    }

    console.log('🛣️ RoutePolyline: Creating THE SINGLE Route 66 with authoritative renderer');
    
    try {
      renderer.createRoute66(waypoints);
      
      // Verify creation
      setTimeout(() => {
        const isVisible = renderer.isVisible();
        console.log('🔍 THE SINGLE Route visibility after creation:', isVisible);
        
        if (!isVisible) {
          console.error('❌ RoutePolyline: THE SINGLE Route not visible - CRITICAL ERROR');
        } else {
          console.log('✅ RoutePolyline: THE SINGLE Route successfully created and visible');
        }
      }, 200);
      
    } catch (error) {
      console.error('❌ RoutePolyline: Error creating THE SINGLE route:', error);
    }
  }, [renderer, waypoints]);

  return null;
};

export default RoutePolyline;
