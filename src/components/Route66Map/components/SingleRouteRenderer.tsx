
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';

interface SingleRouteRendererProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const SingleRouteRenderer: React.FC<SingleRouteRendererProps> = ({ map, isMapReady }) => {
  const { waypoints, isLoading, error } = useSupabaseRoute66();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const hasRendered = useRef(false);

  console.log('🛣️ SingleRouteRenderer: Starting with waypoints:', waypoints.length);

  useEffect(() => {
    // Don't render if conditions aren't met
    if (!map || !isMapReady || isLoading || error || waypoints.length === 0 || hasRendered.current) {
      console.log('🛣️ SingleRouteRenderer: Skipping render', {
        hasMap: !!map,
        isMapReady,
        isLoading,
        error: !!error,
        waypointsCount: waypoints.length,
        hasRendered: hasRendered.current
      });
      return;
    }

    console.log('🛣️ SingleRouteRenderer: Creating Route 66 road with yellow striping');

    // Clean up any existing polylines
    polylinesRef.current.forEach(polyline => {
      if (polyline) {
        polyline.setMap(null);
      }
    });
    polylinesRef.current = [];

    // Use major stops only for clean route
    const majorStops = waypoints
      .filter(wp => 
        wp.latitude && 
        wp.longitude && 
        wp.sequence_order !== null &&
        wp.is_major_stop === true
      )
      .sort((a, b) => a.sequence_order - b.sequence_order);

    console.log('🛣️ Major stops for route:', majorStops.map(s => 
      `${s.sequence_order}. ${s.name}, ${s.state}`
    ));

    // Fallback to hardcoded Route 66 points if no major stops
    let routePoints;
    if (majorStops.length >= 2) {
      routePoints = majorStops.map(stop => ({
        lat: stop.latitude,
        lng: stop.longitude
      }));
    } else {
      console.log('🛣️ Using fallback Route 66 coordinates');
      routePoints = [
        { lat: 41.8781, lng: -87.6298 }, // Chicago, IL
        { lat: 39.8003, lng: -89.6437 }, // Springfield, IL
        { lat: 38.7067, lng: -90.3990 }, // St. Louis, MO
        { lat: 37.2090, lng: -93.2923 }, // Springfield, MO
        { lat: 35.4676, lng: -97.5164 }, // Oklahoma City, OK
        { lat: 35.2220, lng: -101.8313 }, // Amarillo, TX
        { lat: 35.0844, lng: -106.6504 }, // Albuquerque, NM
        { lat: 35.1983, lng: -111.6513 }, // Flagstaff, AZ
        { lat: 35.0222, lng: -114.3716 }, // Kingman, AZ
        { lat: 34.0195, lng: -118.4912 } // Santa Monica, CA
      ];
    }

    console.log('🛣️ Creating road with yellow striping using', routePoints.length, 'points');

    // Create realistic road appearance with multiple layers
    
    // 1. Base road (dark asphalt)
    const baseRoad = new google.maps.Polyline({
      path: routePoints,
      geodesic: true,
      strokeColor: '#2C2C2C', // Dark asphalt gray
      strokeOpacity: 1.0,
      strokeWeight: 16,
      clickable: false,
      zIndex: 1000
    });
    
    // 2. Road surface (lighter gray)
    const roadSurface = new google.maps.Polyline({
      path: routePoints,
      geodesic: true,
      strokeColor: '#4A4A4A', // Medium gray
      strokeOpacity: 1.0,
      strokeWeight: 12,
      clickable: false,
      zIndex: 1001
    });
    
    // 3. Yellow striped center line with dashed pattern
    const centerLine = new google.maps.Polyline({
      path: routePoints,
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
    
    // Store references for cleanup
    polylinesRef.current = [baseRoad, roadSurface, centerLine];
    hasRendered.current = true;

    // Don't auto-fit bounds - let user control navigation
    console.log('✅ Route rendered without auto-navigation - user maintains control');

    console.log('✅ Route 66 road with yellow striping created successfully');

  }, [map, isMapReady, waypoints, isLoading, error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      polylinesRef.current.forEach(polyline => {
        if (polyline) {
          console.log('🧹 Cleaning up road polyline');
          polyline.setMap(null);
        }
      });
    };
  }, []);

  return null;
};

export default SingleRouteRenderer;
