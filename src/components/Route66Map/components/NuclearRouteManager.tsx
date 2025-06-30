
import React, { useEffect, useRef } from 'react';
import { useRouteManager } from '../hooks/useRouteManager';

interface NuclearRouteManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const NuclearRouteManager: React.FC<NuclearRouteManagerProps> = ({ map, isMapReady }) => {
  const { waypoints, isLoading, error, hasCreatedRoute } = useRouteManager({
    map,
    isMapReady
  });
  
  const debugRef = useRef<NodeJS.Timeout | null>(null);

  // Add debugging to track route creation
  useEffect(() => {
    console.log('☢️ NuclearRouteManager: State update', {
      isMapReady,
      isLoading,
      error: !!error,
      waypointsCount: waypoints.length,
      hasCreatedRoute,
      mapExists: !!map
    });

    // Clear any existing debug timer
    if (debugRef.current) {
      clearTimeout(debugRef.current);
    }

    // Set a debug timer to check if route was created
    if (isMapReady && !isLoading && waypoints.length > 0 && !hasCreatedRoute) {
      debugRef.current = setTimeout(() => {
        console.log('⚠️ NuclearRouteManager: Route creation taking longer than expected');
        console.log('⚠️ Current state:', {
          hasMap: !!map,
          waypoints: waypoints.slice(0, 3).map(w => `${w.name}, ${w.state}`),
          totalWaypoints: waypoints.length
        });
      }, 3000);
    }

    return () => {
      if (debugRef.current) {
        clearTimeout(debugRef.current);
      }
    };
  }, [isMapReady, isLoading, error, waypoints.length, hasCreatedRoute, map]);

  console.log('☢️ NuclearRouteManager: Rendering with enhanced debugging', {
    isMapReady,
    isLoading,
    error,
    waypointsCount: waypoints.length,
    hasCreatedRoute
  });

  return null;
};

export default NuclearRouteManager;
