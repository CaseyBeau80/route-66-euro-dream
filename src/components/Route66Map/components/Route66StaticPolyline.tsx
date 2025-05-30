
import React, { useEffect, useRef } from 'react';

interface Route66StaticPolylineProps {
  map: google.maps.Map;
}

const Route66StaticPolyline: React.FC<Route66StaticPolylineProps> = ({ map }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!map) {
      console.log("❌ No map provided to Route66StaticPolyline");
      return;
    }

    console.log("🗺️ Creating Route 66 polyline with proper geodesic routing...");

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

    // Create the Route 66 polyline with proper settings
    const route66Polyline = new google.maps.Polyline({
      path: route66Path,
      geodesic: true, // Use geodesic lines for proper curved routing
      strokeColor: '#FF0000', // Bright red
      strokeOpacity: 0.9,
      strokeWeight: 6,
      zIndex: 1000,
      clickable: false
    });

    // Set the polyline on the map
    route66Polyline.setMap(map);
    polylineRef.current = route66Polyline;

    console.log("✅ Route 66 polyline created with", route66Path.length, "waypoints");

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

      console.log("🎯 Map bounds fitted to Route 66");
    }, 500);

    // Add start and end markers
    const startMarker = new google.maps.Marker({
      position: route66Path[0],
      map: map,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#22C55E" stroke="#fff" stroke-width="3"/>
            <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">START</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      },
      title: "Route 66 Start - Chicago, IL",
      zIndex: 2000
    });

    const endMarker = new google.maps.Marker({
      position: route66Path[route66Path.length - 1],
      map: map,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="#fff" stroke-width="3"/>
            <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">END</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      },
      title: "Route 66 End - Santa Monica, CA",
      zIndex: 2000
    });

    markersRef.current = [startMarker, endMarker];

    console.log("✅ Route 66 start and end markers added");

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up Route 66 polyline and markers");
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map]);

  return null;
};

export default Route66StaticPolyline;
