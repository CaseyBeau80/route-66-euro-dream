
import React, { useCallback, useState } from 'react';
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

  const handleSupabaseRouteFailure = useCallback(() => {
    console.log('⚠️ Supabase route failed, falling back to hybrid route system');
    setRouteDisplayMode('hybrid');
  }, []);

  if (!isMapReady) {
    return null;
  }

  return (
    <>
      {routeDisplayMode === 'supabase' ? (
        <SupabaseRoute66 
          map={map}
          onRouteError={handleSupabaseRouteFailure}
        />
      ) : (
        <HybridRouteService 
          map={map}
          directionsService={new google.maps.DirectionsService()}
          onRouteCalculated={(success) => {
            console.log(`🛣️ Hybrid route calculation completed: ${success ? 'success' : 'failed'}`);
          }}
        />
      )}
    </>
  );
};

export default RouteDisplayManager;
