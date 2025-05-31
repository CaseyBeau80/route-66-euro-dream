
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

    console.log('🚀 UltraSmoothRouteRenderer: Creating icon-based Route 66 segments');
    
    // Initialize managers
    const markersManager = new RouteMarkersManager(map);
    const polylineManager = new RoutePolylineManager(map);
    const cleanupManager = new RouteCleanupManager(map, markersManager, polylineManager);
    
    // Step 1: Clean up any existing routes
    cleanupManager.performNuclearCleanup();
    
    // Step 2: Create polylines ONLY between major stops with icons
    const majorStops = waypoints.filter(wp => wp.is_major_stop);
    console.log(`🎯 Found ${majorStops.length} major stops with Route 66 icons`);
    
    if (majorStops.length < 2) {
      console.warn('⚠️ Not enough major stops with icons to create road segments');
      return;
    }

    // Step 3: Create road segments only between locations with icons
    polylineManager.createPolylines([], waypoints);

    // Step 4: Create route markers for major stops with icons
    markersManager.createRouteMarkers(waypoints);

    // Step 5: Mark as created
    RouteGlobalState.setRouteCreated(true);
    hasRendered.current = true;

    console.log(`✅ Icon-based Route 66 created with road segments only between ${majorStops.length} locations with Route 66 shields!`);

    // Step 6: Fit map to bounds of major stops only
    polylineManager.fitMapToBounds(waypoints);

    // Cleanup function
    return () => {
      console.log('🧹 UltraSmoothRouteRenderer: Component unmounting');
    };
  }, [map, isMapReady, waypoints, isLoading, error]);

  return null;
};

export default UltraSmoothRouteRenderer;
