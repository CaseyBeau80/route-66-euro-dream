
import React, { useCallback, useState, useRef, useEffect } from 'react';
import RoutePolyline from './RoutePolyline';
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
      console.log('🔄 RouteDisplayManager: Resetting state for clean route rendering');
      
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
      console.log('✅ Waypoints loaded, single route system ready to render');
      
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

  console.log(`🛣️ RouteDisplayManager: Rendering SINGLE clean Route 66 polyline system`, {
    routeRendered,
    waypointsCount: waypoints.length,
    isMapReady
  });

  // ONLY render RoutePolyline - no other route systems to prevent conflicts
  return (
    <>
      {waypoints.length > 0 && (
        <RoutePolyline 
          map={map}
          waypoints={waypoints}
        />
      )}
    </>
  );
};

export default React.memo(RouteDisplayManager);
