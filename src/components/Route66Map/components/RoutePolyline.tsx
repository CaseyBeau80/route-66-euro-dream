
import React, { useEffect, useState } from 'react';
import { RouteCreationService } from '../services/RouteCreationService';
import { NuclearCleanupService } from '../services/NuclearCleanupService';
import { RouteGlobalState } from '../services/RouteGlobalState';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  const [routeCreated, setRouteCreated] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  console.log('🛣️ RoutePolyline: Re-enabled and ready to create route', {
    waypointsCount: waypoints.length,
    hasMap: !!map,
    routeCreated,
    isCreating,
    globalRouteState: RouteGlobalState.isRouteCreated()
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
      console.log('🛣️ RoutePolyline: Starting route creation with waypoints:', waypoints.length);

      try {
        // Simple cleanup first
        const cleanupService = new NuclearCleanupService(map);
        cleanupService.performNuclearCleanup();

        // Small delay to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 100));

        // Create route with better error handling
        const routeService = new RouteCreationService(map);
        
        // Filter to major stops only for cleaner route
        const majorStops = waypoints.filter(wp => wp.is_major_stop).slice(0, 20); // Limit to prevent too many waypoints
        
        if (majorStops.length >= 2) {
          console.log('🛣️ RoutePolyline: Creating route with', majorStops.length, 'major stops');
          
          // Convert to destination city format for route creation
          const destinationCities = majorStops.map(wp => ({
            id: wp.id,
            name: wp.name,
            state: wp.state,
            latitude: Number(wp.latitude),
            longitude: Number(wp.longitude),
            description: wp.description
          }));

          await routeService.createFlowingRoute66(destinationCities);
          
          console.log('✅ RoutePolyline: Route created successfully');
          setRouteCreated(true);
          RouteGlobalState.setRouteCreated(true);
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
      if (map) {
        const cleanupService = new NuclearCleanupService(map);
        cleanupService.performNuclearCleanup();
      }
    };
  }, [map]);

  return null;
};

export default RoutePolyline;
