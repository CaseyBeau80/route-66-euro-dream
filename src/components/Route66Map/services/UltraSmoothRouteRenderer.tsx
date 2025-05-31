
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { RouteGlobalState } from './RouteGlobalState';
import { RouteMarkersManager } from './RouteMarkersManager';
import { RoutePolylineManager } from './RoutePolylineManager';
import { RouteCleanupManager } from './RouteCleanupManager';

interface UltraSmoothRouteRendererProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const UltraSmoothRouteRenderer: React.FC<UltraSmoothRouteRendererProps> = ({ 
  map, 
  isMapReady 
}) => {
  const hasRendered = useRef(false);
  const renderAttempts = useRef(0);
  const { waypoints, isLoading, error } = useSupabaseRoute66();

  useEffect(() => {
    console.log('🚀 UltraSmoothRouteRenderer: Effect triggered', {
      hasMap: !!map,
      isMapReady,
      isLoading,
      hasError: !!error,
      waypointsCount: waypoints.length,
      hasRendered: hasRendered.current,
      routeExists: RouteGlobalState.isRouteCreated(),
      renderAttempts: renderAttempts.current
    });

    if (!map || !isMapReady || isLoading || error || waypoints.length === 0) {
      console.log('🚀 UltraSmoothRouteRenderer: Conditions not met, skipping render');
      return;
    }

    if (hasRendered.current || RouteGlobalState.isRouteCreated()) {
      console.log('🎯 UltraSmoothRouteRenderer: Route already exists, skipping');
      return;
    }

    // Increment render attempts
    renderAttempts.current++;
    
    if (renderAttempts.current > 3) {
      console.warn('⚠️ UltraSmoothRouteRenderer: Too many render attempts, stopping');
      return;
    }

    console.log(`🚀 UltraSmoothRouteRenderer: Creating Route 66 (attempt ${renderAttempts.current})`);
    
    try {
      // Initialize managers
      const markersManager = new RouteMarkersManager(map);
      const polylineManager = new RoutePolylineManager(map);
      const cleanupManager = new RouteCleanupManager(map, markersManager, polylineManager);
      
      // Step 1: Clean up any existing routes
      console.log('🧹 Cleaning up existing routes...');
      cleanupManager.performNuclearCleanup();
      
      // Step 2: Filter ONLY major stops (Route 66 city icons) - this is critical
      const majorStops = waypoints.filter(wp => wp.is_major_stop === true);
      console.log(`🎯 Filtered to ${majorStops.length} major stops with Route 66 city icons:`);
      majorStops.forEach((stop, index) => {
        console.log(`  ${index + 1}. ${stop.name} (${stop.state}) - Sequence: ${stop.sequence_order}`);
      });
      
      if (majorStops.length < 2) {
        console.warn('⚠️ Not enough major stops with Route 66 city icons to create road segments');
        return;
      }

      // Step 3: Sort major stops by sequence order to ensure proper city-to-city connections
      const sortedMajorStops = majorStops.sort((a, b) => a.sequence_order - b.sequence_order);
      console.log(`🔄 Sorted major stops by sequence order for proper city-to-city connections`);

      // Step 4: Create polylines ONLY between consecutive major stops (city-to-city)
      console.log(`🛣️ Creating ${sortedMajorStops.length - 1} city-to-city road segments...`);
      
      // Add a small delay to ensure map is fully ready
      setTimeout(() => {
        try {
          polylineManager.createPolylines([], sortedMajorStops);
          console.log('✅ Route polylines created successfully');
        } catch (polylineError) {
          console.error('❌ Error creating polylines:', polylineError);
          
          // Fallback: Create simple straight-line route
          console.log('🔄 Attempting fallback route creation...');
          createFallbackRoute(map, sortedMajorStops);
        }
      }, 500);

      // Step 5: Create Route 66 shield markers ONLY for major stops
      console.log(`🛡️ Creating Route 66 shield markers for ${sortedMajorStops.length} major stops...`);
      setTimeout(() => {
        try {
          markersManager.createRouteMarkers(sortedMajorStops);
          console.log('✅ Route markers created successfully');
        } catch (markerError) {
          console.error('❌ Error creating markers:', markerError);
        }
      }, 100);

      // Step 6: Mark as created
      RouteGlobalState.setRouteCreated(true);
      hasRendered.current = true;

      console.log(`✅ Route 66 spine created with ${sortedMajorStops.length - 1} city-to-city segments between ${sortedMajorStops.length} major stops!`);

      // Step 7: Fit map to bounds of major stops only
      setTimeout(() => {
        polylineManager.fitMapToBounds(sortedMajorStops);
      }, 1000);

    } catch (error) {
      console.error('❌ Error in UltraSmoothRouteRenderer:', error);
      
      // Reset flags to allow retry
      hasRendered.current = false;
      RouteGlobalState.setRouteCreated(false);
    }

    // Cleanup function
    return () => {
      console.log('🧹 UltraSmoothRouteRenderer: Component unmounting');
    };
  }, [map, isMapReady, waypoints, isLoading, error]);

  // Fallback route creation function
  const createFallbackRoute = (map: google.maps.Map, majorStops: any[]) => {
    console.log('🔄 Creating fallback straight-line route');
    
    const routePath = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    const fallbackPolyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#D92121', // Route 66 red
      strokeOpacity: 1.0,
      strokeWeight: 6,
      zIndex: 10000,
      clickable: false,
      map: map
    });

    console.log('✅ Fallback route created');
    
    // Store in global state for cleanup
    RouteGlobalState.addPolylineSegment(fallbackPolyline);
  };

  return null;
};

export default UltraSmoothRouteRenderer;
