
import React, { useEffect, useState } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { IdealizedRoute66Renderer } from './IdealizedRoute66Renderer';
import { RouteGlobalState } from './RouteGlobalState';

interface UltraSmoothRouteRendererProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const UltraSmoothRouteRenderer: React.FC<UltraSmoothRouteRendererProps> = ({
  map,
  isMapReady
}) => {
  const { waypoints, isLoading } = useSupabaseRoute66();
  const [routeRenderer, setRouteRenderer] = useState<IdealizedRoute66Renderer | null>(null);
  const [isRouteRendered, setIsRouteRendered] = useState(false);

  // Initialize route renderer
  useEffect(() => {
    if (!isMapReady || !map) return;

    const renderer = new IdealizedRoute66Renderer(map);
    setRouteRenderer(renderer);

    return () => {
      // Cleanup on unmount
      RouteGlobalState.clearAll();
    };
  }, [map, isMapReady]);

  // Render the idealized route when data is ready
  useEffect(() => {
    if (!routeRenderer || !waypoints.length || isLoading || isRouteRendered) return;

    console.log('🗺️ UltraSmoothRouteRenderer: Starting idealized curvy Route 66 rendering');

    // Filter to major stops only for main route - but log the filtering process
    const majorStops = waypoints
      .filter(waypoint => waypoint.is_major_stop === true)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    console.log(`🔍 Route rendering waypoint analysis:`, {
      totalWaypoints: waypoints.length,
      majorStops: majorStops.length,
      nonMajorStops: waypoints.filter(w => w.is_major_stop !== true).length
    });

    // Log major stops for route rendering
    console.log(`🛣️ Major stops for route rendering:`, majorStops.map(stop => `${stop.name} (${stop.state}) - Seq: ${stop.sequence_order}`));

    if (majorStops.length < 2) {
      console.warn('⚠️ Not enough major stops for route rendering');
      console.log('🔍 Available waypoints:', waypoints.map(w => ({
        name: w.name,
        state: w.state,
        is_major_stop: w.is_major_stop,
        sequence_order: w.sequence_order
      })));
      return;
    }

    console.log(`🛣️ Rendering idealized Route 66 with ${majorStops.length} major stops`);

    // Create idealized curvy route
    routeRenderer.createIdealizedRoute66(majorStops)
      .then(() => {
        setIsRouteRendered(true);
        console.log('✅ Idealized Route 66 rendering completed');
      })
      .catch(error => {
        console.error('❌ Error rendering idealized Route 66:', error);
      });

  }, [routeRenderer, waypoints, isLoading, isRouteRendered]);

  // Log current status with enhanced debugging
  useEffect(() => {
    if (!isMapReady) return;

    const polylineCount = RouteGlobalState.getPolylineCount();
    
    console.log('📊 Idealized route rendering status:', {
      isMapReady,
      waypointsLoaded: waypoints.length,
      majorStopsCount: waypoints.filter(w => w.is_major_stop === true).length,
      isLoading,
      isRouteRendered,
      polylineSegments: polylineCount
    });

    // Enhanced waypoint debugging
    if (waypoints.length > 0) {
      console.log('🗺️ All waypoints summary:', waypoints.map(w => ({
        name: w.name,
        state: w.state,
        isMajor: w.is_major_stop,
        sequence: w.sequence_order
      })));
    }
  }, [isMapReady, waypoints.length, isLoading, isRouteRendered]);

  return null;
};

export default UltraSmoothRouteRenderer;
