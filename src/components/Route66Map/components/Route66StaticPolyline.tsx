
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

    console.log("🗺️ Creating Route 66 static polyline...");

    // Detailed waypoints that follow actual highways
    const route66HighwayPath = [
      // Illinois - I-55 corridor
      { lat: 41.8781, lng: -87.6298 }, // Chicago
      { lat: 41.7500, lng: -87.7500 }, // Cicero
      { lat: 41.5250, lng: -88.0817 }, // Joliet
      { lat: 41.1306, lng: -88.8290 }, // Pontiac
      { lat: 40.1164, lng: -89.4089 }, // McLean
      { lat: 39.8003, lng: -89.6437 }, // Springfield, IL
      
      // Missouri - I-44 corridor
      { lat: 38.7067, lng: -90.3990 }, // St. Louis
      { lat: 38.2500, lng: -91.8000 }, // Rolla
      { lat: 37.2090, lng: -93.2923 }, // Springfield, MO
      { lat: 37.0842, lng: -94.5133 }, // Joplin
      
      // Oklahoma - I-44 then I-40
      { lat: 36.1540, lng: -95.9928 }, // Tulsa
      { lat: 35.4676, lng: -97.5164 }, // Oklahoma City
      { lat: 35.5089, lng: -98.9680 }, // Elk City
      
      // Texas - I-40
      { lat: 35.2220, lng: -101.8313 }, // Amarillo
      
      // New Mexico - I-40
      { lat: 35.1245, lng: -103.7207 }, // Tucumcari
      { lat: 35.0844, lng: -106.6504 }, // Albuquerque
      { lat: 35.0820, lng: -108.7426 }, // Gallup
      
      // Arizona - I-40 then Historic US-66
      { lat: 35.0819, lng: -110.0298 }, // Holbrook
      { lat: 35.1983, lng: -111.6513 }, // Flagstaff
      { lat: 35.2262, lng: -112.8871 }, // Seligman
      { lat: 35.0222, lng: -114.3716 }, // Kingman
      
      // California - I-40, I-15, local roads
      { lat: 34.8409, lng: -114.6160 }, // Needles
      { lat: 34.8987, lng: -117.0178 }, // Barstow
      { lat: 34.1066, lng: -117.5931 }, // San Bernardino
      { lat: 34.0522, lng: -118.2437 }, // Los Angeles
      { lat: 34.0195, lng: -118.4912 }, // Santa Monica
    ];

    // Create the main Route 66 polyline with very visible styling
    const route66Polyline = new google.maps.Polyline({
      path: route66HighwayPath,
      geodesic: true,
      strokeColor: '#FF0000', // Bright red
      strokeOpacity: 0.9,
      strokeWeight: 8, // Thicker line
      zIndex: 1000 // Higher z-index to ensure visibility
    });

    // Set the polyline on the map
    route66Polyline.setMap(map);
    polylineRef.current = route66Polyline;

    console.log("✅ Route 66 polyline created with path:", route66HighwayPath.length, "points");
    console.log("🎨 Polyline styling:", {
      strokeColor: '#FF0000',
      strokeOpacity: 0.9,
      strokeWeight: 8,
      zIndex: 1000
    });

    // Create a bounds object to ensure the polyline is visible
    const bounds = new google.maps.LatLngBounds();
    route66HighwayPath.forEach(point => {
      bounds.extend(new google.maps.LatLng(point.lat, point.lng));
    });

    // Fit the map to show the entire route
    map.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    });

    console.log("📍 Map bounds set to show entire Route 66");

    // Add highway markers for context
    const highwayMarkers = [
      { position: route66HighwayPath[5], text: "I-55", state: "Illinois" },
      { position: route66HighwayPath[8], text: "I-44", state: "Missouri" },
      { position: route66HighwayPath[11], text: "I-40", state: "Oklahoma" },
      { position: route66HighwayPath[13], text: "I-40", state: "New Mexico" },
      { position: route66HighwayPath[16], text: "I-40", state: "Arizona" },
      { position: route66HighwayPath[20], text: "Local", state: "California" }
    ];

    const markers: google.maps.Marker[] = [];

    highwayMarkers.forEach(marker => {
      const googleMarker = new google.maps.Marker({
        position: marker.position,
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="20" viewBox="0 0 60 20">
              <rect width="60" height="20" rx="10" fill="#1976D2" stroke="#fff" stroke-width="1"/>
              <text x="30" y="14" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">${marker.text}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(60, 20),
          anchor: new google.maps.Point(30, 10)
        },
        title: `${marker.text} - ${marker.state}`,
        zIndex: 2000
      });
      
      markers.push(googleMarker);
    });

    markersRef.current = markers;

    console.log(`✅ Created ${markers.length} highway markers`);

    // Log map center and zoom for debugging
    console.log("🎯 Map center:", map.getCenter()?.toString());
    console.log("🔍 Map zoom:", map.getZoom());

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
