
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { RouteInterpolationService } from './RouteInterpolationService';
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
  const interpolationServiceRef = useRef<RouteInterpolationService | null>(null);

  useEffect(() => {
    if (!map || !isMapReady || isLoading || error || waypoints.length === 0) {
      return;
    }

    if (hasRendered.current || RouteGlobalState.isRouteCreated()) {
      console.log('🎯 UltraSmoothRouteRenderer: Route already exists, skipping');
      return;
    }

    console.log('🚀 UltraSmoothRouteRenderer: Creating ultra-smooth Route 66');
    
    // Initialize managers
    const markersManager = new RouteMarkersManager(map);
    const polylineManager = new RoutePolylineManager(map);
    const cleanupManager = new RouteCleanupManager(map, markersManager, polylineManager);
    
    // Step 1: Clean up any existing routes
    cleanupManager.performNuclearCleanup();
    
    // Step 2: Initialize interpolation service
    interpolationServiceRef.current = new RouteInterpolationService(waypoints);
    
    // Step 3: Generate smooth route with ~2000 points
    const smoothRoutePath = interpolationServiceRef.current.generateSmoothRoute();
    
    if (smoothRoutePath.length === 0) {
      console.error('❌ Failed to generate smooth route path');
      return;
    }

    // Step 4: Get statistics
    const stats = interpolationServiceRef.current.getRouteStatistics();
    console.log('📊 Route Statistics:', stats);

    // Step 5: Create polylines
    polylineManager.createPolylines(smoothRoutePath);

    // Step 6: Create route markers for major stops
    markersManager.createRouteMarkers(waypoints);

    // Step 7: Mark as created and set bounds
    RouteGlobalState.setRouteCreated(true);
    hasRendered.current = true;

    console.log(`✅ Ultra-smooth Route 66 created with ${stats.totalPoints} points!`);
    console.log(`📏 Total distance: ${stats.totalDistance.toFixed(2)} km`);
    console.log(`🎯 Average points per segment: ${stats.averagePointsPerSegment}`);

    // Step 8: Fit map to route bounds
    polylineManager.fitMapToBounds(smoothRoutePath);

    // Cleanup function
    return () => {
      console.log('🧹 UltraSmoothRouteRenderer: Component unmounting');
    };
  }, [map, isMapReady, waypoints, isLoading, error]);

  // Provide access to route statistics for debugging
  useEffect(() => {
    if (interpolationServiceRef.current && RouteGlobalState.isRouteCreated()) {
      const stats = interpolationServiceRef.current.getRouteStatistics();
      console.log('📈 Current Route Statistics:', stats);
    }
  }, [RouteGlobalState.isRouteCreated()]);

  return null;
};

export default UltraSmoothRouteRenderer;
