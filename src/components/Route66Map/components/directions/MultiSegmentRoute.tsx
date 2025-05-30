import { useEffect, useState } from 'react';
import { detailedRoute66Waypoints } from '../Route66WaypointsCoordinator';
import { getRoute66Segments } from '../utils/RouteSegmentsUtils';

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

  useEffect(() => {
    if (!map || !directionsService || typeof google === 'undefined') return;

    // Clear any existing renderers
    renderers.forEach(renderer => renderer.setMap(null));
    setRenderers([]);

    const segments = getRoute66Segments();
    const newRenderers: google.maps.DirectionsRenderer[] = [];
    let successfulSegments = 0;
    let completedSegments = 0;

    console.log(`Calculating ${segments.length} small route segments for highway following`);

    segments.forEach((segment, index) => {
      // Create a renderer for this segment with enhanced highway routing
      const renderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // We'll handle markers separately
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
      
      if (segmentWaypoints.length < 2) {
        completedSegments++;
        return;
      }

      const origin = segmentWaypoints[0];
      const destination = segmentWaypoints[segmentWaypoints.length - 1];
      
      // Only use intermediate waypoints if we have them and not too many
      const intermediateWaypoints = segmentWaypoints.slice(1, -1);
      const waypoints = intermediateWaypoints.length <= 8 ? 
        intermediateWaypoints.map(point => ({
          location: new google.maps.LatLng(point.lat, point.lng),
          stopover: false // Don't stop at intermediate points
        })) : [];

      // Enhanced request for highway following
      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false, // Keep historic order
        avoidHighways: false, // We WANT highways like I-44, I-40
        avoidTolls: false,
        provideRouteAlternatives: false,
        region: 'US' // Ensure US routing
      };

      console.log(`Calculating segment ${index + 1}/${segments.length}: ${origin.description} to ${destination.description}`);

      // Calculate this segment with enhanced error handling
      directionsService.route(request, (result, status) => {
        completedSegments++;
        
        if (status === google.maps.DirectionsStatus.OK && result) {
          console.log(`✓ Segment ${index + 1} calculated successfully via highways`);
          renderer.setDirections(result);
          successfulSegments++;
        } else {
          console.warn(`⚠ Segment ${index + 1} failed (${status}), using fallback polyline`);
          
          // Create a simple polyline as fallback
          const path = segmentWaypoints.map(point => 
            new google.maps.LatLng(point.lat, point.lng)
          );
          
          new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#DC2626',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map: map,
            zIndex: 5
          });
        }

        // Check if all segments are complete
        if (completedSegments === segments.length) {
          const successRate = successfulSegments / segments.length;
          console.log(`Route calculation complete: ${successfulSegments}/${segments.length} segments successful (${Math.round(successRate * 100)}%)`);
          if (onRouteCalculated) {
            onRouteCalculated(successRate > 0.5); // Success if more than half worked
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

export default MultiSegmentRoute;
