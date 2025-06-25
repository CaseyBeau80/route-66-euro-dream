
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
  const [routeCreated, setRouteCreated] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  console.log('🛣️ RoutePolyline: DEBUG STATE', {
    waypointsCount: waypoints.length,
    hasMap: !!map,
    routeCreated,
    isCreating,
    globalRouteState: RouteGlobalState.isRouteCreated(),
    globalPolylineCount: RouteGlobalState.getPolylineCount(),
    debugInfo: RouteGlobalState.getDebugInfo()
  });

  useEffect(() => {
    if (!map || !waypoints.length || routeCreated || isCreating || RouteGlobalState.isRouteCreated()) {
      console.log('🛣️ RoutePolyline: Skipping route creation', {
        hasMap: !!map,
        waypointsCount: waypoints.length,
        routeCreated,
        isCreating,
        globalRouteCreated: RouteGlobalState.isRouteCreated()
      });
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
          console.log('🛣️ RoutePolyline: Creating SIMPLE FALLBACK route first');
          
          // FIRST: Create a simple fallback route that should definitely work
          const fallbackCreator = new FallbackRouteCreator(map);
          fallbackCreator.createAsphaltFallbackRoute(majorStops);
          
          console.log('✅ RoutePolyline: Simple fallback route created');
          setRouteCreated(true);
          RouteGlobalState.setRouteCreated(true);
          
          // Verify the polylines are actually on the map
          const polylineCount = RouteGlobalState.getPolylineCount();
          console.log('🔍 RoutePolyline: Polyline verification after creation:', {
            count: polylineCount,
            globalDebug: RouteGlobalState.getDebugInfo()
          });
          
        } else {
          console.warn('⚠️ RoutePolyline: Not enough major stops for route creation');
        }
        
      } catch (error) {
        console.error('❌ RoutePolyline: Error creating route:', error);
        // Don't set routeCreated to true on error - allow retry
      } finally {
        setIsCreating(false);
      }
    };

    createRoute();
  }, [map, waypoints, routeCreated, isCreating]);

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
