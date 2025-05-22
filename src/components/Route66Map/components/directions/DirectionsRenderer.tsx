
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
        strokeColor: '#B91C1C', // Deep red color for Route 66
        strokeOpacity: 0.8,
        strokeWeight: 4
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
