
import { useEffect, useState } from 'react';
import { historicRoute66Waypoints, getHistoricRoute66Segments } from '../HistoricRoute66Waypoints';

interface HistoricRouteServiceProps {
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  onRouteCalculated?: (success: boolean) => void;
}

const HistoricRouteService = ({ 
  map, 
  directionsService,
  onRouteCalculated 
}: HistoricRouteServiceProps) => {
  const [renderers, setRenderers] = useState<google.maps.DirectionsRenderer[]>([]);

  useEffect(() => {
    if (!map || !directionsService || typeof google === 'undefined') return;

    // Clear any existing renderers
    renderers.forEach(renderer => renderer.setMap(null));
    setRenderers([]);

    const segments = getHistoricRoute66Segments();
    const newRenderers: google.maps.DirectionsRenderer[] = [];
    let successfulSegments = 0;
    let completedSegments = 0;

    console.log(`Calculating ${segments.length} historic Route 66 segments following real highways`);

    segments.forEach((segment, index) => {
      // Create a renderer for this segment
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

      // Get waypoints for this segment
      const segmentWaypoints = historicRoute66Waypoints.slice(segment.start, segment.end + 1);
      
      if (segmentWaypoints.length < 2) {
        completedSegments++;
        return;
      }

      const origin = segmentWaypoints[0];
      const destination = segmentWaypoints[segmentWaypoints.length - 1];
      
      // Use intermediate waypoints to force highway following
      const intermediateWaypoints = segmentWaypoints.slice(1, -1);
      const waypoints = intermediateWaypoints.length <= 23 ? 
        intermediateWaypoints.map(point => ({
          location: new google.maps.LatLng(point.lat, point.lng),
          stopover: false
        })) : 
        // If too many waypoints, select key ones
        intermediateWaypoints.filter((_, idx) => idx % Math.ceil(intermediateWaypoints.length / 20) === 0)
          .map(point => ({
            location: new google.maps.LatLng(point.lat, point.lng),
            stopover: false
          }));

      // Enhanced request specifically for highway following
      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false, // Keep historic order
        avoidHighways: false, // We WANT to use highways like I-44, I-40
        avoidTolls: false,
        provideRouteAlternatives: false,
        region: 'US',
        // Force routing to prefer major highways
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS
        }
      };

      console.log(`Calculating ${segment.description} (${segment.highway})`);

      directionsService.route(request, (result, status) => {
        completedSegments++;
        
        if (status === google.maps.DirectionsStatus.OK && result) {
          console.log(`✓ ${segment.description} calculated successfully via ${segment.highway}`);
          renderer.setDirections(result);
          successfulSegments++;
        } else {
          console.warn(`⚠ ${segment.description} failed (${status}), using direct highway path`);
          
          // Create a highway-following polyline as fallback
          const path = segmentWaypoints.map(point => 
            new google.maps.LatLng(point.lat, point.lng)
          );
          
          new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#DC2626',
            strokeOpacity: 0.8,
            strokeWeight: 5,
            map: map,
            zIndex: 8
          });
        }

        // Check if all segments are complete
        if (completedSegments === segments.length) {
          const successRate = successfulSegments / segments.length;
          console.log(`Historic Route 66 calculation complete: ${successfulSegments}/${segments.length} segments successful (${Math.round(successRate * 100)}%)`);
          if (onRouteCalculated) {
            onRouteCalculated(successRate > 0.3); // Success if more than 30% worked
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

export default HistoricRouteService;
