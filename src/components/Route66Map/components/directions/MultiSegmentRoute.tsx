
import { useEffect, useState } from 'react';
import { detailedRoute66Waypoints, getRoute66Segments } from '../Route66WaypointsDetailed';

interface MultiSegmentRouteProps {
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  onRouteCalculated?: (success: boolean) => void;
}

const MultiSegmentRoute = ({ 
  map, 
  directionsService,
  onRouteCalculated 
}: MultiSegmentRouteProps) => {
  const [renderers, setRenderers] = useState<google.maps.DirectionsRenderer[]>([]);
  const [calculatedSegments, setCalculatedSegments] = useState(0);

  useEffect(() => {
    if (!map || !directionsService || typeof google === 'undefined') return;

    // Clear any existing renderers
    renderers.forEach(renderer => renderer.setMap(null));
    setRenderers([]);
    setCalculatedSegments(0);

    const segments = getRoute66Segments();
    const newRenderers: google.maps.DirectionsRenderer[] = [];
    let successfulSegments = 0;

    console.log(`Calculating ${segments.length} route segments for better road following`);

    segments.forEach((segment, index) => {
      // Create a renderer for this segment
      const renderer = new google.maps.DirectionsRenderer({
        suppressMarkers: index > 0, // Only show markers on first segment
        preserveViewport: true,
        polylineOptions: {
          strokeColor: '#DC2626',
          strokeOpacity: 1.0,
          strokeWeight: 5,
          zIndex: 10
        }
      });
      
      renderer.setMap(map);
      newRenderers.push(renderer);

      // Get waypoints for this segment
      const segmentWaypoints = detailedRoute66Waypoints.slice(segment.start, segment.end + 1);
      
      if (segmentWaypoints.length < 2) return;

      const origin = segmentWaypoints[0];
      const destination = segmentWaypoints[segmentWaypoints.length - 1];
      const waypoints = segmentWaypoints.slice(1, -1).map(point => ({
        location: point.description || new google.maps.LatLng(point.lat, point.lng),
        stopover: point.stopover
      }));

      // Create enhanced request for road following
      const request: google.maps.DirectionsRequest = {
        origin: origin.description || new google.maps.LatLng(origin.lat, origin.lng),
        destination: destination.description || new google.maps.LatLng(destination.lat, destination.lng),
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false, // Keep historic order
        avoidHighways: false, // We want to use highways like I-44, I-40
        avoidTolls: false,
        provideRouteAlternatives: false,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS
        }
      };

      console.log(`Calculating segment ${index + 1}/${segments.length}: ${origin.description} to ${destination.description}`);

      // Calculate this segment
      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          console.log(`Segment ${index + 1} calculated successfully`);
          renderer.setDirections(result);
          successfulSegments++;
        } else {
          console.error(`Error calculating segment ${index + 1}: ${status}`);
          
          // Fallback: create a simple polyline for this segment
          const path = segmentWaypoints.map(point => 
            new google.maps.LatLng(point.lat, point.lng)
          );
          
          new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#DC2626',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map: map
          });
        }

        // Check if all segments are done
        setCalculatedSegments(prev => {
          const newCount = prev + 1;
          if (newCount === segments.length) {
            const success = successfulSegments > segments.length / 2; // At least half successful
            console.log(`Route calculation complete: ${successfulSegments}/${segments.length} segments successful`);
            if (onRouteCalculated) onRouteCalculated(success);
          }
          return newCount;
        });
      });
    });

    setRenderers(newRenderers);

    return () => {
      newRenderers.forEach(renderer => renderer.setMap(null));
    };
  }, [map, directionsService, onRouteCalculated]);

  return null; // This is a non-visual component
};

export default MultiSegmentRoute;
