
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { RouteRendererEffectHandler } from './RouteRendererEffectHandler';

interface UltraSmoothRouteRendererProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const UltraSmoothRouteRenderer: React.FC<UltraSmoothRouteRendererProps> = ({ 
  map, 
  isMapReady 
}) => {
  const effectHandlerRef = useRef<RouteRendererEffectHandler | null>(null);
  const { waypoints, isLoading, error } = useSupabaseRoute66();

  // Initialize the effect handler
  if (!effectHandlerRef.current && map) {
    effectHandlerRef.current = new RouteRendererEffectHandler(map);
  }

  useEffect(() => {
    const effectHandler = effectHandlerRef.current;
    if (!effectHandler) return;

    if (!effectHandler.shouldRender(isMapReady, isLoading, error, waypoints)) {
      return;
    }

    effectHandler.handleRender(waypoints).catch(error => {
      console.error('❌ Error in route rendering:', error);
      // Reset flags to allow retry
      effectHandler.reset();
    });

    // Cleanup function
    return effectHandler.getCleanupFunction();
  }, [map, isMapReady, waypoints, isLoading, error]);

  return null;
};

export default UltraSmoothRouteRenderer;
