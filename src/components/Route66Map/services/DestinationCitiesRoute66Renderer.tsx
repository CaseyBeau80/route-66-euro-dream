
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

  // Initialize route renderer
  useEffect(() => {
    if (!isMapReady || !map) return;

    const renderer = new DestinationCitiesRouteRenderer(map);
    setRouteRenderer(renderer);

    return () => {
      // Cleanup on unmount
      RouteGlobalState.clearAll();
    };
  }, [map, isMapReady]);

  // Render the route when data is ready
  useEffect(() => {
    if (!routeRenderer || !destinationCities.length || isLoading || isRouteRendered) return;

    console.log('🛣️ DestinationCitiesRoute66Renderer: Starting Route 66 rendering with destination cities');

    console.log(`🏛️ Destination cities analysis:`, {
      totalCities: destinationCities.length,
      citiesByState: destinationCities.reduce((acc, city) => {
        acc[city.state] = (acc[city.state] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    });

    // Check for key cities
    const santaMonica = destinationCities.find(city => city.name.toLowerCase().includes('santa monica'));
    const chicago = destinationCities.find(city => city.name.toLowerCase().includes('chicago'));
    
    if (santaMonica) {
      console.log(`🎯 SANTA MONICA FOUND in destination cities!`, {
        name: santaMonica.name,
        state: santaMonica.state,
        coordinates: [santaMonica.latitude, santaMonica.longitude]
      });
    }
    
    if (chicago) {
      console.log(`🏁 CHICAGO FOUND in destination cities!`, {
        name: chicago.name,
        state: chicago.state,
        coordinates: [chicago.latitude, chicago.longitude]
      });
    }

    if (destinationCities.length < 2) {
      console.warn('⚠️ Not enough destination cities for route rendering');
      return;
    }

    console.log(`🛣️ Rendering Route 66 with ${destinationCities.length} destination cities`);

    // Create the route
    routeRenderer.createRoute66FromDestinations(destinationCities)
      .then(() => {
        setIsRouteRendered(true);
        console.log('✅ Destination cities Route 66 rendering completed');
      })
      .catch(error => {
        console.error('❌ Error rendering destination cities Route 66:', error);
      });

  }, [routeRenderer, destinationCities, isLoading, isRouteRendered]);

  // Log current status
  useEffect(() => {
    if (!isMapReady) return;

    const polylineCount = RouteGlobalState.getPolylineCount();
    
    console.log('📊 Destination cities route rendering status:', {
      isMapReady,
      citiesLoaded: destinationCities.length,
      isLoading,
      isRouteRendered,
      polylineSegments: polylineCount
    });

    if (destinationCities.length > 0) {
      console.log('🏛️ Destination cities summary:', destinationCities.map(city => ({
        name: city.name,
        state: city.state,
        coords: [city.latitude, city.longitude]
      })));
    }
  }, [isMapReady, destinationCities.length, isLoading, isRouteRendered]);

  return null;
};

export default DestinationCitiesRoute66Renderer;
