
import { useEffect, useState } from 'react';

interface DirectionsRendererProps {
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  directionsResult?: google.maps.DirectionsResult;
  options?: google.maps.DirectionsRendererOptions;
}

const DirectionsRenderer = ({ 
  map, 
  directionsService, 
  directionsResult,
  options
}: DirectionsRendererProps) => {
  const [renderer, setRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    // Initialize a DirectionsRenderer with custom styling if it doesn't exist
    if (!map) return;

    const rendererOptions: google.maps.DirectionsRendererOptions = {
      suppressMarkers: false,
      preserveViewport: true,
      polylineOptions: {
        strokeColor: '#B91C1C', // Deep red color for Route 66
        strokeOpacity: 0.8,
        strokeWeight: 3,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 1.2,
            strokeColor: '#B91C1C',
            fillColor: '#B91C1C',
            strokeWeight: 1
          },
          offset: '0',
          repeat: '100px'
        }]
      },
      ...options
    };
    
    const newRenderer = new google.maps.DirectionsRenderer(rendererOptions);
    newRenderer.setMap(map);
    setRenderer(newRenderer);

    return () => {
      if (newRenderer) {
        newRenderer.setMap(null);
      }
    };
  }, [map, options]);

  // Update renderer when directionsResult changes
  useEffect(() => {
    if (renderer && directionsResult) {
      renderer.setDirections(directionsResult);
    }
  }, [renderer, directionsResult]);

  return null; // This is a non-visual component
};

export default DirectionsRenderer;
