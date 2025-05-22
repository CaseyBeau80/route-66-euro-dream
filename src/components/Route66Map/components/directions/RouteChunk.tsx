
import { useEffect, useState } from 'react';
import { route66WaypointData, getGoogleWaypoints } from '../Route66Waypoints';

interface RouteChunkProps {
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  startIndex: number;
  endIndex: number;
  onRouteCalculated?: (success: boolean) => void;
}

const RouteChunk = ({ 
  map, 
  directionsService,
  directionsRenderer,
  startIndex,
  endIndex,
  onRouteCalculated 
}: RouteChunkProps) => {
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!map || !directionsService || !directionsRenderer || typeof google === 'undefined' || isCalculating) return;

    setIsCalculating(true);
    
    // Get waypoint data for this chunk
    const originData = route66WaypointData[startIndex];
    const destinationData = route66WaypointData[endIndex];
    
    // Create origin and destination as proper addresses for better routing
    const origin = originData.description || new google.maps.LatLng(originData.lat, originData.lng);
    const destination = destinationData.description || new google.maps.LatLng(destinationData.lat, destinationData.lng);
    
    // Get waypoints excluding origin and destination
    const waypoints = route66WaypointData
      .slice(startIndex + 1, endIndex)
      .map(waypoint => ({ 
        location: waypoint.description || new google.maps.LatLng(waypoint.lat, waypoint.lng),
        stopover: waypoint.stopover
      }));

    // Create route request with specific routing preferences
    const request: google.maps.DirectionsRequest = {
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false, // Don't reorder - we want the historic route
      avoidHighways: false,
      avoidTolls: false,
      provideRouteAlternatives: false
    };

    // Calculate route
    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        console.log(`Route chunk ${startIndex} to ${endIndex} calculated successfully`);
        directionsRenderer.setDirections(result);
        if (onRouteCalculated) onRouteCalculated(true);
      } else {
        console.error(`Error fetching directions for chunk ${startIndex}-${endIndex}: ${status}`);
        if (onRouteCalculated) onRouteCalculated(false);
      }
      setIsCalculating(false);
    });
  }, [map, directionsService, directionsRenderer, startIndex, endIndex, onRouteCalculated, isCalculating]);

  // This is a non-visual component that handles the directions calculation
  return null;
};

export default RouteChunk;
