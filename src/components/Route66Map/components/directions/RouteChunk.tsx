
import { useEffect, useState } from 'react';
import { route66WaypointData, getGoogleWaypoints } from '../Route66Waypoints';
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
    if (!map || !directionsService || typeof google === 'undefined') return;

    // Get waypoint data for this chunk
    const originData = route66WaypointData[startIndex];
    const destinationData = route66WaypointData[endIndex];
    
    // Create origin and destination LatLng objects
    const origin = new google.maps.LatLng(originData.lat, originData.lng);
    const destination = new google.maps.LatLng(destinationData.lat, destinationData.lng);
    
    // Get waypoints excluding origin and destination
    const waypoints = route66WaypointData
      .slice(startIndex + 1, endIndex)
      .map(waypoint => ({ 
        location: new google.maps.LatLng(waypoint.lat, waypoint.lng),
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
