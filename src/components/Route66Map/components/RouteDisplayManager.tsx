
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

  // Reset state when map changes
  useEffect(() => {
    if (map && isMapReady) {
      console.log('🔄 RouteDisplayManager: Resetting state for new map');
      setRouteRendered(false);
      activeRouteRef.current = null;
      // Start with polyline mode for better reliability
      setRouteDisplayMode('polyline');
    }
  }, [map, isMapReady]);

  // Handle waypoints loading success
  useEffect(() => {
    if (waypoints.length > 0 && routeDisplayMode === 'polyline' && !routeRendered) {
      console.log('✅ Waypoints loaded, polyline route should render');
      handleRouteSuccess('polyline');
    }
  }, [waypoints, routeDisplayMode, routeRendered, handleRouteSuccess]);

  // Don't render anything if map isn't ready
  if (!isMapReady) {
    console.log('⏳ RouteDisplayManager: Map not ready yet');
    return null;
  }

  // Show loading if waypoints are still loading
  if (waypointsLoading) {
    console.log('⏳ RouteDisplayManager: Waypoints still loading');
    return null;
  }

  // Handle waypoints error
  if (waypointsError) {
    console.error('❌ RouteDisplayManager: Waypoints error:', waypointsError);
    return null;
  }

  console.log(`🛣️ RouteDisplayManager: Rendering ${routeDisplayMode} route system`, {
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

export default RouteDisplayManager;
