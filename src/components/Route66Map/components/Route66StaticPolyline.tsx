
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

    console.log("🗺️ Creating detailed Route 66 static polyline...");

    // Much more detailed waypoints that closely follow the actual Route 66 path
    const detailedRoute66Path = [
      // Illinois - Starting from Chicago, following US-66/I-55
      { lat: 41.8781, lng: -87.6298 }, // Chicago - Grant Park (Start)
      { lat: 41.8500, lng: -87.6500 }, // Chicago - Adams St
      { lat: 41.7900, lng: -87.7000 }, // Cicero
      { lat: 41.7500, lng: -87.7500 }, // Berwyn
      { lat: 41.7000, lng: -87.8000 }, // LaGrange
      { lat: 41.6000, lng: -87.9000 }, // Hinsdale area
      { lat: 41.5250, lng: -88.0817 }, // Joliet
      { lat: 41.4500, lng: -88.2000 }, // Elwood
      { lat: 41.3500, lng: -88.4000 }, // Wilmington
      { lat: 41.2500, lng: -88.6000 }, // Braidwood
      { lat: 41.1306, lng: -88.8290 }, // Pontiac
      { lat: 41.0000, lng: -89.0000 }, // Odell
      { lat: 40.9000, lng: -89.1500 }, // Cayuga
      { lat: 40.7500, lng: -89.2000 }, // Normal/Bloomington
      { lat: 40.6000, lng: -89.3000 }, // McLean
      { lat: 40.5000, lng: -89.4000 }, // Atlanta
      { lat: 40.3000, lng: -89.5000 }, // Lincoln
      { lat: 39.8003, lng: -89.6437 }, // Springfield, IL
      { lat: 39.6000, lng: -89.7500 }, // Auburn
      { lat: 39.4500, lng: -89.8500 }, // Litchfield
      { lat: 39.3000, lng: -89.9000 }, // Mount Olive
      { lat: 39.1500, lng: -89.9500 }, // Staunton
      { lat: 39.0000, lng: -90.0000 }, // Edwardsville area
      
      // Missouri - Following I-44 corridor
      { lat: 38.7067, lng: -90.3990 }, // St. Louis
      { lat: 38.6500, lng: -90.5000 }, // Kirkwood
      { lat: 38.5500, lng: -90.7500 }, // Eureka
      { lat: 38.4500, lng: -91.0000 }, // Pacific
      { lat: 38.4000, lng: -91.2000 }, // Sullivan
      { lat: 38.3500, lng: -91.5000 }, // Bourbon
      { lat: 38.3000, lng: -91.7000 }, // Cuba
      { lat: 38.2500, lng: -91.8000 }, // Rolla
      { lat: 38.2000, lng: -92.0000 }, // St. James
      { lat: 38.1000, lng: -92.1000 }, // Doolittle
      { lat: 38.0000, lng: -92.2500 }, // Arlington
      { lat: 37.9500, lng: -92.3500 }, // Lebanon
      { lat: 37.8500, lng: -92.5000 }, // Conway
      { lat: 37.7000, lng: -92.8000 }, // Marshfield
      { lat: 37.5500, lng: -93.0000 }, // Strafford
      { lat: 37.2090, lng: -93.2923 }, // Springfield, MO
      { lat: 37.1800, lng: -93.5000 }, // Halltown
      { lat: 37.1500, lng: -93.8000 }, // Carthage
      { lat: 37.1000, lng: -94.2000 }, // Webb City
      { lat: 37.0842, lng: -94.5133 }, // Joplin
      
      // Oklahoma - Following I-44 then I-40
      { lat: 36.9500, lng: -94.6500 }, // Quapaw
      { lat: 36.9000, lng: -94.8000 }, // Miami, OK
      { lat: 36.8000, lng: -95.0000 }, // Afton
      { lat: 36.7000, lng: -95.2000 }, // Vinita
      { lat: 36.6000, lng: -95.4000 }, // Chelsea
      { lat: 36.4000, lng: -95.7000 }, // Claremore
      { lat: 36.1540, lng: -95.9928 }, // Tulsa
      { lat: 36.1000, lng: -96.1000 }, // Catoosa
      { lat: 35.9500, lng: -96.3000 }, // Sapulpa
      { lat: 35.8000, lng: -96.5000 }, // Kellyville
      { lat: 35.7000, lng: -96.7000 }, // Bristow
      { lat: 35.6500, lng: -96.9000 }, // Stroud
      { lat: 35.6000, lng: -97.1000 }, // Davenport
      { lat: 35.5500, lng: -97.3000 }, // Chandler
      { lat: 35.4676, lng: -97.5164 }, // Oklahoma City
      { lat: 35.4000, lng: -98.0000 }, // El Reno
      { lat: 35.3500, lng: -98.5000 }, // Weatherford
      { lat: 35.3000, lng: -98.7000 }, // Clinton
      { lat: 35.5089, lng: -98.9680 }, // Elk City
      { lat: 35.4000, lng: -99.5000 }, // Sayre
      { lat: 35.3000, lng: -100.0000 }, // Erick
      
      // Texas - Following I-40
      { lat: 35.3000, lng: -100.2000 }, // Shamrock, TX
      { lat: 35.2500, lng: -100.5000 }, // McLean
      { lat: 35.2000, lng: -101.0000 }, // Groom
      { lat: 35.2220, lng: -101.8313 }, // Amarillo
      { lat: 35.2000, lng: -102.2000 }, // Vega
      { lat: 35.1800, lng: -102.7000 }, // Adrian
      
      // New Mexico - Following I-40
      { lat: 35.1245, lng: -103.7207 }, // Tucumcari, NM
      { lat: 35.1200, lng: -104.0000 }, // Montoya
      { lat: 35.1000, lng: -104.5000 }, // Santa Rosa
      { lat: 35.0900, lng: -105.0000 }, // Romeroville
      { lat: 35.0850, lng: -105.5000 }, // Las Vegas, NM
      { lat: 35.0844, lng: -106.6504 }, // Albuquerque
      { lat: 35.0830, lng: -107.0000 }, // Laguna Pueblo
      { lat: 35.0820, lng: -107.5000 }, // Grants
      { lat: 35.0820, lng: -108.7426 }, // Gallup
      
      // Arizona - Following I-40 then Historic US-66
      { lat: 35.0819, lng: -109.0000 }, // Lupton
      { lat: 35.0819, lng: -110.0298 }, // Holbrook
      { lat: 35.1200, lng: -110.5000 }, // Joseph City
      { lat: 35.1500, lng: -111.0000 }, // Winslow
      { lat: 35.1800, lng: -111.3000 }, // Winona
      { lat: 35.1983, lng: -111.6513 }, // Flagstaff
      { lat: 35.2100, lng: -112.0000 }, // Williams
      { lat: 35.2262, lng: -112.8871 }, // Seligman
      { lat: 35.1500, lng: -113.5000 }, // Peach Springs
      { lat: 35.0800, lng: -114.0000 }, // Truxton
      { lat: 35.0222, lng: -114.3716 }, // Kingman
      { lat: 34.9500, lng: -114.5000 }, // Oatman area
      
      // California - Following I-40, then I-15, then local roads
      { lat: 34.8409, lng: -114.6160 }, // Needles, CA
      { lat: 34.8600, lng: -115.5000 }, // Ludlow
      { lat: 34.8800, lng: -116.5000 }, // Newberry Springs
      { lat: 34.8987, lng: -117.0178 }, // Barstow
      { lat: 34.3000, lng: -117.3000 }, // Victorville
      { lat: 34.1066, lng: -117.5931 }, // San Bernardino
      { lat: 34.1000, lng: -117.8000 }, // Rancho Cucamonga
      { lat: 34.0900, lng: -118.0000 }, // Azusa
      { lat: 34.0825, lng: -118.0732 }, // Pasadena
      { lat: 34.0700, lng: -118.1500 }, // Los Angeles - Downtown
      { lat: 34.0522, lng: -118.2437 }, // Los Angeles - Hollywood
      { lat: 34.0400, lng: -118.3000 }, // Beverly Hills
      { lat: 34.0300, lng: -118.4000 }, // West LA
      { lat: 34.0195, lng: -118.4912 }, // Santa Monica (End)
    ];

    // Create the main Route 66 polyline with enhanced visibility
    const route66Polyline = new google.maps.Polyline({
      path: detailedRoute66Path,
      geodesic: false, // Use straight lines between points for more predictable rendering
      strokeColor: '#DC2626', // Deep red color
      strokeOpacity: 1.0,
      strokeWeight: 5,
      zIndex: 1000
    });

    // Set the polyline on the map
    route66Polyline.setMap(map);
    polylineRef.current = route66Polyline;

    console.log("✅ Detailed Route 66 polyline created with", detailedRoute66Path.length, "waypoints");

    // Create a bounds object to show the entire route
    const bounds = new google.maps.LatLngBounds();
    detailedRoute66Path.forEach(point => {
      bounds.extend(new google.maps.LatLng(point.lat, point.lng));
    });

    // Fit the map to show the entire route
    map.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    });

    // Add start and end markers
    const startMarker = new google.maps.Marker({
      position: detailedRoute66Path[0],
      map: map,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="12" fill="#22C55E" stroke="#fff" stroke-width="2"/>
            <text x="15" y="19" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">S</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15)
      },
      title: "Route 66 Start - Chicago, IL",
      zIndex: 2000
    });

    const endMarker = new google.maps.Marker({
      position: detailedRoute66Path[detailedRoute66Path.length - 1],
      map: map,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="12" fill="#EF4444" stroke="#fff" stroke-width="2"/>
            <text x="15" y="19" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">E</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15)
      },
      title: "Route 66 End - Santa Monica, CA",
      zIndex: 2000
    });

    markersRef.current = [startMarker, endMarker];

    console.log("✅ Route 66 start and end markers added");
    console.log("🎯 Map fitted to show entire route");

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up detailed Route 66 polyline and markers");
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
