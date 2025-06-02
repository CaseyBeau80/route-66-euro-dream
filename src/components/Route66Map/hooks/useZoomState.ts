
import { useState, useEffect } from 'react';

interface UseZoomStateProps {
  map: google.maps.Map | null;
  isMapReady: boolean;
}

export const useZoomState = ({ map, isMapReady }: UseZoomStateProps) => {
  const [currentZoom, setCurrentZoom] = useState(4);
  const [isZooming, setIsZooming] = useState(false);

  // Sync zoom level with map
  useEffect(() => {
    if (!map || !isMapReady) {
      console.log('🎮 ZoomControls: Map not ready for zoom sync');
      return;
    }

    const updateZoomLevel = () => {
      const zoom = map.getZoom();
      if (zoom !== undefined) {
        console.log('🎮 ZoomControls: Map zoom changed to:', zoom);
        setCurrentZoom(zoom);
      }
    };

    // Set initial zoom immediately
    const initialZoom = map.getZoom();
    if (initialZoom !== undefined) {
      console.log('🎮 ZoomControls: Setting initial zoom:', initialZoom);
      setCurrentZoom(initialZoom);
    }

    // Listen for zoom changes
    const zoomListener = map.addListener('zoom_changed', updateZoomLevel);

    return () => {
      if (zoomListener) {
        google.maps.event.removeListener(zoomListener);
      }
    };
  }, [map, isMapReady]);

  return {
    currentZoom,
    isZooming,
    setIsZooming
  };
};
