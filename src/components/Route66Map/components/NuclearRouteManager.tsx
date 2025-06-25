
import React, { useEffect, useRef, useState } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { RouteGlobalState } from '../services/RouteGlobalState';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface NuclearRouteManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const NuclearRouteManager: React.FC<NuclearRouteManagerProps> = ({ map, isMapReady }) => {
  const { waypoints, isLoading, error } = useSupabaseRoute66();
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const [hasCreatedRoute, setHasCreatedRoute] = useState(false);
  const initializationRef = useRef(false);

  console.log('☢️ NuclearRouteManager: THE ONLY route renderer', {
    isMapReady,
    isLoading,
    error,
    waypointsCount: waypoints.length,
    hasCreatedRoute,
    hasPolylineRef: !!polylineRef.current
  });

  // NUCLEAR CLEANUP on mount - remove ALL existing polylines
  useEffect(() => {
    if (!map || !isMapReady || initializationRef.current) return;
    
    console.log('☢️ NuclearRouteManager: Performing NUCLEAR CLEANUP on initialization');
    
    // Set the active map in global state
    RouteGlobalState.setActiveMap(map);
    
    // NUCLEAR cleanup of any existing polylines
    RouteGlobalState.nuclearCleanup();
    
    // Wait a moment for cleanup to complete, then allow route creation
    setTimeout(() => {
      initializationRef.current = true;
      console.log('☢️ NuclearRouteManager: Nuclear cleanup complete, ready for route creation');
    }, 100);
    
  }, [map, isMapReady]);

  // Create the SINGLE Route 66 polyline
  useEffect(() => {
    if (!initializationRef.current || !map || !isMapReady || isLoading || error || waypoints.length === 0 || hasCreatedRoute) {
      console.log('☢️ NuclearRouteManager: Skipping route creation', {
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

    console.log('☢️ NuclearRouteManager: Creating THE ONLY Route 66 polyline');

    // Sort waypoints by sequence order
    const sortedWaypoints = waypoints
      .filter(wp => wp.latitude && wp.longitude && wp.sequence_order !== null)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    if (sortedWaypoints.length < 2) {
      console.error('☢️ NuclearRouteManager: Insufficient waypoints for route');
      return;
    }

    // Create path from waypoints
    const path: google.maps.LatLngLiteral[] = sortedWaypoints.map(wp => ({
      lat: wp.latitude,
      lng: wp.longitude
    }));

    console.log('☢️ NuclearRouteManager: Creating NUCLEAR SINGLE polyline with', path.length, 'points');

    // Create the ONLY polyline with maximum visibility
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#DC2626', // Bright red
      strokeOpacity: 1.0,
      strokeWeight: 8, // Thick but not overwhelming
      clickable: false,
      zIndex: 1000 // Highest priority
    });

    // Add to map
    polyline.setMap(map);
    polylineRef.current = polyline;
    setHasCreatedRoute(true);
    
    // Track in global state
    RouteGlobalState.addPolylines([polyline]);
    RouteGlobalState.setRouteCreated(true);

    // Fit map to route bounds
    const bounds = new google.maps.LatLngBounds();
    path.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);

    // Zoom out slightly
    setTimeout(() => {
      const currentZoom = map.getZoom() || 5;
      map.setZoom(Math.max(4, currentZoom - 1));
    }, 1000);

    console.log('☢️ NuclearRouteManager: NUCLEAR SINGLE Route 66 polyline created successfully');

    // Add cleanup callback
    RouteGlobalState.addCleanupCallback(() => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      setHasCreatedRoute(false);
    });

  }, [initializationRef.current, map, isMapReady, waypoints, isLoading, error, hasCreatedRoute]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('☢️ NuclearRouteManager: Component unmounting - cleaning up');
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      setHasCreatedRoute(false);
      RouteGlobalState.setRouteCreated(false);
    };
  }, []);

  return null;
};

export default NuclearRouteManager;
