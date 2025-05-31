
import React, { useCallback, useState, useRef, useEffect } from 'react';
import Route66StaticPolyline from './Route66StaticPolyline';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';

interface RouteDisplayManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const RouteDisplayManager: React.FC<RouteDisplayManagerProps> = ({ 
  map, 
  isMapReady 
}) => {
  const [routeRendered, setRouteRendered] = useState(false);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get waypoints for the single route system
  const { waypoints, isLoading: waypointsLoading, error: waypointsError } = useSupabaseRoute66();

  // Reset state when map changes
  useEffect(() => {
    if (map && isMapReady) {
      console.log('🔄 RouteDisplayManager: Resetting state for SINGLE Route66StaticPolyline rendering');
      
      // Clear any pending render timeout
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
      
      setRouteRendered(false);
    }

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [map, isMapReady]);

  // Handle waypoints loading success
  useEffect(() => {
    if (waypoints.length > 0 && !routeRendered && isMapReady) {
      console.log('✅ Waypoints loaded, SINGLE Route 66 system ready to render');
      
      // Debounce route success to prevent multiple rapid calls
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
      
      renderTimeoutRef.current = setTimeout(() => {
        setRouteRendered(true);
      }, 100);
    }
  }, [waypoints, routeRendered, isMapReady]);

  // Early returns for better performance
  if (!isMapReady) {
    console.log('⏳ RouteDisplayManager: Map not ready yet');
    return null;
  }

  if (waypointsLoading) {
    console.log('⏳ RouteDisplayManager: Waypoints still loading');
    return null;
  }

  if (waypointsError) {
    console.error('❌ RouteDisplayManager: Waypoints error:', waypointsError);
    return null;
  }

  console.log(`🛣️ RouteDisplayManager: Rendering SINGLE Route66StaticPolyline ONLY`, {
    routeRendered,
    waypointsCount: waypoints.length,
    isMapReady
  });

  // Use ONLY Route66StaticPolyline - all other route services are disabled
  return (
    <>
      {waypoints.length > 0 && isMapReady && (
        <Route66StaticPolyline 
          map={map}
        />
      )}
    </>
  );
};

export default React.memo(RouteDisplayManager);
