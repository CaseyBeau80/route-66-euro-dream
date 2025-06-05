
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
  const [renderKey, setRenderKey] = useState(0);

  // Initialize route renderer immediately when map is ready
  useEffect(() => {
    if (!isMapReady || !map || routeRenderer) return;

    console.log('🛣️ FORCE INITIALIZING Route Renderer with cache clearing');
    const renderer = new DestinationCitiesRouteRenderer(map);
    setRouteRenderer(renderer);

    return () => {
      console.log('🧹 Cleaning up route renderer on unmount');
      if (renderer) {
        renderer.cleanup();
      }
    };
  }, [map, isMapReady, routeRenderer]);

  // FORCE render the route with cache clearing and debugging
  useEffect(() => {
    if (!routeRenderer || !destinationCities.length || isLoading) {
      console.log('🛣️ Route rendering conditions not met:', {
        hasRenderer: !!routeRenderer,
        citiesCount: destinationCities.length,
        isLoading,
        renderKey
      });
      return;
    }

    console.log('🛣️ FORCE RENDERING Route 66 with enhanced debugging');
    console.log(`🏛️ Creating route with ${destinationCities.length} destination cities`);

    // Enhanced city validation with debugging
    const chicago = destinationCities.find(city => city.name.toLowerCase().includes('chicago'));
    const santaMonica = destinationCities.find(city => city.name.toLowerCase().includes('santa monica'));
    const santaFe = destinationCities.find(city => city.name.toLowerCase().includes('santa fe'));
    const albuquerque = destinationCities.find(city => city.name.toLowerCase().includes('albuquerque'));
    const santaRosa = destinationCities.find(city => city.name.toLowerCase().includes('santa rosa'));
    const gallup = destinationCities.find(city => city.name.toLowerCase().includes('gallup'));
    
    console.log('🔧 DEBUG: Key cities validation:', {
      hasChicago: !!chicago,
      hasSantaMonica: !!santaMonica,
      hasSantaFe: !!santaFe,
      hasAlbuquerque: !!albuquerque,
      hasSantaRosa: !!santaRosa,
      hasGallup: !!gallup,
      chicagoCoords: chicago ? `${chicago.latitude}, ${chicago.longitude}` : 'N/A',
      santaMonicaCoords: santaMonica ? `${santaMonica.latitude}, ${santaMonica.longitude}` : 'N/A',
      santaFeCoords: santaFe ? `${santaFe.latitude}, ${santaFe.longitude}` : 'N/A'
    });
    
    if (!chicago || !santaMonica) {
      console.error('❌ Missing key endpoint cities (Chicago or Santa Monica)');
      console.log('Available cities:', destinationCities.map(c => `${c.name}, ${c.state}`));
      return;
    }

    if (!santaFe) {
      console.warn('⚠️ Santa Fe not found - branch route will not be created');
    }

    if (!santaRosa || !gallup) {
      console.error('❌ Missing Santa Rosa or Gallup for direct connection');
    }

    console.log('🏁 Route endpoints confirmed for FORCE creation:', {
      start: `${chicago.name}, ${chicago.state}`,
      end: `${santaMonica.name}, ${santaMonica.state}`,
      totalCities: destinationCities.length,
      santaFeBranch: santaFe ? `${santaFe.name}, ${santaFe.state}` : 'Not available'
    });

    // FORCE create the route with enhanced debugging
    const createRouteWithDebugging = async () => {
      try {
        console.log('🔧 DEBUG: Starting route creation process...');
        
        // Clear any existing route state
        RouteGlobalState.setRouteCreated(false);
        setIsRouteRendered(false);
        
        await routeRenderer.createRoute66FromDestinations(destinationCities);
        
        console.log('✅ Route 66 FORCE CREATED and should be VISIBLE');
        setIsRouteRendered(true);
        
        // Verify route creation with detailed logging
        setTimeout(() => {
          const polylineCount = RouteGlobalState.getPolylineCount();
          const routeCreated = RouteGlobalState.isRouteCreated();
          
          console.log(`🔍 Route verification after creation:`, {
            polylineCount,
            routeCreated,
            renderKey,
            timestamp: new Date().toISOString()
          });
          
          if (polylineCount === 0) {
            console.error('❌ CRITICAL: No polylines were created despite successful route creation');
            console.log('🔧 DEBUG: Attempting to force re-render...');
            setRenderKey(prev => prev + 1);
          } else {
            console.log('🎯 SUCCESS: Route 66 with historically accurate Santa Fe branch should be VISIBLE now');
          }
        }, 1000);
        
      } catch (error) {
        console.error('❌ CRITICAL ERROR creating FORCE Route 66:', error);
        setIsRouteRendered(false);
        
        // Attempt recovery
        console.log('🔧 DEBUG: Attempting route creation recovery...');
        setTimeout(() => {
          setRenderKey(prev => prev + 1);
        }, 2000);
      }
    };

    createRouteWithDebugging();

  }, [routeRenderer, destinationCities, isLoading, renderKey]);

  // Enhanced status logging for debugging
  useEffect(() => {
    const polylineCount = RouteGlobalState.getPolylineCount();
    const routeCreated = RouteGlobalState.isRouteCreated();
    
    console.log('📊 Route system status - FORCE RECREATION MODE:', {
      isMapReady,
      hasRouteRenderer: !!routeRenderer,
      citiesLoaded: destinationCities.length,
      isLoading,
      isRouteRendered,
      polylineSegments: polylineCount,
      routeGlobalStateCreated: routeCreated,
      renderKey,
      timestamp: new Date().toISOString()
    });

    // Enhanced debugging for missing road with recovery
    if (isRouteRendered && polylineCount === 0) {
      console.error('🚨 ROAD MISSING: Route marked as rendered but no polylines found!');
      console.log('🔧 DEBUG: Triggering recovery re-render...');
      setTimeout(() => {
        setRenderKey(prev => prev + 1);
        setIsRouteRendered(false);
      }, 1000);
    }
    
    if (!isRouteRendered && destinationCities.length > 0 && routeRenderer && isMapReady) {
      console.warn('⚠️ ROAD ISSUE: All conditions met but route not rendered yet');
    }
  }, [isMapReady, routeRenderer, destinationCities.length, isLoading, isRouteRendered, renderKey]);

  return null;
};

export default DestinationCitiesRoute66Renderer;
