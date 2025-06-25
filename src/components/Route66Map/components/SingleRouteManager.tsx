
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { RouteGlobalState } from '../services/RouteGlobalState';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface SingleRouteManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const SingleRouteManager: React.FC<SingleRouteManagerProps> = ({ map, isMapReady }) => {
  const { waypoints, isLoading, error } = useSupabaseRoute66();
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const centerLineRef = useRef<google.maps.Polyline | null>(null);
  const hasCreatedRoute = useRef(false);

  console.log('🛡️ SingleRouteManager: AUTHORITATIVE route controller starting', {
    isMapReady,
    isLoading,
    error,
    waypointsCount: waypoints.length,
    hasCreatedRoute: hasCreatedRoute.current
  });

  useEffect(() => {
    // NUCLEAR CLEANUP: Clear everything first
    console.log('🧹 SingleRouteManager: NUCLEAR CLEANUP - Clearing all existing polylines');
    RouteGlobalState.clearAllPolylines();
    
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (centerLineRef.current) {
      centerLineRef.current.setMap(null);
      centerLineRef.current = null;
    }

    // Prevent multiple route creation
    if (hasCreatedRoute.current || !map || !isMapReady || isLoading || error || waypoints.length === 0) {
      console.log('⚠️ SingleRouteManager: Skipping route creation', {
        hasCreatedRoute: hasCreatedRoute.current,
        hasMap: !!map,
        isMapReady,
        isLoading,
        error,
        waypointsCount: waypoints.length
      });
      return;
    }

    console.log('🛣️ SingleRouteManager: Creating SINGLE authoritative Route 66 polyline');

    // Set global state to prevent other components from creating routes
    RouteGlobalState.setActiveMap(map);
    RouteGlobalState.setRouteCreated(true);

    // Sort waypoints by sequence order
    const sortedWaypoints = waypoints
      .filter(wp => wp.latitude && wp.longitude && wp.sequence_order !== null)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    console.log('📊 SingleRouteManager: Using waypoints', {
      total: waypoints.length,
      sorted: sortedWaypoints.length,
      sequenceRange: `${sortedWaypoints[0]?.sequence_order} - ${sortedWaypoints[sortedWaypoints.length - 1]?.sequence_order}`
    });

    if (sortedWaypoints.length < 2) {
      console.error('❌ SingleRouteManager: Insufficient waypoints for route');
      return;
    }

    // Create simple, direct path from waypoints
    const path: google.maps.LatLngLiteral[] = sortedWaypoints.map(wp => ({
      lat: wp.latitude,
      lng: wp.longitude
    }));

    console.log('🗺️ SingleRouteManager: Creating path with', path.length, 'points');
    console.log('🎯 Start:', `${path[0].lat.toFixed(4)}, ${path[0].lng.toFixed(4)}`);
    console.log('🎯 End:', `${path[path.length - 1].lat.toFixed(4)}, ${path[path.length - 1].lng.toFixed(4)}`);

    // Create main asphalt road polyline
    const mainPolyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#2C1810', // Dark asphalt
      strokeOpacity: 0.95,
      strokeWeight: 8,
      clickable: false,
      zIndex: 50
    });

    // Create yellow center line
    const centerLine = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FFD700',
      strokeOpacity: 0,
      strokeWeight: 0,
      clickable: false,
      zIndex: 100,
      icons: [{
        icon: {
          path: 'M 0,-3 0,3',
          strokeOpacity: 1.0,
          strokeColor: '#FFD700',
          strokeWeight: 3,
          scale: 1
        },
        offset: '0',
        repeat: '40px'
      }]
    });

    // Add to map
    mainPolyline.setMap(map);
    centerLine.setMap(map);
    
    polylineRef.current = mainPolyline;
    centerLineRef.current = centerLine;
    hasCreatedRoute.current = true;

    // Register with global state
    RouteGlobalState.addPolylines([mainPolyline, centerLine]);

    // Fit map bounds to route
    const bounds = new google.maps.LatLngBounds();
    path.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);

    // Zoom out slightly for better view
    setTimeout(() => {
      const currentZoom = map.getZoom() || 5;
      map.setZoom(Math.max(4, currentZoom - 1));
    }, 1000);

    console.log('✅ SingleRouteManager: SINGLE Route 66 polyline created successfully');

  }, [map, isMapReady, waypoints, isLoading, error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 SingleRouteManager: Component unmounting - cleaning up');
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      if (centerLineRef.current) {
        centerLineRef.current.setMap(null);
      }
      RouteGlobalState.reset();
      hasCreatedRoute.current = false;
    };
  }, []);

  return null;
};

export default SingleRouteManager;
