
import { useEffect, useState } from 'react';

interface RouteApiServiceProps {
  map: google.maps.Map;
  onRouteReady: (success: boolean, fallbackUsed: boolean) => void;
}

interface ApiCapabilities {
  directionsAvailable: boolean;
  geocodingAvailable: boolean;
  tested: boolean;
}

const RouteApiService = ({ map, onRouteReady }: RouteApiServiceProps) => {
  const [apiCapabilities, setApiCapabilities] = useState<ApiCapabilities>({
    directionsAvailable: false,
    geocodingAvailable: false,
    tested: false
  });

  useEffect(() => {
    if (!map || typeof google === 'undefined') return;

    const testApiCapabilities = async () => {
      console.log("🔍 Testing Google Maps API capabilities...");
      
      let directionsAvailable = false;
      let geocodingAvailable = false;

      // Test Directions API
      try {
        const directionsService = new google.maps.DirectionsService();
        const testRequest: google.maps.DirectionsRequest = {
          origin: new google.maps.LatLng(41.8781, -87.6298), // Chicago
          destination: new google.maps.LatLng(41.5250, -88.0817), // Joliet
          travelMode: google.maps.TravelMode.DRIVING
        };

        await new Promise<void>((resolve, reject) => {
          directionsService.route(testRequest, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              console.log("✅ Directions API is available and working");
              directionsAvailable = true;
            } else {
              console.log(`❌ Directions API test failed: ${status}`);
              if (status === google.maps.DirectionsStatus.REQUEST_DENIED) {
                console.log("🔑 API key doesn't have Directions API enabled");
              } else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
                console.log("📊 API quota exceeded");
              }
            }
            resolve();
          });
        });
      } catch (error) {
        console.error("❌ Directions API test error:", error);
      }

      // Test Geocoding API (optional, for enhanced fallback)
      try {
        const geocoder = new google.maps.Geocoder();
        await new Promise<void>((resolve, reject) => {
          geocoder.geocode({ address: "Chicago, IL" }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              console.log("✅ Geocoding API is available");
              geocodingAvailable = true;
            } else {
              console.log(`❌ Geocoding API test failed: ${status}`);
            }
            resolve();
          });
        });
      } catch (error) {
        console.error("❌ Geocoding API test error:", error);
      }

      setApiCapabilities({
        directionsAvailable,
        geocodingAvailable,
        tested: true
      });

      // Notify parent component
      onRouteReady(directionsAvailable, !directionsAvailable);
    };

    testApiCapabilities();
  }, [map, onRouteReady]);

  // Render route based on API capabilities
  useEffect(() => {
    if (!apiCapabilities.tested || !map) return;

    if (apiCapabilities.directionsAvailable) {
      console.log("🚗 Using Google Directions API for Route 66");
      // The comprehensive route service will handle this
    } else {
      console.log("🗺️ Using static polyline fallback for Route 66");
      createStaticRoute66Polyline(map);
    }
  }, [apiCapabilities, map]);

  return null;
};

// Create a static polyline that follows known highway paths
const createStaticRoute66Polyline = (map: google.maps.Map) => {
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

  // Create the main Route 66 polyline
  const route66Polyline = new google.maps.Polyline({
    path: route66HighwayPath,
    geodesic: true,
    strokeColor: '#DC2626',
    strokeOpacity: 1.0,
    strokeWeight: 6,
    zIndex: 100
  });

  route66Polyline.setMap(map);

  // Add highway markers for context
  const highwayMarkers = [
    { position: route66HighwayPath[5], text: "I-55", state: "Illinois" },
    { position: route66HighwayPath[8], text: "I-44", state: "Missouri" },
    { position: route66HighwayPath[11], text: "I-40", state: "Oklahoma" },
    { position: route66HighwayPath[13], text: "I-40", state: "New Mexico" },
    { position: route66HighwayPath[16], text: "I-40", state: "Arizona" },
    { position: route66HighwayPath[20], text: "Local", state: "California" }
  ];

  highwayMarkers.forEach(marker => {
    new google.maps.Marker({
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
      zIndex: 200
    });
  });

  console.log("✅ Static Route 66 polyline created following highway paths");
};

export default RouteApiService;
