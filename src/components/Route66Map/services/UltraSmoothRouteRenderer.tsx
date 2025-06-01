
import React, { useEffect, useState } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { DirectionsApiRouteService } from './DirectionsApiRouteService';
import { RouteGlobalState } from './RouteGlobalState';

interface UltraSmoothRouteRendererProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const UltraSmoothRouteRenderer: React.FC<UltraSmoothRouteRendererProps> = ({
  map,
  isMapReady
}) => {
  const { waypoints, isLoading } = useSupabaseRoute66();
  const [routeService, setRouteService] = useState<DirectionsApiRouteService | null>(null);
  const [isRouteRendered, setIsRouteRendered] = useState(false);

  // Initialize route service
  useEffect(() => {
    if (!isMapReady || !map) return;

    const service = new DirectionsApiRouteService(map);
    setRouteService(service);

    return () => {
      // Cleanup on unmount
      RouteGlobalState.clearAll();
    };
  }, [map, isMapReady]);

  // Render the route when data is ready
  useEffect(() => {
    if (!routeService || !waypoints.length || isLoading || isRouteRendered) return;

    console.log('🗺️ UltraSmoothRouteRenderer: Starting realistic Route 66 rendering');

    // Filter to major stops only for main route
    const majorStops = waypoints
      .filter(waypoint => waypoint.is_major_stop === true)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    if (majorStops.length < 2) {
      console.warn('⚠️ Not enough major stops for route rendering');
      return;
    }

    console.log(`🛣️ Rendering Route 66 with ${majorStops.length} major stops using Directions API`);

    // Create realistic route
    routeService.createRealisticRoute66(majorStops)
      .then(() => {
        setIsRouteRendered(true);
        console.log('✅ Route 66 realistic route rendering completed');
      })
      .catch(error => {
        console.error('❌ Error rendering realistic Route 66:', error);
      });

  }, [routeService, waypoints, isLoading, isRouteRendered]);

  // Log current status
  useEffect(() => {
    if (!isMapReady) return;

    const polylineCount = RouteGlobalState.getPolylineCount();
    const rendererCount = RouteGlobalState.getRendererCount();
    
    console.log('📊 Route rendering status:', {
      isMapReady,
      waypointsLoaded: waypoints.length,
      isLoading,
      isRouteRendered,
      polylineSegments: polylineCount,
      directionsRenderers: rendererCount
    });
  }, [isMapReady, waypoints.length, isLoading, isRouteRendered]);

  return null;
};

export default UltraSmoothRouteRenderer;
