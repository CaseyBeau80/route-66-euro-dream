
import React, { useCallback, useState, useRef, useEffect } from 'react';
import SupabaseRoute66 from './SupabaseRoute66';
import HybridRouteService from './directions/HybridRouteService';

interface RouteDisplayManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const RouteDisplayManager: React.FC<RouteDisplayManagerProps> = ({ 
  map, 
  isMapReady 
}) => {
  const [routeDisplayMode, setRouteDisplayMode] = useState<'supabase' | 'hybrid'>('supabase');
  const [routeRendered, setRouteRendered] = useState(false);
  const activeRouteRef = useRef<'supabase' | 'hybrid' | null>(null);

  const handleSupabaseRouteFailure = useCallback(() => {
    console.log('⚠️ Supabase route failed, falling back to hybrid route system');
    if (activeRouteRef.current !== 'hybrid') {
      activeRouteRef.current = 'hybrid';
      setRouteDisplayMode('hybrid');
      setRouteRendered(false);
    }
  }, []);

  const handleRouteSuccess = useCallback((mode: 'supabase' | 'hybrid') => {
    console.log(`✅ Route rendered successfully using ${mode} system`);
    activeRouteRef.current = mode;
    setRouteRendered(true);
  }, []);

  // Reset state when map changes
  useEffect(() => {
    if (map && isMapReady) {
      setRouteRendered(false);
      activeRouteRef.current = null;
    }
  }, [map, isMapReady]);

  if (!isMapReady || routeRendered) {
    return null;
  }

  console.log(`🛣️ RouteDisplayManager: Rendering ${routeDisplayMode} route system`);

  return (
    <>
      {routeDisplayMode === 'supabase' && !routeRendered ? (
        <SupabaseRoute66 
          map={map}
          onRouteError={handleSupabaseRouteFailure}
          onRouteSuccess={() => handleRouteSuccess('supabase')}
        />
      ) : routeDisplayMode === 'hybrid' && !routeRendered ? (
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
      ) : null}
    </>
  );
};

export default RouteDisplayManager;
