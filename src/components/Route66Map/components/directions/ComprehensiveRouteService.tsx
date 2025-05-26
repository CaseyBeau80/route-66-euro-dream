
import { useEffect, useState } from 'react';

interface RouteSegment {
  start: number;
  end: number;
  highway: string;
  description: string;
  waypoints: Array<{lat: number, lng: number, description: string}>;
}

interface ComprehensiveRouteServiceProps {
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  onRouteCalculated?: (success: boolean) => void;
}

// Comprehensive Route 66 waypoints with highway information
const route66HighwayWaypoints = [
  // Illinois - I-55 corridor (historic US-66)
  {lat: 41.8781, lng: -87.6298, description: "Chicago, IL - Route 66 Start"},
  {lat: 41.5250, lng: -88.0817, description: "Joliet, IL"},
  {lat: 41.1306, lng: -88.8290, description: "Pontiac, IL"},
  {lat: 40.1164, lng: -89.4089, description: "McLean, IL"},
  {lat: 39.8003, lng: -89.6437, description: "Springfield, IL"},
  
  // Missouri - I-44 corridor (historic US-66)
  {lat: 38.7067, lng: -90.3990, description: "St. Louis, MO"},
  {lat: 38.2500, lng: -91.8000, description: "Rolla, MO"},
  {lat: 37.2090, lng: -93.2923, description: "Springfield, MO"},
  {lat: 37.0842, lng: -94.5133, description: "Joplin, MO"},
  
  // Oklahoma - I-44 then I-40
  {lat: 36.1540, lng: -95.9928, description: "Tulsa, OK"},
  {lat: 35.4676, lng: -97.5164, description: "Oklahoma City, OK"},
  {lat: 35.5089, lng: -98.9680, description: "Elk City, OK"},
  
  // Texas - I-40
  {lat: 35.2220, lng: -101.8313, description: "Amarillo, TX"},
  
  // New Mexico - I-40
  {lat: 35.1245, lng: -103.7207, description: "Tucumcari, NM"},
  {lat: 35.0844, lng: -106.6504, description: "Albuquerque, NM"},
  {lat: 35.0820, lng: -108.7426, description: "Gallup, NM"},
  
  // Arizona - I-40 then Historic US-66
  {lat: 35.0819, lng: -110.0298, description: "Holbrook, AZ"},
  {lat: 35.1983, lng: -111.6513, description: "Flagstaff, AZ"},
  {lat: 35.2262, lng: -112.8871, description: "Seligman, AZ"},
  {lat: 35.0222, lng: -114.3716, description: "Kingman, AZ"},
  
  // California - I-40, I-15, then local roads
  {lat: 34.8409, lng: -114.6160, description: "Needles, CA"},
  {lat: 34.8987, lng: -117.0178, description: "Barstow, CA"},
  {lat: 34.1066, lng: -117.5931, description: "San Bernardino, CA"},
  {lat: 34.0522, lng: -118.2437, description: "Los Angeles, CA"},
  {lat: 34.0195, lng: -118.4912, description: "Santa Monica, CA - Route 66 End"},
];

// Define highway-specific segments
const getHighwaySegments = (): RouteSegment[] => {
  return [
    {
      start: 0, end: 4, highway: "I-55", description: "Illinois via I-55 (Historic US-66)",
      waypoints: route66HighwayWaypoints.slice(0, 5)
    },
    {
      start: 4, end: 8, highway: "I-44", description: "Missouri via I-44 (Historic US-66)",
      waypoints: route66HighwayWaypoints.slice(4, 9)
    },
    {
      start: 8, end: 11, highway: "I-44/I-40", description: "Oklahoma via I-44 and I-40",
      waypoints: route66HighwayWaypoints.slice(8, 12)
    },
    {
      start: 11, end: 12, highway: "I-40", description: "Texas via I-40",
      waypoints: route66HighwayWaypoints.slice(11, 13)
    },
    {
      start: 12, end: 15, highway: "I-40", description: "New Mexico via I-40",
      waypoints: route66HighwayWaypoints.slice(12, 16)
    },
    {
      start: 15, end: 19, highway: "I-40/Historic US-66", description: "Arizona via I-40 and Historic US-66",
      waypoints: route66HighwayWaypoints.slice(15, 20)
    },
    {
      start: 19, end: 23, highway: "I-40/I-15/Local", description: "California via I-40, I-15, and Local Roads",
      waypoints: route66HighwayWaypoints.slice(19, 24)
    }
  ];
};

const ComprehensiveRouteService = ({ 
  map, 
  directionsService,
  onRouteCalculated 
}: ComprehensiveRouteServiceProps) => {
  const [renderers, setRenderers] = useState<google.maps.DirectionsRenderer[]>([]);

  useEffect(() => {
    if (!map || !directionsService || typeof google === 'undefined') return;

    // Clear any existing renderers
    renderers.forEach(renderer => renderer.setMap(null));
    setRenderers([]);

    const segments = getHighwaySegments();
    const newRenderers: google.maps.DirectionsRenderer[] = [];
    let successfulSegments = 0;
    let completedSegments = 0;

    console.log(`🛣️ Calculating ${segments.length} highway-specific Route 66 segments`);

    segments.forEach((segment, index) => {
      // Create renderer for this segment with enhanced styling
      const renderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: '#DC2626',
          strokeOpacity: 1.0,
          strokeWeight: 6,
          zIndex: 100
        }
      });
      
      renderer.setMap(map);
      newRenderers.push(renderer);

      // Get segment waypoints
      const segmentWaypoints = segment.waypoints;
      
      if (segmentWaypoints.length < 2) {
        completedSegments++;
        return;
      }

      const origin = segmentWaypoints[0];
      const destination = segmentWaypoints[segmentWaypoints.length - 1];
      
      // Use intermediate waypoints strategically (max 8 per request)
      const intermediateWaypoints = segmentWaypoints.slice(1, -1);
      const waypoints = intermediateWaypoints.length <= 8 ? 
        intermediateWaypoints.map(point => ({
          location: new google.maps.LatLng(point.lat, point.lng),
          stopover: false
        })) : 
        // If too many waypoints, select key ones
        intermediateWaypoints.filter((_, idx) => idx % Math.ceil(intermediateWaypoints.length / 6) === 0)
          .map(point => ({
            location: new google.maps.LatLng(point.lat, point.lng),
            stopover: false
          }));

      // Enhanced routing request with highway preferences
      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false, // Maintain historic Route 66 order
        avoidHighways: false, // We WANT to use highways
        avoidTolls: false,
        provideRouteAlternatives: false,
        region: 'US'
      };

      console.log(`🚗 Calculating ${segment.description} (${segmentWaypoints.length} waypoints)`);

      // Calculate route with enhanced error handling
      directionsService.route(request, (result, status) => {
        completedSegments++;
        
        if (status === google.maps.DirectionsStatus.OK && result) {
          console.log(`✅ ${segment.description} calculated successfully via ${segment.highway}`);
          renderer.setDirections(result);
          successfulSegments++;
        } else {
          console.warn(`⚠️ ${segment.description} failed (${status}), creating fallback polyline`);
          
          // Create fallback polyline that connects the waypoints
          const fallbackPath = segmentWaypoints.map(point => 
            new google.maps.LatLng(point.lat, point.lng)
          );
          
          new google.maps.Polyline({
            path: fallbackPath,
            geodesic: true,
            strokeColor: '#DC2626',
            strokeOpacity: 0.7,
            strokeWeight: 4,
            map: map,
            zIndex: 50
          });
        }

        // Check if all segments are complete
        if (completedSegments === segments.length) {
          const successRate = successfulSegments / segments.length;
          console.log(`🏁 Route 66 calculation complete: ${successfulSegments}/${segments.length} segments successful (${Math.round(successRate * 100)}%)`);
          
          if (onRouteCalculated) {
            onRouteCalculated(successRate > 0.4); // Success if more than 40% worked
          }
        }
      });
    });

    setRenderers(newRenderers);

    return () => {
      newRenderers.forEach(renderer => renderer.setMap(null));
    };
  }, [map, directionsService, onRouteCalculated]);

  return null;
};

export default ComprehensiveRouteService;
