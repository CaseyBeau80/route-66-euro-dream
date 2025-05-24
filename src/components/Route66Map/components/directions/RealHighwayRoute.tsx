
import { useEffect, useState } from 'react';

interface RealHighwayRouteProps {
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  onRouteCalculated?: (success: boolean) => void;
}

// Real Route 66 waypoints that force highway following
const realRoute66Waypoints = [
  // Illinois - Force I-55 routing
  { lat: 41.8781, lng: -87.6298, description: "Chicago, IL - Route 66 Start" },
  { lat: 41.5250, lng: -88.0817, description: "Joliet, IL" },
  { lat: 41.1306, lng: -88.8290, description: "Pontiac, IL" },
  { lat: 40.1164, lng: -89.4089, description: "Lincoln, IL" },
  { lat: 39.8003, lng: -89.6437, description: "Springfield, IL" },
  
  // Missouri - Force I-44 routing
  { lat: 38.7067, lng: -90.3990, description: "St. Louis, MO" },
  { lat: 38.2500, lng: -91.8000, description: "Rolla, MO" },
  { lat: 37.2090, lng: -93.2923, description: "Springfield, MO" },
  { lat: 37.0842, lng: -94.5133, description: "Joplin, MO" },
  
  // Oklahoma - I-44 then I-40
  { lat: 36.1540, lng: -95.9928, description: "Tulsa, OK" },
  { lat: 35.4676, lng: -97.5164, description: "Oklahoma City, OK" },
  { lat: 35.5089, lng: -98.9680, description: "Elk City, OK" },
  
  // Texas - I-40
  { lat: 35.2220, lng: -101.8313, description: "Amarillo, TX" },
  
  // New Mexico - I-40
  { lat: 35.1245, lng: -103.7207, description: "Tucumcari, NM" },
  { lat: 35.0844, lng: -106.6504, description: "Albuquerque, NM" },
  { lat: 35.0820, lng: -108.7426, description: "Gallup, NM" },
  
  // Arizona - I-40
  { lat: 35.0819, lng: -110.0298, description: "Holbrook, AZ" },
  { lat: 35.1983, lng: -111.6513, description: "Flagstaff, AZ" },
  { lat: 35.0222, lng: -114.3716, description: "Kingman, AZ" },
  
  // California - I-40 to I-15 to local roads
  { lat: 34.8409, lng: -114.6160, description: "Needles, CA" },
  { lat: 34.8987, lng: -117.0178, description: "Barstow, CA" },
  { lat: 34.1066, lng: -117.5931, description: "San Bernardino, CA" },
  { lat: 34.0195, lng: -118.4912, description: "Santa Monica, CA - Route 66 End" }
];

const RealHighwayRoute = ({ 
  map, 
  directionsService,
  onRouteCalculated 
}: RealHighwayRouteProps) => {
  const [renderers, setRenderers] = useState<google.maps.DirectionsRenderer[]>([]);

  useEffect(() => {
    if (!map || !directionsService || typeof google === 'undefined') return;

    // Clear existing renderers
    renderers.forEach(renderer => renderer.setMap(null));
    setRenderers([]);

    // Create segments with very specific waypoint limits to force road following
    const segments = [
      { start: 0, end: 4, description: "Chicago to Springfield, IL via I-55" },
      { start: 4, end: 8, description: "Springfield, IL to Joplin, MO via I-44" },
      { start: 8, end: 11, description: "Joplin, MO to Elk City, OK via I-44/I-40" },
      { start: 11, end: 13, description: "Elk City, OK to Tucumcari, NM via I-40" },
      { start: 13, end: 16, description: "Tucumcari to Gallup, NM via I-40" },
      { start: 16, end: 19, description: "Gallup, NM to Kingman, AZ via I-40" },
      { start: 19, end: 23, description: "Kingman, AZ to Santa Monica, CA via I-40/I-15" }
    ];

    const newRenderers: google.maps.DirectionsRenderer[] = [];
    let successfulSegments = 0;
    let completedSegments = 0;

    console.log(`Calculating ${segments.length} highway segments for real road following`);

    segments.forEach((segment, index) => {
      const renderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: '#DC2626',
          strokeOpacity: 1.0,
          strokeWeight: 6,
          zIndex: 10
        }
      });
      
      renderer.setMap(map);
      newRenderers.push(renderer);

      const segmentWaypoints = realRoute66Waypoints.slice(segment.start, segment.end + 1);
      
      if (segmentWaypoints.length < 2) {
        completedSegments++;
        return;
      }

      const origin = segmentWaypoints[0];
      const destination = segmentWaypoints[segmentWaypoints.length - 1];
      
      // Use ALL intermediate waypoints to force exact highway following
      const waypoints = segmentWaypoints.slice(1, -1).map(point => ({
        location: new google.maps.LatLng(point.lat, point.lng),
        stopover: false
      }));

      // Very specific request to force highway usage
      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
        avoidHighways: false, // MUST use highways
        avoidTolls: false,
        avoidFerries: true,
        provideRouteAlternatives: false,
        region: 'US',
        // Force highway preference
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.OPTIMISTIC
        }
      };

      console.log(`Calculating ${segment.description} with ${waypoints.length} waypoints`);

      directionsService.route(request, (result, status) => {
        completedSegments++;
        
        if (status === google.maps.DirectionsStatus.OK && result) {
          console.log(`✓ ${segment.description} - SUCCESS`);
          renderer.setDirections(result);
          successfulSegments++;
        } else {
          console.warn(`⚠ ${segment.description} - FAILED (${status})`);
          
          // Create emergency fallback using straight polyline
          const path = segmentWaypoints.map(point => 
            new google.maps.LatLng(point.lat, point.lng)
          );
          
          new google.maps.Polyline({
            path: path,
            geodesic: false, // Don't curve, follow exact points
            strokeColor: '#DC2626',
            strokeOpacity: 0.7,
            strokeWeight: 4,
            map: map,
            zIndex: 5
          });
        }

        if (completedSegments === segments.length) {
          const successRate = successfulSegments / segments.length;
          console.log(`Highway route complete: ${successfulSegments}/${segments.length} segments (${Math.round(successRate * 100)}%)`);
          if (onRouteCalculated) {
            onRouteCalculated(successRate > 0.4);
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

export default RealHighwayRoute;
