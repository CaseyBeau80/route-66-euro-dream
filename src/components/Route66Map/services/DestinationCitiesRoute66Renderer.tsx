
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

  // Initialize route renderer immediately when map is ready
  useEffect(() => {
    if (!isMapReady || !map || routeRenderer) return;

    console.log('🛣️ IMMEDIATE Route Renderer initialization - NO DELAYS');
    const renderer = new DestinationCitiesRouteRenderer(map);
    setRouteRenderer(renderer);

    return () => {
      console.log('🧹 Cleaning up route renderer on unmount');
      if (renderer) {
        renderer.cleanup();
      }
    };
  }, [map, isMapReady, routeRenderer]);

  // Render the route IMMEDIATELY when data is ready
  useEffect(() => {
    if (!routeRenderer || !destinationCities.length || isLoading || isRouteRendered) {
      console.log('🛣️ Route rendering conditions not met:', {
        hasRenderer: !!routeRenderer,
        citiesCount: destinationCities.length,
        isLoading,
        isRouteRendered
      });
      return;
    }

    console.log('🛣️ IMMEDIATE Route 66 rendering - NO NUCLEAR CLEANUP');
    console.log(`🏛️ Creating route with ${destinationCities.length} destination cities`);

    // Verify key cities are present
    const chicago = destinationCities.find(city => city.name.toLowerCase().includes('chicago'));
    const santaMonica = destinationCities.find(city => city.name.toLowerCase().includes('santa monica'));
    
    if (!chicago || !santaMonica) {
      console.error('❌ Missing key endpoint cities (Chicago or Santa Monica)');
      console.log('Available cities:', destinationCities.map(c => `${c.name}, ${c.state}`));
      return;
    }

    console.log('🏁 Route endpoints confirmed:', {
      start: `${chicago.name}, ${chicago.state}`,
      end: `${santaMonica.name}, ${santaMonica.state}`,
      totalCities: destinationCities.length
    });

    // Create the route IMMEDIATELY
    routeRenderer.createRoute66FromDestinations(destinationCities)
      .then(() => {
        console.log('✅ Route 66 SUCCESSFULLY created and should be VISIBLE');
        setIsRouteRendered(true);
        
        // Verify route creation
        const polylineCount = RouteGlobalState.getPolylineCount();
        console.log(`🔍 Route verification: ${polylineCount} polyline segments created`);
        
        if (polylineCount === 0) {
          console.error('❌ CRITICAL: No polylines were created despite successful route creation');
        } else {
          console.log('🎯 SUCCESS: Route 66 with dashed yellow center line should be VISIBLE now');
        }
      })
      .catch(error => {
        console.error('❌ CRITICAL ERROR creating Route 66:', error);
        setIsRouteRendered(false);
      });

  }, [routeRenderer, destinationCities, isLoading, isRouteRendered]);

  // Status logging for debugging
  useEffect(() => {
    const polylineCount = RouteGlobalState.getPolylineCount();
    
    console.log('📊 Route system status - ROAD RECOVERY MODE:', {
      isMapReady,
      hasRouteRenderer: !!routeRenderer,
      citiesLoaded: destinationCities.length,
      isLoading,
      isRouteRendered,
      polylineSegments: polylineCount,
      routeGlobalStateCreated: RouteGlobalState.isRouteCreated()
    });

    // Enhanced debugging for missing road
    if (isRouteRendered && polylineCount === 0) {
      console.error('🚨 ROAD MISSING: Route marked as rendered but no polylines found!');
    }
    
    if (!isRouteRendered && destinationCities.length > 0 && routeRenderer) {
      console.warn('⚠️ ROAD ISSUE: All conditions met but route not rendered yet');
    }
  }, [isMapReady, routeRenderer, destinationCities.length, isLoading, isRouteRendered]);

  return null;
};

export default DestinationCitiesRoute66Renderer;
