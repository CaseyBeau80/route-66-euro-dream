
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';
import { fitMapToRoute } from '../utils/mapBoundsUtils';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!map || !waypoints.length) {
      console.log('❌ RoutePolyline: Missing map or waypoints', { hasMap: !!map, waypointsCount: waypoints.length });
      return;
    }

    console.log('🛣️ RoutePolyline: Creating simple route with', waypoints.length, 'waypoints');

    // Convert waypoints to Google Maps LatLng objects, sorted by sequence
    const sortedWaypoints = [...waypoints].sort((a, b) => a.sequence_order - b.sequence_order);
    const routePath = sortedWaypoints.map(waypoint => ({
      lat: waypoint.latitude,
      lng: waypoint.longitude
    }));

    console.log('📍 RoutePolyline: Route path created:', {
      totalWaypoints: routePath.length,
      firstPoint: routePath[0],
      lastPoint: routePath[routePath.length - 1]
    });

    // Create a simple, clean Route 66 polyline
    const route66Polyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#D92121', // Classic Route 66 red
      strokeOpacity: 0.9,
      strokeWeight: 6,
      zIndex: 10000,
      clickable: true,
      visible: true
    });

    // Add click listener for route information
    route66Polyline.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng && infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      
      if (event.latLng) {
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-3 max-w-xs">
              <h3 class="font-bold text-red-600 mb-2 text-lg">Historic Route 66</h3>
              <p class="text-sm text-gray-700 mb-1">The Mother Road</p>
              <p class="text-sm text-gray-700 mb-1">Chicago to Santa Monica</p>
              <p class="text-xs text-gray-500 mb-2">2,448 miles of American history</p>
              <div class="text-xs text-gray-600">
                <p><strong>${waypoints.length}</strong> waypoints loaded</p>
                <p><strong>${waypoints.filter(w => w.is_major_stop).length}</strong> major stops</p>
              </div>
            </div>
          `,
          position: event.latLng,
          maxWidth: 300
        });
        
        infoWindow.open(map);
        infoWindowRef.current = infoWindow;
      }
    });

    // Set polyline on the map
    route66Polyline.setMap(map);
    polylineRef.current = route66Polyline;
    
    console.log(`✅ Simple Route 66 polyline created and added to map with ${waypoints.length} waypoints`);
    console.log(`📊 Route data: ${waypoints.filter(w => w.is_major_stop).length} major stops, ${waypoints.filter(w => !w.is_major_stop).length} intermediate waypoints`);

    // Fit the map to show the entire route with some padding
    fitMapToRoute(map, routePath);

    return () => {
      console.log('🧹 RoutePolyline: Cleaning up polyline');
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    };
  }, [map, waypoints]);

  return null;
};

export default RoutePolyline;
