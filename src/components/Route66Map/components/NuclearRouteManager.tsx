
import React from 'react';
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

  console.log('☢️ NuclearRouteManager: Enhanced road renderer', {
    isMapReady,
    isLoading,
    error,
    waypointsCount: waypoints.length,
    hasCreatedRoute
  });

  return null;
};

export default NuclearRouteManager;
