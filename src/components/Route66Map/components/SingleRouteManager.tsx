
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface SingleRouteManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const SingleRouteManager: React.FC<SingleRouteManagerProps> = ({ map, isMapReady }) => {
  const { waypoints, isLoading, error } = useSupabaseRoute66();
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const hasCreatedRoute = useRef(false);

  console.log('🛣️ SingleRouteManager: Route controller', {
    isMapReady,
    isLoading,
    error,
    waypointsCount: waypoints.length,
    hasCreatedRoute: hasCreatedRoute.current
  });

  useEffect(() => {
    // Don't create multiple routes
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

    console.log('🛣️ SingleRouteManager: Creating Route 66 polyline');

    // Sort ALL waypoints by sequence order (not just major stops)
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

    // Create path from ALL waypoints
    const path: google.maps.LatLngLiteral[] = sortedWaypoints.map(wp => ({
      lat: wp.latitude,
      lng: wp.longitude
    }));

    console.log('🗺️ SingleRouteManager: Creating path with', path.length, 'points');
    console.log('🎯 Start:', `${path[0].lat.toFixed(4)}, ${path[0].lng.toFixed(4)}`);
    console.log('🎯 End:', `${path[path.length - 1].lat.toFixed(4)}, ${path[path.length - 1].lng.toFixed(4)}`);

    // Create a BOLD, VISIBLE polyline
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF0000', // Bright red for visibility
      strokeOpacity: 1.0,
      strokeWeight: 12, // Very thick line
      clickable: false,
      zIndex: 100
    });

    // Add to map
    polyline.setMap(map);
    polylineRef.current = polyline;
    hasCreatedRoute.current = true;

    // Force the map to show the route
    const bounds = new google.maps.LatLngBounds();
    path.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);

    // Zoom out slightly after bounds are set
    setTimeout(() => {
      const currentZoom = map.getZoom() || 5;
      map.setZoom(Math.max(4, currentZoom - 1));
    }, 1000);

    console.log('✅ SingleRouteManager: Route 66 polyline created successfully');
    console.log('🔍 Polyline details:', {
      pathLength: polyline.getPath().getLength(),
      strokeColor: polyline.get('strokeColor'),
      strokeWeight: polyline.get('strokeWeight'),
      visible: polyline.getVisible()
    });

  }, [map, isMapReady, waypoints, isLoading, error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 SingleRouteManager: Component unmounting - cleaning up');
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      hasCreatedRoute.current = false;
    };
  }, []);

  return null;
};

export default SingleRouteManager;
