
import { useEffect } from 'react';

interface DirectionsRendererProps {
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  directionsResult?: google.maps.DirectionsResult;
  options?: google.maps.DirectionsRendererOptions;
}

// This component is kept for backward compatibility
// The actual rendering is now handled directly in Route66DirectionsService
const DirectionsRenderer = ({ 
  map, 
  directionsResult,
  options
}: DirectionsRendererProps) => {
  useEffect(() => {
    // Initialize a DirectionsRenderer with custom styling if it doesn't exist
    if (!map || !directionsResult || typeof google === 'undefined') return;

    const rendererOptions: google.maps.DirectionsRendererOptions = {
      suppressMarkers: false,
      preserveViewport: true,
      polylineOptions: {
        strokeColor: '#DC2626', // Brighter red color for better visibility
        strokeOpacity: 1.0,     // Full opacity for better visibility
        strokeWeight: 5,        // Thicker line for better visibility
        zIndex: 10             // Higher z-index to ensure it appears above other map elements
      },
      ...options
    };
    
    const renderer = new google.maps.DirectionsRenderer(rendererOptions);
    renderer.setMap(map);
    renderer.setDirections(directionsResult);

    return () => {
      renderer.setMap(null);
    };
  }, [map, directionsResult, options]);

  return null; // This is a non-visual component
};

export default DirectionsRenderer;
