
import React, { useEffect, useState } from 'react';
import { RouteCreationService } from '../services/RouteCreationService';
import { NuclearCleanupService } from '../services/NuclearCleanupService';
import { RouteGlobalState } from '../services/RouteGlobalState';
import { FallbackRouteCreator } from '../services/FallbackRouteCreator';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  const [isCreating, setIsCreating] = useState(false);

  console.log('🛣️ RoutePolyline: DEBUG STATE', {
    waypointsCount: waypoints.length,
    hasMap: !!map,
    isCreating,
    globalRouteState: RouteGlobalState.isRouteCreated(),
    globalPolylineCount: RouteGlobalState.getPolylineCount(),
    debugInfo: RouteGlobalState.getDebugInfo()
  });

  useEffect(() => {
    // Only check global state and creation status - remove local routeCreated state
    if (!map || !waypoints.length || isCreating) {
      console.log('🛣️ RoutePolyline: Skipping route creation', {
        hasMap: !!map,
        waypointsCount: waypoints.length,
        isCreating,
        globalRouteCreated: RouteGlobalState.isRouteCreated(),
        globalPolylineCount: RouteGlobalState.getPolylineCount()
      });
      return;
    }

    // Check if we actually have visible polylines, not just the global flag
    const actualPolylineCount = RouteGlobalState.getPolylineCount();
    if (actualPolylineCount > 0) {
      console.log('🛣️ RoutePolyline: Route already exists with', actualPolylineCount, 'polylines');
      return;
    }

    const createRoute = async () => {
      setIsCreating(true);
      console.log('🛣️ RoutePolyline: STARTING ROUTE CREATION WITH FALLBACK');

      try {
        // Clear everything first
        const cleanupService = new NuclearCleanupService(map);
        cleanupService.performNuclearCleanup();
        RouteGlobalState.clearAll();

        // Small delay to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 200));

        // Filter to major stops only
        const majorStops = waypoints.filter(wp => wp.is_major_stop).slice(0, 15);
        
        if (majorStops.length >= 2) {
          console.log('🛣️ RoutePolyline: Creating SIMPLE FALLBACK route with', majorStops.length, 'stops');
          
          // Create a simple fallback route that should definitely work
          const fallbackCreator = new FallbackRouteCreator(map);
          fallbackCreator.createAsphaltFallbackRoute(majorStops);
          
          console.log('✅ RoutePolyline: Simple fallback route created');
          RouteGlobalState.setRouteCreated(true);
          
          // Verify the polylines are actually on the map after a brief delay
          setTimeout(() => {
            const polylineCount = RouteGlobalState.getPolylineCount();
            console.log('🔍 RoutePolyline: Polyline verification after creation:', {
              count: polylineCount,
              globalDebug: RouteGlobalState.getDebugInfo()
            });
            
            if (polylineCount === 0) {
              console.error('❌ RoutePolyline: Polylines disappeared after creation!');
            } else {
              console.log('✅ RoutePolyline: Polylines successfully visible on map');
            }
          }, 300);
          
        } else {
          console.warn('⚠️ RoutePolyline: Not enough major stops for route creation');
        }
        
      } catch (error) {
        console.error('❌ RoutePolyline: Error creating route:', error);
        // Clear global state on error so we can retry
        RouteGlobalState.clearAll();
      } finally {
        setIsCreating(false);
      }
    };

    createRoute();
  }, [map, waypoints, isCreating]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 RoutePolyline: Cleanup on unmount');
      // Don't cleanup - let the route persist
    };
  }, [map]);

  return null;
};

export default RoutePolyline;
