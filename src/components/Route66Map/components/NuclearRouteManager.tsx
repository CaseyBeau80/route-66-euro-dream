
import React, { useEffect, useRef, useState } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { RouteGlobalState } from '../services/RouteGlobalState';
import type { Route66Waypoint } from '../types/supabaseTypes';
import { DistanceCalculationService } from '../../TripCalculator/services/utils/DistanceCalculationService';

interface NuclearRouteManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// Enhanced function to create smooth curved path between waypoints
const createSmoothCurvedPath = (waypoints: Route66Waypoint[]): google.maps.LatLngLiteral[] => {
  console.log('🛣️ Creating smooth curved path for Route 66');
  
  const validWaypoints = waypoints
    .filter(wp => wp.latitude && wp.longitude && wp.sequence_order !== null)
    .sort((a, b) => a.sequence_order - b.sequence_order);

  if (validWaypoints.length < 2) {
    console.error('❌ Insufficient waypoints for curved path');
    return [];
  }

  const smoothPath: google.maps.LatLngLiteral[] = [];
  const segmentsPerSection = 15; // More segments for smoother curves

  for (let i = 0; i < validWaypoints.length - 1; i++) {
    const current = validWaypoints[i];
    const next = validWaypoints[i + 1];
    
    // Get control points for Bezier curve
    const prev = i > 0 ? validWaypoints[i - 1] : current;
    const afterNext = i < validWaypoints.length - 2 ? validWaypoints[i + 2] : next;
    
    // Calculate control points for smooth curves
    const cp1 = {
      lat: current.latitude + (next.latitude - prev.latitude) * 0.2,
      lng: current.longitude + (next.longitude - prev.longitude) * 0.2
    };
    
    const cp2 = {
      lat: next.latitude - (afterNext.latitude - current.latitude) * 0.2,
      lng: next.longitude - (afterNext.longitude - current.longitude) * 0.2
    };
    
    // Create cubic Bezier curve
    for (let t = 0; t <= segmentsPerSection; t++) {
      const ratio = t / segmentsPerSection;
      const invRatio = 1 - ratio;
      
      // Cubic Bezier formula
      const lat = Math.pow(invRatio, 3) * current.latitude +
                  3 * Math.pow(invRatio, 2) * ratio * cp1.lat +
                  3 * invRatio * Math.pow(ratio, 2) * cp2.lat +
                  Math.pow(ratio, 3) * next.latitude;
      
      const lng = Math.pow(invRatio, 3) * current.longitude +
                  3 * Math.pow(invRatio, 2) * ratio * cp1.lng +
                  3 * invRatio * Math.pow(ratio, 2) * cp2.lng +
                  Math.pow(ratio, 3) * next.longitude;
      
      smoothPath.push({ lat, lng });
    }
  }
  
  console.log(`✅ Created smooth curved path with ${smoothPath.length} points`);
  return smoothPath;
};

// Function to create road-like styling with multiple layers
const createRoadPolylines = (map: google.maps.Map, path: google.maps.LatLngLiteral[]): google.maps.Polyline[] => {
  const polylines: google.maps.Polyline[] = [];
  
  // Base road (dark asphalt)
  const baseRoad = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#2C2C2C', // Dark asphalt gray
    strokeOpacity: 1.0,
    strokeWeight: 16,
    clickable: false,
    zIndex: 1000
  });
  
  // Road surface (lighter gray)
  const roadSurface = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#4A4A4A', // Medium gray
    strokeOpacity: 1.0,
    strokeWeight: 12,
    clickable: false,
    zIndex: 1001
  });
  
  // Yellow striped center line with dashed pattern
  const centerLine = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#FFD700', // Golden yellow
    strokeOpacity: 0, // Make main stroke invisible
    strokeWeight: 0, // No base stroke
    clickable: false,
    zIndex: 1002,
    icons: [{
      icon: {
        path: 'M 0,-2 0,2', // Vertical dash line
        strokeOpacity: 1.0,
        strokeColor: '#FFD700', // Bright yellow
        strokeWeight: 4, // Thick dashes for visibility
        scale: 1
      },
      offset: '0',
      repeat: '40px' // Spacing between dashes for striped effect
    }]
  });
  
  // Add all polylines to map
  baseRoad.setMap(map);
  roadSurface.setMap(map);
  centerLine.setMap(map);
  
  polylines.push(baseRoad, roadSurface, centerLine);
  
  console.log('🛣️ Created realistic road appearance with yellow striping');
  return polylines;
};

const NuclearRouteManager: React.FC<NuclearRouteManagerProps> = ({ map, isMapReady }) => {
  const { waypoints, isLoading, error } = useSupabaseRoute66();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const [hasCreatedRoute, setHasCreatedRoute] = useState(false);
  const initializationRef = useRef(false);

  console.log('☢️ NuclearRouteManager: Enhanced road renderer', {
    isMapReady,
    isLoading,
    error,
    waypointsCount: waypoints.length,
    hasCreatedRoute
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

  // Create the enhanced curved Route 66 road
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

    console.log('☢️ NuclearRouteManager: Creating enhanced curved Route 66 road with yellow striping');

    // Clean up any existing polylines first
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    // Create smooth curved path
    const smoothPath = createSmoothCurvedPath(waypoints);

    if (smoothPath.length < 2) {
      console.error('☢️ NuclearRouteManager: createSmoothCurvedPath returned insufficient points');
      return;
    }

    console.log('☢️ NuclearRouteManager: Creating realistic road with', smoothPath.length, 'curved points');

    // Create road-like polylines with yellow striping
    const roadPolylines = createRoadPolylines(map, smoothPath);
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

    console.log('☢️ NuclearRouteManager: Enhanced curved Route 66 road with yellow striping created successfully');

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
      console.log('☢️ NuclearRouteManager: Component unmounting - cleaning up');
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
      polylinesRef.current = [];
      setHasCreatedRoute(false);
      RouteGlobalState.setRouteCreated(false);
    };
  }, []);

  return null;
};

export default NuclearRouteManager;
