
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
  const [isRouteRendered, setIsRouteRendered] = useState(false);

  // Initialize route renderer only once
  useEffect(() => {
    if (!isMapReady || !map || routeRenderer) return;

    console.log('🛣️ Initializing DestinationCitiesRouteRenderer');
    const renderer = new DestinationCitiesRouteRenderer(map);
    setRouteRenderer(renderer);

    return () => {
      console.log('🧹 Cleaning up route renderer on unmount');
      if (renderer) {
        renderer.cleanup();
      }
    };
  }, [map, isMapReady, routeRenderer]);

  // Render the route when data is ready
  useEffect(() => {
    if (!routeRenderer || !destinationCities.length || isLoading || isRouteRendered) {
      return;
    }

    console.log('🛣️ Starting Route 66 rendering with destination cities');
    console.log(`🏛️ Found ${destinationCities.length} destination cities for route creation`);

    // Check for key cities to ensure we have proper endpoints
    const chicago = destinationCities.find(city => city.name.toLowerCase().includes('chicago'));
    const santaMonica = destinationCities.find(city => city.name.toLowerCase().includes('santa monica'));
    
    if (!chicago || !santaMonica) {
      console.error('❌ Missing key endpoint cities (Chicago or Santa Monica)');
      return;
    }

    console.log('🏁 Route endpoints confirmed:', {
      start: `${chicago.name}, ${chicago.state}`,
      end: `${santaMonica.name}, ${santaMonica.state}`
    });

    // Create the route
    routeRenderer.createRoute66FromDestinations(destinationCities)
      .then(() => {
        console.log('✅ Destination cities Route 66 created successfully');
        setIsRouteRendered(true);
        
        // Verify polylines were created
        const polylineCount = RouteGlobalState.getPolylineCount();
        console.log(`🔍 Route verification: ${polylineCount} polyline segments created`);
        
        if (polylineCount === 0) {
          console.error('❌ No polylines were created despite successful route creation');
        }
      })
      .catch(error => {
        console.error('❌ Error creating destination cities Route 66:', error);
        setIsRouteRendered(false);
      });

  }, [routeRenderer, destinationCities, isLoading, isRouteRendered]);

  // Enhanced status logging
  useEffect(() => {
    const polylineCount = RouteGlobalState.getPolylineCount();
    
    console.log('📊 Enhanced route status:', {
      isMapReady,
      hasRouteRenderer: !!routeRenderer,
      citiesLoaded: destinationCities.length,
      isLoading,
      isRouteRendered,
      polylineSegments: polylineCount,
      routeGlobalStateCreated: RouteGlobalState.isRouteCreated()
    });

    if (isRouteRendered && polylineCount === 0) {
      console.warn('⚠️ Route marked as rendered but no polylines found in global state');
    }
  }, [isMapReady, routeRenderer, destinationCities.length, isLoading, isRouteRendered]);

  return null;
};

export default DestinationCitiesRoute66Renderer;
