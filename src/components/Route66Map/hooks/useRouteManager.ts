
import { useEffect, useRef, useState } from 'react';
import { useSupabaseRoute66 } from './useSupabaseRoute66';
import { RouteGlobalState } from '../services/RouteGlobalState';
import { SmoothPathCreationService } from '../services/SmoothPathCreationService';
import { RoadPolylineService } from '../services/RoadPolylineService';

interface UseRouteManagerProps {
  map: google.maps.Map | null;
  isMapReady: boolean;
}

export const useRouteManager = ({ map, isMapReady }: UseRouteManagerProps) => {
  const { waypoints, isLoading, error } = useSupabaseRoute66();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const [hasCreatedRoute, setHasCreatedRoute] = useState(false);
  const initializationRef = useRef(false);

  // NUCLEAR CLEANUP on mount
  useEffect(() => {
    if (!map || !isMapReady || initializationRef.current) return;
    
    console.log('☢️ RouteManager: Performing NUCLEAR CLEANUP on initialization');
    
    RouteGlobalState.setActiveMap(map);
    RouteGlobalState.nuclearCleanup();
    
    setTimeout(() => {
      initializationRef.current = true;
      console.log('☢️ RouteManager: Nuclear cleanup complete, ready for route creation');
    }, 100);
    
  }, [map, isMapReady]);

  // Create the enhanced curved Route 66 road
  useEffect(() => {
    if (!initializationRef.current || !map || !isMapReady || isLoading || error || waypoints.length === 0 || hasCreatedRoute) {
      console.log('☢️ RouteManager: Skipping route creation', {
        initialized: initializationRef.current,
        hasMap: !!map,
        isMapReady,
        isLoading,
        error,
        waypointsCount: waypoints.length,
        hasCreatedRoute
      });
      return;
    }

    console.log('☢️ RouteManager: Creating enhanced curved Route 66 road with yellow striping');

    // Clean up any existing polylines first
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    // Create smooth curved path
    const smoothPath = SmoothPathCreationService.createSmoothCurvedPath(waypoints);

    if (smoothPath.length < 2) {
      console.error('☢️ RouteManager: createSmoothCurvedPath returned insufficient points');
      return;
    }

    console.log('☢️ RouteManager: Creating realistic road with', smoothPath.length, 'curved points');

    // Create road-like polylines with yellow striping
    const roadPolylines = RoadPolylineService.createRoadPolylines(map, smoothPath);
    polylinesRef.current = roadPolylines;
    setHasCreatedRoute(true);
    
    // Track in global state
    RouteGlobalState.addPolylines(roadPolylines);
    RouteGlobalState.setRouteCreated(true);

    // Fit map to route bounds
    const bounds = new google.maps.LatLngBounds();
    smoothPath.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);

    // Zoom out slightly for better view
    setTimeout(() => {
      const currentZoom = map.getZoom() || 5;
      map.setZoom(Math.max(4, currentZoom - 1));
    }, 1000);

    console.log('☢️ RouteManager: Enhanced curved Route 66 road with yellow striping created successfully');

    // Add cleanup callback
    RouteGlobalState.addCleanupCallback(() => {
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
      polylinesRef.current = [];
      setHasCreatedRoute(false);
    });

  }, [initializationRef.current, map, isMapReady, waypoints, isLoading, error, hasCreatedRoute]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('☢️ RouteManager: Component unmounting - cleaning up');
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
      polylinesRef.current = [];
      setHasCreatedRoute(false);
      RouteGlobalState.setRouteCreated(false);
    };
  }, []);

  return {
    waypoints,
    isLoading,
    error,
    hasCreatedRoute
  };
};
