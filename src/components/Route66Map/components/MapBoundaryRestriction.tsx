
import { useEffect } from 'react';

interface MapBoundaryRestrictionProps {
  map: google.maps.Map;
}

const MapBoundaryRestriction = ({ map }: MapBoundaryRestrictionProps) => {
  useEffect(() => {
    if (!map) return;
    
    // Define the USA boundary with a buffer
    const usaBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(24.5, -125.0),  // SW - cover all continental US
      new google.maps.LatLng(50.0, -65.0)    // NE - cover all continental US
    );
    
    // Apply bounds restrictions
    map.setOptions({
      restriction: {
        latLngBounds: usaBounds,
        strictBounds: false  // Allow some overflow but restrict excessive panning
      }
    });
  }, [map]);
  
  return null; // This is a non-visual component
};

export default MapBoundaryRestriction;
