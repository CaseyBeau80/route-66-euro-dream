
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
  const { waypoints, isLoading, error } = useSupabaseRoute66();

  useEffect(() => {
    if (!map || !isMapReady || isLoading || error || waypoints.length === 0) {
      return;
    }

    if (hasRendered.current || RouteGlobalState.isRouteCreated()) {
      console.log('🎯 UltraSmoothRouteRenderer: Route already exists, skipping');
      return;
    }

    console.log('🚀 UltraSmoothRouteRenderer: Creating ONLY Route 66 city-to-city segments');
    
    // Initialize managers
    const markersManager = new RouteMarkersManager(map);
    const polylineManager = new RoutePolylineManager(map);
    const cleanupManager = new RouteCleanupManager(map, markersManager, polylineManager);
    
    // Step 1: Clean up any existing routes
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
    polylineManager.createPolylines([], sortedMajorStops);

    // Step 5: Create Route 66 shield markers ONLY for major stops
    console.log(`🛡️ Creating Route 66 shield markers for ${sortedMajorStops.length} major stops...`);
    markersManager.createRouteMarkers(sortedMajorStops);

    // Step 6: Mark as created
    RouteGlobalState.setRouteCreated(true);
    hasRendered.current = true;

    console.log(`✅ Clean Route 66 spine created with ${sortedMajorStops.length - 1} city-to-city segments between ${sortedMajorStops.length} major stops only!`);

    // Step 7: Fit map to bounds of major stops only
    polylineManager.fitMapToBounds(sortedMajorStops);

    // Cleanup function
    return () => {
      console.log('🧹 UltraSmoothRouteRenderer: Component unmounting');
    };
  }, [map, isMapReady, waypoints, isLoading, error]);

  return null;
};

export default UltraSmoothRouteRenderer;
