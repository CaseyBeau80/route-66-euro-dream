
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';

interface Route66StaticPolylineProps {
  map: google.maps.Map;
}

const Route66StaticPolyline: React.FC<Route66StaticPolylineProps> = ({ map }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const centerLineRef = useRef<google.maps.Polyline | null>(null);
  const isRenderingRef = useRef<boolean>(false);
  
  const { waypoints, isLoading, error } = useSupabaseRoute66();

  useEffect(() => {
    if (!map || isLoading || error || waypoints.length === 0 || isRenderingRef.current) {
      return;
    }

    console.log("🗺️ Creating SINGLE Route 66 polyline - clearing any existing polylines first");
    
    // Mark as rendering to prevent duplicates
    isRenderingRef.current = true;

    // AGGRESSIVELY clean up any existing polylines from this component
    if (polylineRef.current) {
      console.log("🧹 Removing existing main polyline");
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (centerLineRef.current) {
      console.log("🧹 Removing existing center line");
      centerLineRef.current.setMap(null);
      centerLineRef.current = null;
    }

    // Clean up any existing polylines on the map
    // This will remove ALL polylines to ensure a clean slate
    const existingOverlays = (map as any).overlayMapTypes;
    if (existingOverlays) {
      existingOverlays.clear();
    }

    // Convert Supabase waypoints to Google Maps format
    const route66Path = waypoints
      .sort((a, b) => a.sequence_order - b.sequence_order)
      .map(waypoint => ({
        lat: Number(waypoint.latitude),
        lng: Number(waypoint.longitude)
      }));

    console.log(`🛣️ Creating Route 66 road with ${route66Path.length} waypoints`);

    // Create the main Route 66 polyline with dark asphalt appearance
    const route66Polyline = new google.maps.Polyline({
      path: route66Path,
      geodesic: true,
      strokeColor: '#2C2C2C', // Dark asphalt color
      strokeOpacity: 0.9,
      strokeWeight: 8,
      zIndex: 1000,
      clickable: false
    });

    // Set the polyline on the map
    route66Polyline.setMap(map);
    polylineRef.current = route66Polyline;

    // Create yellow dashed center line
    const centerLinePolyline = new google.maps.Polyline({
      path: route66Path,
      geodesic: true,
      strokeColor: '#FFD700', // Bright yellow for visibility
      strokeOpacity: 0,
      strokeWeight: 0,
      zIndex: 1001,
      clickable: false,
      icons: [{
        icon: {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          strokeColor: '#FFD700',
          strokeWeight: 4,
          scale: 1
        },
        offset: '0%',
        repeat: '40px'
      }]
    });

    centerLinePolyline.setMap(map);
    centerLineRef.current = centerLinePolyline;

    console.log("✅ SINGLE Route 66 polyline created successfully");

    // Fit map bounds after a delay
    setTimeout(() => {
      const bounds = new google.maps.LatLngBounds();
      route66Path.forEach(point => {
        bounds.extend(new google.maps.LatLng(point.lat, point.lng));
      });

      map.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      });

      console.log("🎯 Map bounds fitted to Route 66");
      isRenderingRef.current = false;
    }, 500);

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up Route 66 polylines");
      
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      if (centerLineRef.current) {
        centerLineRef.current.setMap(null);
        centerLineRef.current = null;
      }
      isRenderingRef.current = false;
    };
  }, [map, waypoints, isLoading, error]);

  return null;
};

export default Route66StaticPolyline;
