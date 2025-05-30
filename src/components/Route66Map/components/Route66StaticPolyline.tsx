
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

    console.log("🗺️ Creating enhanced Route 66 polyline with detailed highway routing...");

    // Much more detailed Route 66 path following actual highways and roads
    const enhancedRoute66Path = [
      // Illinois - Following historic US-66, now I-55 corridor
      { lat: 41.8781, lng: -87.6298 }, // Chicago - Grant Park (Start)
      { lat: 41.7500, lng: -87.7500 }, // Cicero
      { lat: 41.6000, lng: -87.9000 }, // Berwyn/Riverside
      { lat: 41.5250, lng: -88.0817 }, // Joliet
      { lat: 41.4000, lng: -88.3000 }, // Elwood
      { lat: 41.3000, lng: -88.5000 }, // Wilmington  
      { lat: 41.1306, lng: -88.8290 }, // Pontiac
      { lat: 40.9000, lng: -89.1000 }, // Lexington
      { lat: 40.7500, lng: -89.2000 }, // Normal/Bloomington
      { lat: 40.5000, lng: -89.4000 }, // Atlanta
      { lat: 40.1164, lng: -89.4089 }, // McLean
      { lat: 39.8003, lng: -89.6437 }, // Springfield, IL
      { lat: 39.6000, lng: -89.7500 }, // Rochester
      { lat: 39.4500, lng: -89.8500 }, // Litchfield
      { lat: 39.2000, lng: -90.0000 }, // Mt. Olive
      
      // Missouri - Following I-44 (historic US-66 superslab)
      { lat: 38.9000, lng: -90.2000 }, // Hazelwood
      { lat: 38.7067, lng: -90.3990 }, // St. Louis
      { lat: 38.6000, lng: -90.6000 }, // Kirkwood
      { lat: 38.5500, lng: -90.7500 }, // Eureka
      { lat: 38.4500, lng: -91.0000 }, // Pacific
      { lat: 38.4000, lng: -91.2000 }, // Sullivan
      { lat: 38.3500, lng: -91.5000 }, // Bourbon
      { lat: 38.2500, lng: -91.8000 }, // Rolla
      { lat: 38.1000, lng: -92.1000 }, // Doolittle
      { lat: 37.9500, lng: -92.3500 }, // Lebanon
      { lat: 37.8000, lng: -92.6000 }, // Conway
      { lat: 37.7000, lng: -92.8000 }, // Marshfield
      { lat: 37.5000, lng: -93.0000 }, // Strafford
      { lat: 37.2090, lng: -93.2923 }, // Springfield, MO
      { lat: 37.1500, lng: -93.8000 }, // Carthage
      { lat: 37.1000, lng: -94.2000 }, // Webb City
      { lat: 37.0842, lng: -94.5133 }, // Joplin
      
      // Oklahoma - Following I-44 then I-40 (Will Rogers Highway)
      { lat: 36.9000, lng: -94.8000 }, // Miami, OK
      { lat: 36.8000, lng: -95.0000 }, // Commerce
      { lat: 36.7000, lng: -95.2000 }, // Vinita
      { lat: 36.5000, lng: -95.6000 }, // Chelsea
      { lat: 36.3000, lng: -95.8000 }, // Claremore
      { lat: 36.1540, lng: -95.9928 }, // Tulsa
      { lat: 35.9500, lng: -96.3000 }, // Kellyville
      { lat: 35.9000, lng: -96.4000 }, // Sapulpa
      { lat: 35.7500, lng: -96.7000 }, // Bristow
      { lat: 35.6500, lng: -96.9000 }, // Stroud
      { lat: 35.5500, lng: -97.2000 }, // Chandler
      { lat: 35.4676, lng: -97.5164 }, // Oklahoma City
      { lat: 35.4000, lng: -98.0000 }, // El Reno
      { lat: 35.3800, lng: -98.3000 }, // Hinton
      { lat: 35.3500, lng: -98.5000 }, // Weatherford
      { lat: 35.4000, lng: -98.7000 }, // Clinton
      { lat: 35.5089, lng: -98.9680 }, // Elk City
      { lat: 35.4500, lng: -99.3000 }, // Sayre
      { lat: 35.3800, lng: -99.6000 }, // Erick
      
      // Texas - Following I-40 
      { lat: 35.3000, lng: -100.0000 }, // Shamrock, TX
      { lat: 35.2500, lng: -100.5000 }, // McLean
      { lat: 35.2200, lng: -101.0000 }, // Groom
      { lat: 35.2220, lng: -101.8313 }, // Amarillo
      { lat: 35.2000, lng: -102.2000 }, // Bushland
      { lat: 35.1800, lng: -102.6000 }, // Wildorado
      { lat: 35.1600, lng: -103.0000 }, // Vega
      { lat: 35.1400, lng: -103.4000 }, // Adrian
      
      // New Mexico - Following I-40
      { lat: 35.1300, lng: -103.5000 }, // Glenrio
      { lat: 35.1245, lng: -103.7207 }, // Tucumcari
      { lat: 35.1200, lng: -104.0000 }, // Montoya
      { lat: 35.1100, lng: -104.3000 }, // Newkirk
      { lat: 35.1000, lng: -104.5000 }, // Santa Rosa
      { lat: 35.0900, lng: -105.0000 }, // Romeroville
      { lat: 35.0850, lng: -105.5000 }, // Las Vegas, NM
      { lat: 35.0800, lng: -106.0000 }, // Pecos
      { lat: 35.0844, lng: -106.6504 }, // Albuquerque
      { lat: 35.0830, lng: -107.0000 }, // Correo
      { lat: 35.0820, lng: -107.5000 }, // Grants
      { lat: 35.0820, lng: -108.0000 }, // Milan
      { lat: 35.0820, lng: -108.7426 }, // Gallup
      
      // Arizona - Following I-40 and Historic US-66
      { lat: 35.0819, lng: -109.2000 }, // Lupton
      { lat: 35.0819, lng: -110.0298 }, // Holbrook
      { lat: 35.1200, lng: -110.5000 }, // Joseph City
      { lat: 35.1500, lng: -111.0000 }, // Winslow
      { lat: 35.1700, lng: -111.3000 }, // Winona
      { lat: 35.1983, lng: -111.6513 }, // Flagstaff
      { lat: 35.2100, lng: -112.0000 }, // Bellemont
      { lat: 35.2200, lng: -112.4000 }, // Williams
      { lat: 35.2262, lng: -112.8871 }, // Seligman (Historic Route begins)
      { lat: 35.1500, lng: -113.2000 }, // Peach Springs
      { lat: 35.1000, lng: -113.6000 }, // Truxton
      { lat: 35.0500, lng: -114.0000 }, // Valentine
      { lat: 35.0222, lng: -114.3716 }, // Kingman
      { lat: 34.9500, lng: -114.5000 }, // Yucca
      { lat: 34.9000, lng: -114.6000 }, // Topock
      
      // California - Following I-40, then I-15, then historic roads
      { lat: 34.8409, lng: -114.6160 }, // Needles, CA
      { lat: 34.8600, lng: -115.5000 }, // Essex
      { lat: 34.8800, lng: -116.0000 }, // Amboy
      { lat: 34.8900, lng: -116.5000 }, // Bagdad
      { lat: 34.8987, lng: -117.0178 }, // Barstow
      { lat: 34.7000, lng: -117.2000 }, // Lenwood
      { lat: 34.5000, lng: -117.4000 }, // Victorville
      { lat: 34.3000, lng: -117.5000 }, // Cajon Pass
      { lat: 34.1066, lng: -117.5931 }, // San Bernardino
      { lat: 34.0900, lng: -117.7000 }, // Rialto
      { lat: 34.0825, lng: -118.0732 }, // Pasadena
      { lat: 34.0700, lng: -118.1500 }, // Glendale
      { lat: 34.0522, lng: -118.2437 }, // Los Angeles
      { lat: 34.0400, lng: -118.3000 }, // Beverly Hills
      { lat: 34.0300, lng: -118.4000 }, // West Hollywood
      { lat: 34.0195, lng: -118.4912 }, // Santa Monica (End)
    ];

    // Create the enhanced Route 66 polyline
    const route66Polyline = new google.maps.Polyline({
      path: enhancedRoute66Path,
      geodesic: true, // Use geodesic lines for proper curved routing
      strokeColor: '#DC2626', // Route 66 red
      strokeOpacity: 0.9,
      strokeWeight: 6,
      zIndex: 1000,
      clickable: false
    });

    // Set the polyline on the map
    route66Polyline.setMap(map);
    polylineRef.current = route66Polyline;

    console.log("✅ Enhanced Route 66 polyline created with", enhancedRoute66Path.length, "detailed waypoints");

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up enhanced Route 66 polyline");
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map]);

  return null;
};

export default Route66StaticPolyline;
