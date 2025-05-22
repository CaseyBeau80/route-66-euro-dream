
import { useEffect, useState } from 'react';
import { route66Waypoints } from '../Route66Waypoints';
import DirectionsRenderer from './DirectionsRenderer';

interface RouteChunkProps {
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  startIndex: number;
  endIndex: number;
  onRouteCalculated?: (success: boolean) => void;
}

const RouteChunk = ({ 
  map, 
  directionsService,
  startIndex,
  endIndex,
  onRouteCalculated 
}: RouteChunkProps) => {
  const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | undefined>(undefined);

  useEffect(() => {
    if (!map || !directionsService) return;

    // Extract waypoints for this chunk
    const origin = route66Waypoints[startIndex].location;
    const destination = route66Waypoints[endIndex].location;
    
    // Get waypoints excluding origin and destination
    const waypoints = route66Waypoints
      .slice(startIndex + 1, endIndex)
      .map(waypoint => ({ 
        location: waypoint.location,
        stopover: waypoint.stopover
      }));

    // Create route request
    const request: google.maps.DirectionsRequest = {
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false, // Don't reorder - we want the historic route
      avoidHighways: false,
      avoidTolls: false
    };

    // Calculate route
    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log(`Route chunk ${startIndex} to ${endIndex} calculated successfully`);
        setDirectionsResult(result);
        if (onRouteCalculated) onRouteCalculated(true);
      } else {
        console.error(`Error fetching directions for chunk ${startIndex}-${endIndex}: ${status}`);
        if (onRouteCalculated) onRouteCalculated(false);
      }
    });
  }, [map, directionsService, startIndex, endIndex, onRouteCalculated]);

  return (
    <DirectionsRenderer 
      map={map}
      directionsService={directionsService}
      directionsResult={directionsResult}
    />
  );
};

export default RouteChunk;
