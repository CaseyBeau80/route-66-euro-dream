
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
      console.log('🔄 RouteDisplayManager: ABSOLUTELY ONLY Route66StaticPolyline - ALL other route services PERMANENTLY DISABLED');
      
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
      console.log('✅ Waypoints loaded, rendering SINGLE Route 66 road ONLY - NO OTHER ROUTES');
      
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

  console.log(`🛣️ RouteDisplayManager: Rendering ABSOLUTELY ONLY Route66StaticPolyline (waypoints: ${waypoints.length}) - NO SupabaseRoute66`);

  // ABSOLUTELY ONLY Route66StaticPolyline - NO SupabaseRoute66 component at all
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
