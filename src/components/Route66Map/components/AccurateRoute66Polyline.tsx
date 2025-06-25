
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { DistanceCalculationService } from '../../TripCalculator/services/utils/DistanceCalculationService';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface AccurateRoute66PolylineProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const AccurateRoute66Polyline: React.FC<AccurateRoute66PolylineProps> = ({ map, isMapReady }) => {
  const { waypoints, isLoading, error } = useSupabaseRoute66();
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const centerLineRef = useRef<google.maps.Polyline | null>(null);

  console.log('🛣️ AccurateRoute66Polyline: Initializing with complete waypoints data', {
    isMapReady,
    isLoading,
    error,
    waypointsCount: waypoints.length
  });

  useEffect(() => {
    // Cleanup existing polylines
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (centerLineRef.current) {
      centerLineRef.current.setMap(null);
      centerLineRef.current = null;
    }

    if (!map || !isMapReady || isLoading || error || waypoints.length === 0) {
      console.log('❌ AccurateRoute66Polyline: Prerequisites not met', {
        hasMap: !!map,
        isMapReady,
        isLoading,
        error,
        waypointsCount: waypoints.length
      });
      return;
    }

    console.log('🔍 AccurateRoute66Polyline: Processing waypoints for accurate route');
    
    // Step 1: Sort all waypoints by sequence_order
    const sortedWaypoints = [...waypoints]
      .filter(wp => wp.latitude && wp.longitude && wp.sequence_order !== null)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    console.log('📊 Route analysis:', {
      totalWaypoints: waypoints.length,
      validWaypoints: sortedWaypoints.length,
      sequenceRange: `${sortedWaypoints[0]?.sequence_order} - ${sortedWaypoints[sortedWaypoints.length - 1]?.sequence_order}`
    });

    // Step 2: Validate sequence and detect duplicates/gaps
    const validationResults = validateWaypointSequence(sortedWaypoints);
    
    if (validationResults.hasErrors) {
      console.warn('⚠️ Waypoint validation issues detected:', validationResults);
    }

    // Step 3: Create interpolated path with distance validation
    const interpolatedPath = createInterpolatedPath(sortedWaypoints);
    
    if (interpolatedPath.length < 2) {
      console.error('❌ Insufficient waypoints for route creation');
      return;
    }

    console.log('🗺️ Creating accurate Route 66 polyline with interpolated path:', {
      originalWaypoints: sortedWaypoints.length,
      interpolatedPoints: interpolatedPath.length,
      startPoint: `${interpolatedPath[0].lat.toFixed(4)}, ${interpolatedPath[0].lng.toFixed(4)}`,
      endPoint: `${interpolatedPath[interpolatedPath.length - 1].lat.toFixed(4)}, ${interpolatedPath[interpolatedPath.length - 1].lng.toFixed(4)}`
    });

    // Create main asphalt road polyline
    const mainPolyline = new google.maps.Polyline({
      path: interpolatedPath,
      geodesic: true,
      strokeColor: '#2C1810', // Dark asphalt
      strokeOpacity: 0.95,
      strokeWeight: 10,
      clickable: false,
      zIndex: 50
    });

    // Create yellow center line
    const centerLine = new google.maps.Polyline({
      path: interpolatedPath,
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
          strokeWeight: 4,
          scale: 1
        },
        offset: '0',
        repeat: '50px'
      }]
    });

    // Add to map
    mainPolyline.setMap(map);
    centerLine.setMap(map);
    
    polylineRef.current = mainPolyline;
    centerLineRef.current = centerLine;

    // Fit map bounds to route
    const bounds = new google.maps.LatLngBounds();
    interpolatedPath.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);

    // Zoom out slightly for better view
    setTimeout(() => {
      const currentZoom = map.getZoom() || 5;
      map.setZoom(Math.max(4, currentZoom - 1));
    }, 1000);

    console.log('✅ AccurateRoute66Polyline: Successfully created complete Route 66 polyline');

  }, [map, isMapReady, waypoints, isLoading, error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      if (centerLineRef.current) {
        centerLineRef.current.setMap(null);
      }
    };
  }, []);

  return null;
};

// Step 4: Validation logic for waypoint sequence
const validateWaypointSequence = (waypoints: Route66Waypoint[]) => {
  const issues: string[] = [];
  const duplicateSequences: number[] = [];
  const sequenceGaps: number[] = [];

  // Check for duplicate sequence orders
  const sequenceMap = new Map<number, Route66Waypoint[]>();
  waypoints.forEach(wp => {
    const seq = wp.sequence_order;
    if (!sequenceMap.has(seq)) {
      sequenceMap.set(seq, []);
    }
    sequenceMap.get(seq)!.push(wp);
  });

  sequenceMap.forEach((wps, seq) => {
    if (wps.length > 1) {
      duplicateSequences.push(seq);
      issues.push(`Duplicate sequence ${seq}: ${wps.map(w => w.name).join(', ')}`);
    }
  });

  // Check for sequence gaps
  const sequences = Array.from(sequenceMap.keys()).sort((a, b) => a - b);
  for (let i = 1; i < sequences.length; i++) {
    const current = sequences[i];
    const previous = sequences[i - 1];
    if (current - previous > 1) {
      for (let gap = previous + 1; gap < current; gap++) {
        sequenceGaps.push(gap);
      }
      issues.push(`Sequence gap: ${previous} → ${current} (missing ${current - previous - 1} sequences)`);
    }
  }

  return {
    hasErrors: issues.length > 0,
    issues,
    duplicateSequences,
    sequenceGaps,
    totalWaypoints: waypoints.length,
    validSequences: sequences.length
  };
};

// Step 5: Create interpolated path with distance validation
const createInterpolatedPath = (waypoints: Route66Waypoint[]): google.maps.LatLngLiteral[] => {
  if (waypoints.length < 2) return [];

  const path: google.maps.LatLngLiteral[] = [];
  const LARGE_JUMP_THRESHOLD = 50; // miles
  const INTERPOLATION_SEGMENTS = 10;

  for (let i = 0; i < waypoints.length; i++) {
    const current = waypoints[i];
    const currentPoint = { lat: current.latitude, lng: current.longitude };
    
    // Always add the current waypoint
    if (i === 0) {
      path.push(currentPoint);
    }

    // If there's a next waypoint, check distance and interpolate if needed
    if (i < waypoints.length - 1) {
      const next = waypoints[i + 1];
      const nextPoint = { lat: next.latitude, lng: next.longitude };
      
      // Calculate distance between current and next waypoint
      const distance = DistanceCalculationService.calculateDistance(
        current.latitude, current.longitude,
        next.latitude, next.longitude
      );

      console.log(`📏 Distance ${current.name} → ${next.name}: ${distance.toFixed(1)} miles`);

      // If distance is large, add interpolated points
      if (distance > LARGE_JUMP_THRESHOLD) {
        console.log(`⚠️ Large jump detected (${distance.toFixed(1)} miles), interpolating...`);
        
        // Create interpolated points
        for (let seg = 1; seg <= INTERPOLATION_SEGMENTS; seg++) {
          const ratio = seg / INTERPOLATION_SEGMENTS;
          const interpolatedPoint = {
            lat: current.latitude + (next.latitude - current.latitude) * ratio,
            lng: current.longitude + (next.longitude - current.longitude) * ratio
          };
          path.push(interpolatedPoint);
        }
      } else {
        // Direct connection for normal distances
        path.push(nextPoint);
      }
    }
  }

  console.log(`🛣️ Created interpolated path with ${path.length} points`);
  return path;
};

export default AccurateRoute66Polyline;
