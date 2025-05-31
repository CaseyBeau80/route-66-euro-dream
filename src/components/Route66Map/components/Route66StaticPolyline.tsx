
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';

interface Route66StaticPolylineProps {
  map: google.maps.Map;
}

const Route66StaticPolyline: React.FC<Route66StaticPolylineProps> = ({ map }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const centerLineRef = useRef<google.maps.Polyline | null>(null);
  const roadEdge1Ref = useRef<google.maps.Polyline | null>(null);
  const roadEdge2Ref = useRef<google.maps.Polyline | null>(null);
  
  const { waypoints, isLoading, error } = useSupabaseRoute66();

  useEffect(() => {
    if (!map || isLoading || error || waypoints.length === 0) {
      if (error) {
        console.log("❌ Error loading waypoints for textured route:", error);
      }
      return;
    }

    console.log("🗺️ Creating textured Route 66 polyline with realistic road appearance and yellow dashed center line...");

    // Convert Supabase waypoints to Google Maps format
    const route66Path = waypoints
      .sort((a, b) => a.sequence_order - b.sequence_order)
      .map(waypoint => ({
        lat: Number(waypoint.latitude),
        lng: Number(waypoint.longitude)
      }));

    console.log(`🛣️ Using ${route66Path.length} waypoints from Supabase for textured route`);

    // Create a custom textured road icon for the polyline
    const createAsphaltTexture = () => {
      return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4,
        fillColor: '#2C2C2C',
        fillOpacity: 0.8,
        strokeColor: '#1A1A1A',
        strokeWeight: 1,
        strokeOpacity: 0.6
      };
    };

    // Create weathered road edges for depth
    const roadEdgePolyline2 = new google.maps.Polyline({
      path: route66Path,
      geodesic: true,
      strokeColor: '#404040',
      strokeOpacity: 0.3,
      strokeWeight: 12,
      zIndex: 998,
      clickable: false
    });

    const roadEdgePolyline1 = new google.maps.Polyline({
      path: route66Path,
      geodesic: true,
      strokeColor: '#1A1A1A',
      strokeOpacity: 0.4,
      strokeWeight: 10,
      zIndex: 999,
      clickable: false
    });

    // Create the main Route 66 polyline with realistic asphalt appearance
    const route66Polyline = new google.maps.Polyline({
      path: route66Path,
      geodesic: true,
      strokeColor: '#2C2C2C', // Dark asphalt color
      strokeOpacity: 0.9,
      strokeWeight: 8,
      zIndex: 1000,
      clickable: false,
      icons: [{
        icon: createAsphaltTexture(),
        offset: '0%',
        repeat: '20px'
      }]
    });

    // Create realistic dashed yellow center line - this is the key feature
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
          path: 'M 0,-0.5 L 0,0.5',
          strokeOpacity: 1,
          strokeColor: '#FFD700',
          strokeWeight: 3,
          scale: 4
        },
        offset: '0%',
        repeat: '40px' // Dashed pattern spacing
      }]
    });

    // Set all polylines on the map in correct order
    roadEdgePolyline2.setMap(map);
    roadEdgePolyline1.setMap(map);
    route66Polyline.setMap(map);
    centerLinePolyline.setMap(map);
    
    // Store references for cleanup
    polylineRef.current = route66Polyline;
    centerLineRef.current = centerLinePolyline;
    roadEdge1Ref.current = roadEdgePolyline1;
    roadEdge2Ref.current = roadEdgePolyline2;

    console.log("✅ Textured Route 66 polyline created with yellow dashed center line using", route66Path.length, "Supabase waypoints");

    // Wait a moment before fitting bounds to ensure polylines are rendered
    setTimeout(() => {
      // Create bounds for the entire route
      const bounds = new google.maps.LatLngBounds();
      route66Path.forEach(point => {
        bounds.extend(new google.maps.LatLng(point.lat, point.lng));
      });

      // Fit the map to show the entire route with some padding
      map.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      });

      console.log("🎯 Map bounds fitted to textured Route 66 with yellow dashed center line");
    }, 500);

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up textured Route 66 polylines");
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      if (centerLineRef.current) {
        centerLineRef.current.setMap(null);
      }
      if (roadEdge1Ref.current) {
        roadEdge1Ref.current.setMap(null);
      }
      if (roadEdge2Ref.current) {
        roadEdge2Ref.current.setMap(null);
      }
    };
  }, [map, waypoints, isLoading, error]);

  return null;
};

export default Route66StaticPolyline;
