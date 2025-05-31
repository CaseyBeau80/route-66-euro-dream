
import React, { useEffect, useRef } from 'react';

interface Route66StaticPolylineProps {
  map: google.maps.Map;
}

const Route66StaticPolyline: React.FC<Route66StaticPolylineProps> = ({ map }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) {
      console.log("❌ No map provided to Route66StaticPolyline");
      return;
    }

    console.log("🗺️ Creating Route 66 polyline with realistic road texture...");

    // Simplified but accurate Route 66 path with key waypoints
    const route66Path = [
      // Illinois
      { lat: 41.8781, lng: -87.6298 }, // Chicago - Start
      { lat: 41.5250, lng: -88.0817 }, // Joliet
      { lat: 39.8003, lng: -89.6437 }, // Springfield, IL
      
      // Missouri  
      { lat: 38.7067, lng: -90.3990 }, // St. Louis
      { lat: 37.2090, lng: -93.2923 }, // Springfield, MO
      { lat: 37.0842, lng: -94.5133 }, // Joplin
      
      // Oklahoma
      { lat: 36.1540, lng: -95.9928 }, // Tulsa
      { lat: 35.4676, lng: -97.5164 }, // Oklahoma City
      { lat: 35.5089, lng: -98.9680 }, // Elk City
      
      // Texas
      { lat: 35.2220, lng: -101.8313 }, // Amarillo
      
      // New Mexico
      { lat: 35.1245, lng: -103.7207 }, // Tucumcari
      { lat: 35.0844, lng: -106.6504 }, // Albuquerque
      { lat: 35.0820, lng: -108.7426 }, // Gallup
      
      // Arizona
      { lat: 35.0819, lng: -110.0298 }, // Holbrook
      { lat: 35.1983, lng: -111.6513 }, // Flagstaff
      { lat: 35.2262, lng: -112.8871 }, // Seligman
      { lat: 35.0222, lng: -114.3716 }, // Kingman
      
      // California
      { lat: 34.8409, lng: -114.6160 }, // Needles
      { lat: 34.8987, lng: -117.0178 }, // Barstow
      { lat: 34.1066, lng: -117.5931 }, // San Bernardino
      { lat: 34.0522, lng: -118.2437 }, // Los Angeles
      { lat: 34.0195, lng: -118.4912 }, // Santa Monica - End
    ];

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

    // Create yellow center line overlay
    const centerLinePolyline = new google.maps.Polyline({
      path: route66Path,
      geodesic: true,
      strokeColor: '#FFD700', // Yellow center line
      strokeOpacity: 0.8,
      strokeWeight: 2,
      zIndex: 1001,
      clickable: false,
      icons: [{
        icon: {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          strokeColor: '#FFD700',
          strokeWeight: 2,
          scale: 1
        },
        offset: '0%',
        repeat: '30px'
      }]
    });

    // Create weathered road edges
    const roadEdgePolyline1 = new google.maps.Polyline({
      path: route66Path,
      geodesic: true,
      strokeColor: '#1A1A1A',
      strokeOpacity: 0.4,
      strokeWeight: 10,
      zIndex: 999,
      clickable: false
    });

    const roadEdgePolyline2 = new google.maps.Polyline({
      path: route66Path,
      geodesic: true,
      strokeColor: '#404040',
      strokeOpacity: 0.3,
      strokeWeight: 12,
      zIndex: 998,
      clickable: false
    });

    // Set all polylines on the map
    roadEdgePolyline2.setMap(map);
    roadEdgePolyline1.setMap(map);
    route66Polyline.setMap(map);
    centerLinePolyline.setMap(map);
    
    polylineRef.current = route66Polyline;

    console.log("✅ Realistic textured Route 66 polyline created with", route66Path.length, "waypoints");

    // Wait a moment before fitting bounds to ensure polyline is rendered
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

      console.log("🎯 Map bounds fitted to textured Route 66");
    }, 500);

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up textured Route 66 polylines");
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      centerLinePolyline.setMap(null);
      roadEdgePolyline1.setMap(null);
      roadEdgePolyline2.setMap(null);
    };
  }, [map]);

  return null;
};

export default Route66StaticPolyline;
