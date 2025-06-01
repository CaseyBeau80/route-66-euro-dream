
import React, { useEffect, useState } from 'react';
import { useDestinationCities } from '../hooks/useDestinationCities';
import { DestinationCitiesRouteRenderer } from './DestinationCitiesRouteRenderer';
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';

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
  const [nuclearCleanupComplete, setNuclearCleanupComplete] = useState(false);

  // NUCLEAR CLEANUP: Ensure no conflicting routes exist
  useEffect(() => {
    if (!isMapReady || !map) return;

    const performNuclearCleanup = async () => {
      console.log('🧹 DestinationCitiesRoute66Renderer: Performing NUCLEAR cleanup to prevent route conflicts');
      
      try {
        // Clear global route state
        RouteGlobalState.clearAll();
        
        // Nuclear polyline cleanup
        await GlobalPolylineCleaner.cleanupAllPolylines(map);
        
        // Additional cleanup delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log('✅ NUCLEAR cleanup completed - all conflicting routes eliminated');
        setNuclearCleanupComplete(true);
        
      } catch (error) {
        console.error('❌ Error during nuclear cleanup:', error);
        setNuclearCleanupComplete(true); // Continue anyway
      }
    };

    performNuclearCleanup();
  }, [map, isMapReady]);

  // Initialize route renderer only after nuclear cleanup
  useEffect(() => {
    if (!nuclearCleanupComplete || !isMapReady || !map || routeRenderer) return;

    console.log('🛣️ Initializing SINGLE DestinationCitiesRouteRenderer after nuclear cleanup');
    const renderer = new DestinationCitiesRouteRenderer(map);
    setRouteRenderer(renderer);

    return () => {
      console.log('🧹 Cleaning up route renderer on unmount');
      if (renderer) {
        renderer.cleanup();
      }
    };
  }, [map, isMapReady, nuclearCleanupComplete, routeRenderer]);

  // Render the route when data is ready
  useEffect(() => {
    if (!routeRenderer || !destinationCities.length || isLoading || isRouteRendered || !nuclearCleanupComplete) {
      return;
    }

    console.log('🛣️ Starting SINGLE Route 66 rendering with destination cities (NO CONFLICTS)');
    console.log(`🏛️ Found ${destinationCities.length} destination cities for STRAIGHT route creation`);

    // Verify key cities are present
    const chicago = destinationCities.find(city => city.name.toLowerCase().includes('chicago'));
    const santaMonica = destinationCities.find(city => city.name.toLowerCase().includes('santa monica'));
    const pontiac = destinationCities.find(city => city.name.toLowerCase().includes('pontiac'));
    
    if (!chicago || !santaMonica) {
      console.error('❌ Missing key endpoint cities (Chicago or Santa Monica)');
      return;
    }

    console.log('🏁 Route endpoints and key cities confirmed:', {
      start: `${chicago.name}, ${chicago.state}`,
      end: `${santaMonica.name}, ${santaMonica.state}`,
      hasPontiac: !!pontiac,
      pontiacInfo: pontiac ? `${pontiac.name}, ${pontiac.state}` : 'NOT FOUND'
    });

    // Additional route conflict check
    const existingPolylineCount = RouteGlobalState.getPolylineCount();
    if (existingPolylineCount > 0) {
      console.warn(`⚠️ CONFLICT DETECTED: ${existingPolylineCount} existing polylines found - performing emergency cleanup`);
      RouteGlobalState.clearAll();
    }

    // Create the SINGLE straight route
    routeRenderer.createRoute66FromDestinations(destinationCities)
      .then(() => {
        console.log('✅ SINGLE destination cities Route 66 created successfully (NO ZIGZAG)');
        setIsRouteRendered(true);
        
        // Verify route creation
        const polylineCount = RouteGlobalState.getPolylineCount();
        console.log(`🔍 Route verification: ${polylineCount} polyline segments created`);
        
        if (polylineCount === 0) {
          console.error('❌ No polylines were created despite successful route creation');
        } else {
          console.log('🎯 SUCCESS: STRAIGHT Route 66 with dashed yellow center line is visible');
        }
      })
      .catch(error => {
        console.error('❌ Error creating SINGLE destination cities Route 66:', error);
        setIsRouteRendered(false);
      });

  }, [routeRenderer, destinationCities, isLoading, isRouteRendered, nuclearCleanupComplete]);

  // Enhanced status logging with conflict detection
  useEffect(() => {
    const polylineCount = RouteGlobalState.getPolylineCount();
    const activePolylines = GlobalPolylineCleaner.getActivePolylineCount();
    
    console.log('📊 SINGLE route system status:', {
      isMapReady,
      nuclearCleanupComplete,
      hasRouteRenderer: !!routeRenderer,
      citiesLoaded: destinationCities.length,
      isLoading,
      isRouteRendered,
      polylineSegments: polylineCount,
      activeGlobalPolylines: activePolylines,
      routeGlobalStateCreated: RouteGlobalState.isRouteCreated(),
      noConflicts: polylineCount <= 2 && activePolylines <= 2 // Main road + center line
    });

    // Conflict detection
    if (isRouteRendered && polylineCount === 0) {
      console.warn('⚠️ Route marked as rendered but no polylines found in global state');
    }
    
    if (polylineCount > 2) {
      console.warn(`🚨 ROUTE CONFLICT: Too many polylines (${polylineCount}) - expected max 2 (road + center line)`);
    }
  }, [isMapReady, nuclearCleanupComplete, routeRenderer, destinationCities.length, isLoading, isRouteRendered]);

  return null;
};

export default DestinationCitiesRoute66Renderer;
