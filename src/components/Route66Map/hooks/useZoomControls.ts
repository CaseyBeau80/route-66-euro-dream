
import { useState, useCallback, useEffect } from 'react';

interface UseZoomControlsProps {
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
}

export const useZoomControls = ({ 
  minZoom, 
  maxZoom,
  zoomStep 
}: UseZoomControlsProps) => {
  const [zoom, setZoom] = useState(1);
  const [zoomActivity, setZoomActivity] = useState<boolean>(false);
  const [isPinching, setIsPinching] = useState(false);

  // Reset the zoom activity indicator after a delay
  useEffect(() => {
    if (zoomActivity) {
      const timer = setTimeout(() => {
        setZoomActivity(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [zoomActivity]);
  
  // Zoom handlers with debounce to prevent rapid updates
  const handleZoomIn = useCallback(() => {
    setZoom(prevZoom => {
      const newZoom = Math.min(prevZoom + zoomStep, maxZoom);
      console.log('Zoom in to:', newZoom);
      setZoomActivity(true);
      return newZoom;
    });
  }, [maxZoom, zoomStep]);

  const handleZoomOut = useCallback(() => {
    setZoom(prevZoom => {
      const newZoom = Math.max(prevZoom - zoomStep, minZoom);
      console.log('Zoom out to:', newZoom);
      setZoomActivity(true);
      return newZoom;
    });
  }, [minZoom, zoomStep]);
  
  const handleZoomChange = useCallback((newZoom: number) => {
    console.log('Zoom changed to:', newZoom.toFixed(2));
    setIsPinching(true);
    setZoom(newZoom);
    setZoomActivity(true);
    
    // Reset isPinching after a short delay
    const timeout = setTimeout(() => {
      setIsPinching(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  return {
    zoom,
    isPinching,
    zoomActivity,
    setIsPinching,
    setZoomActivity,
    handleZoomIn,
    handleZoomOut,
    handleZoomChange
  };
};
