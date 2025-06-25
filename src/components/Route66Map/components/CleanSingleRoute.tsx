
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface CleanSingleRouteProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const CleanSingleRoute: React.FC<CleanSingleRouteProps> = ({ map, waypoints }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  console.log('🛣️ CleanSingleRoute: DIAGNOSTIC MODE - Full waypoint analysis', {
    totalWaypoints: waypoints.length,
    hasMap: !!map,
    waypoints: waypoints.map(w => ({
      name: w.name,
      state: w.state,
      sequence_order: w.sequence_order,
      is_major_stop: w.is_major_stop,
      lat: w.latitude,
      lng: w.longitude
    }))
  });

  useEffect(() => {
    // Clean up any existing polyline first
    if (polylineRef.current) {
      console.log('🧹 Cleaning up existing polyline');
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (!map || !waypoints.length) {
      console.log('❌ Missing map or waypoints');
      return;
    }

    // First, try with major stops
    let routePoints = waypoints
      .filter(wp => 
        wp.latitude && 
        wp.longitude && 
        wp.sequence_order !== null &&
        wp.is_major_stop === true
      )
      .sort((a, b) => a.sequence_order - b.sequence_order);

    console.log('📍 Major stops found:', routePoints.length);

    // If we don't have enough major stops, use ALL valid waypoints
    if (routePoints.length < 2) {
      console.log('⚠️ Not enough major stops, using ALL waypoints');
      routePoints = waypoints
        .filter(wp => 
          wp.latitude && 
          wp.longitude && 
          wp.sequence_order !== null
        )
        .sort((a, b) => a.sequence_order - b.sequence_order);
    }

    // If we STILL don't have enough, use hardcoded Route 66 points
    if (routePoints.length < 2) {
      console.log('🆘 FALLBACK: Using hardcoded Route 66 coordinates');
      const fallbackPoints = [
        { lat: 41.8781, lng: -87.6298, name: "Chicago, IL" },
        { lat: 39.8003, lng: -89.6437, name: "Springfield, IL" },
        { lat: 38.7067, lng: -90.3990, name: "St. Louis, MO" },
        { lat: 37.2090, lng: -93.2923, name: "Springfield, MO" },
        { lat: 35.4676, lng: -97.5164, name: "Oklahoma City, OK" },
        { lat: 35.2220, lng: -101.8313, name: "Amarillo, TX" },
        { lat: 35.0844, lng: -106.6504, name: "Albuquerque, NM" },
        { lat: 35.1983, lng: -111.6513, name: "Flagstaff, AZ" },
        { lat: 35.0222, lng: -114.3716, name: "Kingman, AZ" },
        { lat: 34.0195, lng: -118.4912, name: "Santa Monica, CA" }
      ];
      
      routePoints = fallbackPoints.map(p => ({
        latitude: p.lat,
        longitude: p.lng,
        name: p.name,
        sequence_order: 0,
        is_major_stop: true
      })) as Route66Waypoint[];
    }

    console.log('🗺️ Final route points:', routePoints.map(p => 
      `${p.name} (${p.latitude}, ${p.longitude})`
    ));

    // Create path from route points
    const path: google.maps.LatLngLiteral[] = routePoints.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    console.log('🎯 Creating polyline with path:', {
      pathLength: path.length,
      start: `${path[0].lat}, ${path[0].lng}`,
      end: `${path[path.length - 1].lat}, ${path[path.length - 1].lng}`
    });

    // Create a VERY visible polyline
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF0000', // Bright red
      strokeOpacity: 1.0,
      strokeWeight: 8, // Very thick
      zIndex: 1000 // High z-index
    });

    // Add to map
    polyline.setMap(map);
    polylineRef.current = polyline;

    // Force map to show the route by fitting bounds
    if (path.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      path.forEach(point => bounds.extend(point));
      map.fitBounds(bounds);
      
      // Add some padding and zoom out a bit
      setTimeout(() => {
        const currentZoom = map.getZoom() || 5;
        map.setZoom(Math.max(4, currentZoom - 1));
      }, 1000);
    }

    console.log('✅ DIAGNOSTIC: Route 66 polyline created with bounds fitting');
    console.log('🔍 Polyline properties:', {
      path: polyline.getPath().getLength(),
      visible: polyline.getVisible(),
      map: !!polyline.getMap(),
      strokeColor: '#FF0000',
      strokeWeight: 8
    });

  }, [map, waypoints]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        console.log('🧹 Cleaning up polyline on unmount');
        polylineRef.current.setMap(null);
      }
    };
  }, []);

  return null;
};

export default CleanSingleRoute;
