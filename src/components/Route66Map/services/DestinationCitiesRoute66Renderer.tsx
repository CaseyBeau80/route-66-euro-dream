
import React, { useEffect, useState } from 'react';
import { useDestinationCities } from '../hooks/useDestinationCities';
import { DestinationCitiesRouteRenderer } from './DestinationCitiesRouteRenderer';
import { RouteGlobalState } from './RouteGlobalState';

interface DestinationCitiesRoute66RendererProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const DestinationCitiesRoute66Renderer: React.FC<DestinationCitiesRoute66RendererProps> = ({
  map,
  isMapReady
}) => {
  const { destinationCities, isLoading } = useDestinationCities();
  const [routeRenderer, setRouteRenderer] = useState<DestinationCitiesRouteRenderer | null>(null);
  const [hasRendered, setHasRendered] = useState(false);

  // Initialize route renderer once
  useEffect(() => {
    if (!isMapReady || !map || routeRenderer) return;

    console.log('🛣️ ULTRA SIMPLE: Initializing Route Renderer');
    const renderer = new DestinationCitiesRouteRenderer(map);
    setRouteRenderer(renderer);

    return () => {
      console.log('🧹 Cleaning up route renderer on unmount');
      if (renderer) {
        renderer.cleanup();
      }
    };
  }, [map, isMapReady, routeRenderer]);

  // Create route only once when conditions are met
  useEffect(() => {
    if (!routeRenderer || !destinationCities.length || isLoading || hasRendered) {
      return;
    }

    console.log('🛣️ ULTRA SIMPLE: Creating route ONCE');
    
    const createRoute = async () => {
      try {
        await routeRenderer.createRoute66FromDestinations(destinationCities);
        setHasRendered(true);
        console.log('✅ Route created successfully - stopping future renders');
      } catch (error) {
        console.error('❌ Error creating route:', error);
        // Don't set hasRendered to true on error, allow retry
      }
    };

    createRoute();

  }, [routeRenderer, destinationCities, isLoading, hasRendered]);

  // Log status for debugging
  useEffect(() => {
    console.log('📊 Route Renderer Status:', {
      isMapReady,
      hasRouteRenderer: !!routeRenderer,
      citiesLoaded: destinationCities.length,
      isLoading,
      hasRendered,
      polylineCount: RouteGlobalState.getPolylineCount()
    });
  }, [isMapReady, routeRenderer, destinationCities.length, isLoading, hasRendered]);

  return null;
};

export default DestinationCitiesRoute66Renderer;
