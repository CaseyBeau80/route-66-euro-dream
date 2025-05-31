
import React, { useCallback, useState, useRef, useEffect } from 'react';
import SupabaseRoute66 from './SupabaseRoute66';
import HybridRouteService from './directions/HybridRouteService';
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
  const [routeDisplayMode, setRouteDisplayMode] = useState<'polyline' | 'supabase' | 'hybrid'>('polyline');
  const [routeRendered, setRouteRendered] = useState(false);
  const activeRouteRef = useRef<'polyline' | 'supabase' | 'hybrid' | null>(null);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get waypoints for the polyline route
  const { waypoints, isLoading: waypointsLoading, error: waypointsError } = useSupabaseRoute66();

  const handleSupabaseRouteFailure = useCallback(() => {
    console.log('⚠️ Supabase route failed, falling back to hybrid route system');
    if (activeRouteRef.current !== 'hybrid') {
      activeRouteRef.current = 'hybrid';
      setRouteDisplayMode('hybrid');
      setRouteRendered(false);
    }
  }, []);

  const handleRouteSuccess = useCallback((mode: 'polyline' | 'supabase' | 'hybrid') => {
    console.log(`✅ Route rendered successfully using ${mode} system`);
    activeRouteRef.current = mode;
    setRouteRendered(true);
  }, []);

  // Reset state when map changes with debouncing
  useEffect(() => {
    if (map && isMapReady) {
      console.log('🔄 RouteDisplayManager: Resetting state for new map');
      
      // Clear any pending render timeout
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
      
      setRouteRendered(false);
      activeRouteRef.current = null;
      setRouteDisplayMode('polyline');
    }

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [map, isMapReady]);

  // Handle waypoints loading success with debouncing
  useEffect(() => {
    if (waypoints.length > 0 && routeDisplayMode === 'polyline' && !routeRendered) {
      console.log('✅ Waypoints loaded, polyline route should render');
      
      // Debounce route success to prevent multiple rapid calls
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
      
      renderTimeoutRef.current = setTimeout(() => {
        handleRouteSuccess('polyline');
      }, 100);
    }
  }, [waypoints, routeDisplayMode, routeRendered, handleRouteSuccess]);

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

  console.log(`🛣️ RouteDisplayManager: Rendering optimized ${routeDisplayMode} route system`, {
    routeRendered,
    waypointsCount: waypoints.length,
    mode: routeDisplayMode
  });

  return (
    <>
      {routeDisplayMode === 'polyline' && waypoints.length > 0 && (
        <RoutePolyline 
          map={map}
          waypoints={waypoints}
        />
      )}
      {routeDisplayMode === 'supabase' && !routeRendered && (
        <SupabaseRoute66 
          map={map}
          onRouteError={handleSupabaseRouteFailure}
          onRouteSuccess={() => handleRouteSuccess('supabase')}
        />
      )}
      {routeDisplayMode === 'hybrid' && !routeRendered && (
        <HybridRouteService 
          map={map}
          directionsService={new google.maps.DirectionsService()}
          onRouteCalculated={(success) => {
            console.log(`🛣️ Hybrid route calculation completed: ${success ? 'success' : 'failed'}`);
            if (success) {
              handleRouteSuccess('hybrid');
            }
          }}
        />
      )}
    </>
  );
};

export default React.memo(RouteDisplayManager);
