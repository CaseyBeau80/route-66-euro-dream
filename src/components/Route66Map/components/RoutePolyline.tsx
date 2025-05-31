
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';
import { fitMapToRoute } from '../utils/mapBoundsUtils';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const centerLineRef = useRef<google.maps.Polyline | null>(null);
  const edgeLineRef = useRef<google.maps.Polyline | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!map || !waypoints.length) return;

    // Convert waypoints to Google Maps LatLng objects, sorted by sequence
    const sortedWaypoints = [...waypoints].sort((a, b) => a.sequence_order - b.sequence_order);
    const routePath = sortedWaypoints.map(waypoint => ({
      lat: waypoint.latitude,
      lng: waypoint.longitude
    }));

    // Create realistic asphalt texture
    const createAsphaltTexture = () => {
      return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 3,
        fillColor: '#2C2C2C',
        fillOpacity: 0.7,
        strokeColor: '#1A1A1A',
        strokeWeight: 1,
        strokeOpacity: 0.5
      };
    };

    // Create weathered road base (wider, darker)
    const roadBase = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#1A1A1A', // Very dark asphalt
      strokeOpacity: 0.4,
      strokeWeight: 10,
      zIndex: 9998
    });

    // Create main asphalt road surface
    const route66Polyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#2C2C2C', // Dark asphalt gray
      strokeOpacity: 0.9,
      strokeWeight: 7,
      zIndex: 9999,
      clickable: true,
      icons: [{
        icon: createAsphaltTexture(),
        offset: '0%',
        repeat: '25px'
      }]
    });

    // Create realistic dashed yellow center line to match screenshot
    const centerLine = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FFD700', // Highway yellow
      strokeOpacity: 0,
      strokeWeight: 0,
      zIndex: 10000,
      clickable: false,
      icons: [{
        icon: {
          path: 'M 0,-0.5 L 0,0.5',
          strokeOpacity: 1,
          strokeColor: '#FFD700',
          strokeWeight: 3,
          scale: 4
        },
        offset: '0%',
        repeat: '40px'
      }]
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
              <p class="text-xs text-gray-500 mb-2">2,448 miles of weathered asphalt</p>
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

    // Set all polylines on the map in proper order
    roadBase.setMap(map);
    route66Polyline.setMap(map);
    centerLine.setMap(map);
    
    polylineRef.current = route66Polyline;
    centerLineRef.current = centerLine;
    edgeLineRef.current = roadBase;
    
    console.log(`✅ Realistic textured Route 66 polyline added with ${waypoints.length} waypoints`);
    console.log(`📊 Route data: ${waypoints.filter(w => w.is_major_stop).length} major stops, ${waypoints.filter(w => !w.is_major_stop).length} intermediate waypoints`);

    // Fit the map to show the entire route with some padding
    fitMapToRoute(map, routePath);

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      if (centerLineRef.current) {
        centerLineRef.current.setMap(null);
        centerLineRef.current = null;
      }
      if (edgeLineRef.current) {
        edgeLineRef.current.setMap(null);
        edgeLineRef.current = null;
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
