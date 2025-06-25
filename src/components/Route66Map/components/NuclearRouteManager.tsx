
import React, { useEffect, useRef, useState } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { RouteGlobalState } from '../services/RouteGlobalState';
import type { Route66Waypoint } from '../types/supabaseTypes';
import { DistanceCalculationService } from '../../TripCalculator/services/utils/DistanceCalculationService';

interface NuclearRouteManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// Enhanced function to generate Route 66 polyline with detailed logging
const generateRoute66Polyline = (waypoints: Route66Waypoint[]): google.maps.LatLngLiteral[] => {
  console.log('🛣️ generateRoute66Polyline: Starting with waypoints from database ONLY');
  console.log('🔍 RAW waypoints from database:', waypoints.map(wp => ({
    name: wp.name,
    state: wp.state,
    sequence_order: wp.sequence_order,
    is_major_stop: wp.is_major_stop,
    lat: wp.latitude,
    lng: wp.longitude
  })));
  
  // STEP 1: Filter valid waypoints (ONLY from waypoints table)
  const validWaypoints = waypoints
    .filter(wp => {
      const isValid = wp.latitude && 
        wp.longitude && 
        wp.sequence_order !== null &&
        !isNaN(wp.latitude) &&
        !isNaN(wp.longitude) &&
        wp.sequence_order > 0; // Ensure positive sequence
      
      if (!isValid) {
        console.warn('❌ INVALID waypoint filtered out:', {
          name: wp.name,
          lat: wp.latitude,
          lng: wp.longitude,
          sequence: wp.sequence_order
        });
      }
      
      return isValid;
    });

  console.log('✅ STEP 1 - Valid waypoints after filtering:', validWaypoints.length);

  // STEP 2: Sort by sequence_order (CRITICAL for correct routing)
  const sortedWaypoints = validWaypoints.sort((a, b) => {
    const diff = a.sequence_order - b.sequence_order;
    console.log(`🔄 Sorting: ${a.name} (${a.sequence_order}) vs ${b.name} (${b.sequence_order}) = ${diff}`);
    return diff;
  });

  console.log('✅ STEP 2 - Waypoints sorted by sequence_order:');
  sortedWaypoints.forEach((wp, index) => {
    console.log(`  ${index + 1}. SEQ ${wp.sequence_order}: ${wp.name}, ${wp.state} (${wp.latitude}, ${wp.longitude})`);
  });
  
  if (sortedWaypoints.length < 2) {
    console.error('❌ Insufficient waypoints for route:', sortedWaypoints.length);
    return [];
  }

  // STEP 3: Generate path and validate each segment
  const path: google.maps.LatLngLiteral[] = [];
  const segmentLogs: string[] = [];
  let totalDistance = 0;
  let largeJumpCount = 0;
  
  sortedWaypoints.forEach((waypoint, index) => {
    const point = {
      lat: waypoint.latitude,
      lng: waypoint.longitude
    };
    
    path.push(point);
    
    // Log each coordinate added
    console.log(`📍 ADDED Point ${index + 1}: ${waypoint.name} = (${point.lat}, ${point.lng})`);
    
    // Validate segment distance (only between consecutive waypoints)
    if (index > 0) {
      const prevWaypoint = sortedWaypoints[index - 1];
      const distance = DistanceCalculationService.calculateDistance(
        prevWaypoint.latitude,
        prevWaypoint.longitude,
        waypoint.latitude,
        waypoint.longitude
      );
      
      totalDistance += distance;
      
      const segmentInfo = `Segment ${index}: ${prevWaypoint.name} → ${waypoint.name} = ${distance.toFixed(1)} miles`;
      segmentLogs.push(segmentInfo);
      
      // Flag large jumps (over 50 miles)
      if (distance > 50) {
        largeJumpCount++;
        console.warn(`🚨 LARGE JUMP DETECTED: ${segmentInfo}`);
        console.warn(`   Previous: (${prevWaypoint.latitude}, ${prevWaypoint.longitude})`);
        console.warn(`   Current:  (${waypoint.latitude}, ${waypoint.longitude})`);
      } else {
        console.log(`✅ Normal segment: ${segmentInfo}`);
      }
    }
  });

  // STEP 4: Final validation and summary
  console.log('🏁 ROUTE GENERATION COMPLETE:');
  console.log(`   Total waypoints processed: ${sortedWaypoints.length}`);
  console.log(`   Total path points: ${path.length}`);
  console.log(`   Total distance: ${totalDistance.toFixed(1)} miles`);
  console.log(`   Large jumps (>50mi): ${largeJumpCount}`);
  console.log(`   Start: ${sortedWaypoints[0].name} (${path[0].lat}, ${path[0].lng})`);
  console.log(`   End: ${sortedWaypoints[sortedWaypoints.length - 1].name} (${path[path.length - 1].lat}, ${path[path.length - 1].lng})`);
  
  // Log all segments for review
  console.log('📋 ALL SEGMENTS:');
  segmentLogs.forEach(log => console.log(`   ${log}`));
  
  // Final path verification
  console.log('🔍 FINAL PATH VERIFICATION:');
  path.forEach((point, i) => {
    console.log(`   ${i + 1}. (${point.lat}, ${point.lng})`);
  });
  
  return path;
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
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const debugMarkersRef = useRef<google.maps.Marker[]>([]);
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

  // Create the SINGLE Route 66 polyline with debug markers
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

    console.log('☢️ NuclearRouteManager: Creating THE ONLY Route 66 polyline from waypoints table');
    console.log('📊 Data source confirmation: Using useSupabaseRoute66 hook which queries route66_waypoints table ONLY');

    // Clean up any existing polyline and debug markers first
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    
    debugMarkersRef.current.forEach(marker => marker.setMap(null));
    debugMarkersRef.current = [];

    // Use the enhanced function to generate the polyline path
    const path = generateRoute66Polyline(waypoints);

    if (path.length < 2) {
      console.error('☢️ NuclearRouteManager: generateRoute66Polyline returned insufficient points');
      return;
    }

    console.log('☢️ NuclearRouteManager: Creating NUCLEAR SINGLE polyline with', path.length, 'points');

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
    
    // Create debug markers for sequence validation
    debugMarkersRef.current = createDebugMarkers(map, waypoints);
    
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
    console.log('✅ FINAL VERIFICATION: Polyline connects', path.length, 'points sequentially from waypoints table ONLY');

    // Add cleanup callback
    RouteGlobalState.addCleanupCallback(() => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      debugMarkersRef.current.forEach(marker => marker.setMap(null));
      debugMarkersRef.current = [];
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
      debugMarkersRef.current.forEach(marker => marker.setMap(null));
      debugMarkersRef.current = [];
      setHasCreatedRoute(false);
      RouteGlobalState.setRouteCreated(false);
    };
  }, []);

  return null;
};

export default NuclearRouteManager;
