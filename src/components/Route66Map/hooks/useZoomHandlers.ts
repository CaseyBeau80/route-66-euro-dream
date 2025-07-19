
import { useCallback } from 'react';

interface UseZoomHandlersProps {
  map: google.maps.Map | null;
  isMapReady: boolean;
  isZooming: boolean;
  setIsZooming: (zooming: boolean) => void;
}

export const useZoomHandlers = ({ map, isMapReady, isZooming, setIsZooming }: UseZoomHandlersProps) => {
  const handleZoomIn = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent all default behaviors that could trigger browser zoom
    e.preventDefault();
    e.stopPropagation();
    
    if (!map || !isMapReady || isZooming) {
      console.log('🎮 ZoomControls: Zoom in blocked');
      return false;
    }

    const currentMapZoom = map.getZoom();
    if (currentMapZoom === undefined || currentMapZoom >= 16) { // Updated max zoom
      console.log('🎮 ZoomControls: Already at maximum zoom');
      return false;
    }

    console.log('🎮 ZoomControls: Zooming in from:', currentMapZoom);
    setIsZooming(true);
    
    try {
      const newZoom = Math.min(currentMapZoom + 1, 16); // Updated max zoom
      console.log('🎮 ZoomControls: Setting new zoom to:', newZoom);
      
      // Use Google Maps setZoom method directly
      map.setZoom(newZoom);
      
      // Reset zooming state after a delay
      setTimeout(() => {
        setIsZooming(false);
      }, 300);
    } catch (error) {
      console.error('🎮 ZoomControls: Error zooming in:', error);
      setIsZooming(false);
    }
    
    return false;
  }, [map, isMapReady, isZooming, setIsZooming]);

  const handleZoomOut = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent all default behaviors that could trigger browser zoom
    e.preventDefault();
    e.stopPropagation();
    
    if (!map || !isMapReady || isZooming) {
      console.log('🎮 ZoomControls: Zoom out blocked');
      return false;
    }

    const currentMapZoom = map.getZoom();
    if (currentMapZoom === undefined || currentMapZoom <= 3) {
      console.log('🎮 ZoomControls: Already at minimum zoom');
      return false;
    }

    console.log('🎮 ZoomControls: Zooming out from:', currentMapZoom);
    setIsZooming(true);
    
    try {
      const newZoom = Math.max(currentMapZoom - 1, 3);
      console.log('🎮 ZoomControls: Setting new zoom to:', newZoom);
      
      // Use Google Maps setZoom method directly
      map.setZoom(newZoom);
      
      // Reset zooming state after a delay
      setTimeout(() => {
        setIsZooming(false);
      }, 300);
    } catch (error) {
      console.error('🎮 ZoomControls: Error zooming out:', error);
      setIsZooming(false);
    }
    
    return false;
  }, [map, isMapReady, isZooming, setIsZooming]);

  return {
    handleZoomIn,
    handleZoomOut
  };
};
