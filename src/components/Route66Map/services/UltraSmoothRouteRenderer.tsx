
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

    // FORCE recreation to apply new YELLOW stripe colors
    console.log('🎨 FORCING Route 66 recreation with NEW BRIGHT YELLOW CENTER STRIPES');

    // Reset flags to force recreation
    hasRendered.current = false;
    RouteGlobalState.setRouteCreated(false);

    // Increment render attempts
    renderAttempts.current++;
    
    if (renderAttempts.current > 5) {
      console.warn('⚠️ UltraSmoothRouteRenderer: Too many render attempts, stopping');
      return;
    }

    console.log(`🚀 UltraSmoothRouteRenderer: Creating ASPHALT Route 66 with YELLOW stripes (attempt ${renderAttempts.current})`);
    
    try {
      // Initialize managers
      const markersManager = new RouteMarkersManager(map);
      const polylineManager = new RoutePolylineManager(map);
      const cleanupManager = new RouteCleanupManager(map, markersManager, polylineManager);
      
      // Step 1: Clean up any existing routes
      console.log('🧹 FORCING cleanup of existing routes for yellow stripe update...');
      cleanupManager.performNuclearCleanup();
      
      // Step 2: Filter ONLY major stops (Route 66 city icons) - this is critical
      const majorStops = waypoints.filter(wp => wp.is_major_stop === true);
      console.log(`🎯 Filtered to ${majorStops.length} major stops for ASPHALT route:`);
      majorStops.forEach((stop, index) => {
        console.log(`  ${index + 1}. ${stop.name} (${stop.state}) - Sequence: ${stop.sequence_order}`);
      });
      
      if (majorStops.length < 2) {
        console.warn('⚠️ Not enough major stops to create asphalt road segments');
        return;
      }

      // Step 3: Sort major stops by sequence order to ensure proper city-to-city connections
      const sortedMajorStops = majorStops.sort((a, b) => a.sequence_order - b.sequence_order);
      console.log(`🔄 Sorted major stops by sequence order for ASPHALT city-to-city connections`);

      // Step 4: Create NEW ASPHALT polylines between consecutive major stops
      console.log(`🛣️ Creating ${sortedMajorStops.length - 1} ASPHALT city-to-city road segments...`);
      
      // Add a small delay to ensure map is fully ready
      setTimeout(() => {
        try {
          polylineManager.createPolylines([], sortedMajorStops);
          console.log('✅ ASPHALT Route polylines created successfully');
        } catch (polylineError) {
          console.error('❌ Error creating asphalt polylines:', polylineError);
          
          // Fallback: Create simple straight-line route with asphalt colors
          console.log('🔄 Attempting asphalt fallback route creation...');
          createAsphaltFallbackRoute(map, sortedMajorStops);
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

      console.log(`✅ ASPHALT Route 66 spine created with ${sortedMajorStops.length - 1} city-to-city segments!`);

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

  // Fallback route creation function with BRIGHT YELLOW stripes
  const createAsphaltFallbackRoute = (map: google.maps.Map, majorStops: any[]) => {
    console.log('🔄 Creating ASPHALT fallback straight-line route with BRIGHT YELLOW stripes');
    
    const routePath = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    const fallbackPolyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#2C2C2C', // Dark charcoal/asphalt color
      strokeOpacity: 0.9,
      strokeWeight: 8,
      zIndex: 10000,
      clickable: false,
      map: map
    });

    // Add bright yellow center line to fallback route
    const fallbackCenterLine = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FFD700', // Bright yellow
      strokeOpacity: 0,
      strokeWeight: 0,
      zIndex: 10001,
      clickable: false,
      map: map,
      icons: [{
        icon: {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1.0, // Full opacity for bright yellow
          strokeColor: '#FFD700', // Bright yellow
          strokeWeight: 2,
          scale: 1
        },
        offset: '0%',
        repeat: '40px'
      }]
    });

    console.log('✅ ASPHALT Fallback route with BRIGHT YELLOW stripes created');
    
    // Store in global state for cleanup
    RouteGlobalState.addPolylineSegment(fallbackPolyline);
    RouteGlobalState.addPolylineSegment(fallbackCenterLine);
  };

  return null;
};

export default UltraSmoothRouteRenderer;
