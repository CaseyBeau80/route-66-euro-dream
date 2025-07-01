
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';

interface SingleRouteRendererProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const SingleRouteRenderer: React.FC<SingleRouteRendererProps> = ({ map, isMapReady }) => {
  const { waypoints, isLoading, error } = useSupabaseRoute66();
  const polylineRef = useRef<google.maps.Polyline | null>(null);
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

    console.log('🛣️ SingleRouteRenderer: Creating Route 66 polyline');

    // Clean up any existing polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

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

    console.log('🛣️ Creating polyline with', routePoints.length, 'points');

    // Create the Route 66 polyline
    const polyline = new google.maps.Polyline({
      path: routePoints,
      geodesic: true,
      strokeColor: '#DC2626', // Route 66 red
      strokeOpacity: 0.8,
      strokeWeight: 6,
      zIndex: 1000
    });

    // Add to map
    polyline.setMap(map);
    polylineRef.current = polyline;
    hasRendered.current = true;

    // Fit map to route bounds
    const bounds = new google.maps.LatLngBounds();
    routePoints.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);

    // Zoom out slightly for better view
    setTimeout(() => {
      const currentZoom = map.getZoom() || 5;
      map.setZoom(Math.max(4, currentZoom - 1));
    }, 1000);

    console.log('✅ Route 66 polyline created successfully');

  }, [map, isMapReady, waypoints, isLoading, error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        console.log('🧹 Cleaning up SingleRouteRenderer polyline');
        polylineRef.current.setMap(null);
      }
    };
  }, []);

  return null;
};

export default SingleRouteRenderer;
