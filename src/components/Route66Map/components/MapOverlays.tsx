
import { useEffect } from 'react';

interface MapOverlaysProps {
  map: google.maps.Map;
}

const MapOverlays = ({ map }: MapOverlaysProps) => {
  useEffect(() => {
    if (!map) return;
    
    // Define the Route 66 corridor with a slightly larger buffer
    const route66Corridor = new google.maps.LatLngBounds(
      new google.maps.LatLng(33.7, -118.5),  // SW - Los Angeles area
      new google.maps.LatLng(42.1, -87.5)    // NE - Chicago area
    );
    
    // Apply bounds restrictions
    map.setOptions({
      restriction: {
        latLngBounds: route66Corridor,
        strictBounds: false  // Allow some overflow but restrict excessive panning
      }
    });

    // Create a semi-transparent overlay for non-Route 66 areas
    const nonRouteOverlay = new google.maps.Rectangle({
      bounds: {
        north: 85,  // Far north (covers the entire map height)
        south: -85, // Far south
        east: 180,  // Far east (covers the entire map width)
        west: -180  // Far west
      },
      strokeOpacity: 0,
      fillColor: "#CCCCCC",
      fillOpacity: 0.35,
      map: map,
      zIndex: -1  // Place behind other elements
    });
    
    // Return cleanup function
    return () => {
      nonRouteOverlay.setMap(null);
    };
  }, [map]);
  
  return null; // This is a non-visual component
};

export default MapOverlays;
