
import React, { useEffect, useRef, useState } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { RouteGlobalState } from '../services/RouteGlobalState';
import type { Route66Waypoint } from '../types/supabaseTypes';
import { DistanceCalculationService } from '../../TripCalculator/services/utils/DistanceCalculationService';

interface NuclearRouteManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// Dedicated function to generate Route 66 polyline
const generateRoute66Polyline = (waypoints: Route66Waypoint[]): google.maps.LatLngLiteral[] => {
  console.log('🛣️ generateRoute66Polyline: Starting with', waypoints.length, 'waypoints');
  
  // Filter and sort waypoints by sequence_order
  const validWaypoints = waypoints
    .filter(wp => 
      wp.latitude && 
      wp.longitude && 
      wp.sequence_order !== null &&
      !isNaN(wp.latitude) &&
      !isNaN(wp.longitude)
    )
    .sort((a, b) => a.sequence_order - b.sequence_order);

  console.log('🛣️ generateRoute66Polyline: Filtered to', validWaypoints.length, 'valid waypoints');
  
  if (validWaypoints.length < 2) {
    console.error('🛣️ generateRoute66Polyline: Insufficient waypoints for route');
    return [];
  }

  // Generate the path - each point connects only to the next
  const path: google.maps.LatLngLiteral[] = [];
  
  validWaypoints.forEach((waypoint, index) => {
    const point = {
      lat: waypoint.latitude,
      lng: waypoint.longitude
    };
    
    path.push(point);
    
    // Safety check for large jumps (only between consecutive waypoints)
    if (index > 0) {
      const prevWaypoint = validWaypoints[index - 1];
      const distance = DistanceCalculationService.calculateDistance(
        prevWaypoint.latitude,
        prevWaypoint.longitude,
        waypoint.latitude,
        waypoint.longitude
      );
      
      if (distance > 50) {
        console.warn(`🚨 Large jump detected: ${prevWaypoint.name} → ${waypoint.name} = ${distance.toFixed(1)} miles`);
      }
      
      console.log(`🛣️ Segment ${index}: ${prevWaypoint.name} → ${waypoint.name} (${distance.toFixed(1)} miles)`);
    }
  });

  console.log('🛣️ generateRoute66Polyline: Generated path with', path.length, 'points');
  console.log('🛣️ Route verification:', {
    start: `${validWaypoints[0].name} (${path[0].lat}, ${path[0].lng})`,
    end: `${validWaypoints[validWaypoints.length - 1].name} (${path[path.length - 1].lat}, ${path[path.length - 1].lng})`,
    totalWaypoints: validWaypoints.length
  });
  
  return path;
};

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

  // NUCLEAR CLEANUP on mount
  useEffect(() => {
    if (!map || !isMapReady || initializationRef.current) return;
    
    console.log('☢️ NuclearRouteManager: Performing NUCLEAR CLEANUP on initialization');
    
    RouteGlobalState.setActiveMap(map);
    RouteGlobalState.nuclearCleanup();
    
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

    // Use the dedicated function to generate the polyline path
    const path = generateRoute66Polyline(waypoints);

    if (path.length < 2) {
      console.error('☢️ NuclearRouteManager: generateRoute66Polyline returned insufficient points');
      return;
    }

    console.log('☢️ NuclearRouteManager: Creating NUCLEAR SINGLE polyline with', path.length, 'points');

    // Clean up any existing polyline first
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    // Create the ONLY polyline
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#DC2626', // Bright red for visibility
      strokeOpacity: 1.0,
      strokeWeight: 6,
      clickable: false,
      zIndex: 1000
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

    // Zoom out slightly for better view
    setTimeout(() => {
      const currentZoom = map.getZoom() || 5;
      map.setZoom(Math.max(4, currentZoom - 1));
    }, 1000);

    console.log('☢️ NuclearRouteManager: NUCLEAR SINGLE Route 66 polyline created successfully');
    console.log('☢️ Final verification: Polyline connects', path.length, 'points sequentially');

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
