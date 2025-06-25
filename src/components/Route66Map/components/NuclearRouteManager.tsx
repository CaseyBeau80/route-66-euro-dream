
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
  
  // Center yellow divider line
  const centerLine = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#FFD700', // Golden yellow
    strokeOpacity: 1.0,
    strokeWeight: 2,
    clickable: false,
    zIndex: 1002,
    icons: [{
      icon: {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        strokeColor: '#FFD700',
        strokeWeight: 2
      },
      offset: '0',
      repeat: '20px'
    }]
  });
  
  // Add all polylines to map
  baseRoad.setMap(map);
  roadSurface.setMap(map);
  centerLine.setMap(map);
  
  polylines.push(baseRoad, roadSurface, centerLine);
  
  console.log('🛣️ Created realistic road appearance with multiple layers');
  return polylines;
};

// Function to create numbered markers for debugging
const createDebugMarkers = (map: google.maps.Map, waypoints: Route66Waypoint[]): google.maps.Marker[] => {
  const markers: google.maps.Marker[] = [];
  
  const sortedWaypoints = waypoints
    .filter(wp => wp.latitude && wp.longitude && wp.sequence_order !== null)
    .sort((a, b) => a.sequence_order - b.sequence_order);
  
  sortedWaypoints.forEach((waypoint, index) => {
    const marker = new google.maps.Marker({
      position: { lat: waypoint.latitude, lng: waypoint.longitude },
      map: map,
      label: {
        text: (index + 1).toString(),
        color: 'white',
        fontWeight: 'bold',
        fontSize: '12px'
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: '#FF0000',
        fillOpacity: 0.8,
        strokeColor: 'white',
        strokeWeight: 2
      },
      title: `${index + 1}. ${waypoint.name} (Seq: ${waypoint.sequence_order})`,
      zIndex: 2000
    });
    
    markers.push(marker);
  });
  
  console.log(`🏷️ Created ${markers.length} debug markers for sequence validation`);
  return markers;
};

const NuclearRouteManager: React.FC<NuclearRouteManagerProps> = ({ map, isMapReady }) => {
  const { waypoints, isLoading, error } = useSupabaseRoute66();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const debugMarkersRef = useRef<google.maps.Marker[]>([]);
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

    console.log('☢️ NuclearRouteManager: Creating enhanced curved Route 66 road');

    // Clean up any existing polylines and debug markers first
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];
    
    debugMarkersRef.current.forEach(marker => marker.setMap(null));
    debugMarkersRef.current = [];

    // Create smooth curved path
    const smoothPath = createSmoothCurvedPath(waypoints);

    if (smoothPath.length < 2) {
      console.error('☢️ NuclearRouteManager: createSmoothCurvedPath returned insufficient points');
      return;
    }

    console.log('☢️ NuclearRouteManager: Creating realistic road with', smoothPath.length, 'curved points');

    // Create road-like polylines
    const roadPolylines = createRoadPolylines(map, smoothPath);
    polylinesRef.current = roadPolylines;
    setHasCreatedRoute(true);
    
    // Create debug markers for sequence validation
    debugMarkersRef.current = createDebugMarkers(map, waypoints);
    
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

    console.log('☢️ NuclearRouteManager: Enhanced curved Route 66 road created successfully');

    // Add cleanup callback
    RouteGlobalState.addCleanupCallback(() => {
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
      polylinesRef.current = [];
      debugMarkersRef.current.forEach(marker => marker.setMap(null));
      debugMarkersRef.current = [];
      setHasCreatedRoute(false);
    });

  }, [initializationRef.current, map, isMapReady, waypoints, isLoading, error, hasCreatedRoute]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('☢️ NuclearRouteManager: Component unmounting - cleaning up');
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
      polylinesRef.current = [];
      debugMarkersRef.current.forEach(marker => marker.setMap(null));
      debugMarkersRef.current = [];
      setHasCreatedRoute(false);
      RouteGlobalState.setRouteCreated(false);
    };
  }, []);

  return null;
};

export default NuclearRouteManager;
