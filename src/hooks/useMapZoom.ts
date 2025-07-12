import { useState, useEffect, useCallback } from 'react';

export const useMapZoom = (map: google.maps.Map | null) => {
  const [currentZoom, setCurrentZoom] = useState<number>(6);

  // Simplified zoom handling - no more aggressive debouncing that causes disappearing
  const handleZoomChange = useCallback(() => {
    if (!map) return;
    
    const newZoom = map.getZoom() || 6;
    setCurrentZoom(newZoom);
    
    console.log(`🔍 AttractionsContainer: Zoom changed to ${newZoom}`);
  }, [map]);

  // Listen to zoom changes - simplified event handling
  useEffect(() => {
    if (!map) return;

    console.log('🎯 AttractionsContainer: Setting up zoom listener');
    
    const zoomListener = map.addListener('zoom_changed', handleZoomChange);
    
    // Set initial zoom
    const initialZoom = map.getZoom() || 6;
    setCurrentZoom(initialZoom);
    console.log(`🎯 AttractionsContainer: Initial zoom set to ${initialZoom}`);

    return () => {
      console.log('🧹 AttractionsContainer: Cleaning up zoom listener');
      google.maps.event.removeListener(zoomListener);
    };
  }, [map, handleZoomChange]);

  return currentZoom;
};