
import { useState, useCallback, useEffect } from 'react';

interface UseZoomControlsProps {
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
  initialZoom?: number;
  onZoomStart?: () => void;
}

export const useZoomControls = ({ 
  minZoom, 
  maxZoom,
  zoomStep,
  initialZoom = 1,
  onZoomStart
}: UseZoomControlsProps) => {
  const [zoom, setZoom] = useState(initialZoom);
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
  
  // Zoom handlers with proper boundary checking
  const handleZoomIn = useCallback(() => {
    // Notify that zoom is starting so center can be captured
    if (onZoomStart) {
      onZoomStart();
    }
    
    setZoom(prevZoom => {
      const newZoom = Math.min(prevZoom + zoomStep, maxZoom);
      console.log('Zoom in to:', newZoom);
      setZoomActivity(true);
      return newZoom;
    });
  }, [maxZoom, zoomStep, onZoomStart]);

  const handleZoomOut = useCallback(() => {
    // Notify that zoom is starting so center can be captured
    if (onZoomStart) {
      onZoomStart();
    }
    
    setZoom(prevZoom => {
      const newZoom = Math.max(prevZoom - zoomStep, minZoom);
      console.log('Zoom out to:', newZoom);
      setZoomActivity(true);
      return newZoom;
    });
  }, [minZoom, zoomStep, onZoomStart]);
  
  const handleZoomChange = useCallback((newZoom: number) => {
    // Ensure zoom is within bounds
    const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
    console.log('Zoom changed to:', clampedZoom.toFixed(2));
    setIsPinching(true);
    setZoom(clampedZoom);
    setZoomActivity(true);
    
    // Reset isPinching after a short delay
    const timeout = setTimeout(() => {
      setIsPinching(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [minZoom, maxZoom]);

  // Set zoom to a specific value
  const setZoomLevel = useCallback((newZoom: number) => {
    const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
    setZoom(clampedZoom);
    setZoomActivity(true);
  }, [minZoom, maxZoom]);

  return {
    zoom,
    isPinching,
    zoomActivity,
    setIsPinching,
    setZoomActivity,
    handleZoomIn,
    handleZoomOut,
    handleZoomChange,
    setZoomLevel
  };
};
