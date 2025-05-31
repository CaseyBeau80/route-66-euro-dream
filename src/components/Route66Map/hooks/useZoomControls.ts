
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

  // Enhanced zoom thresholds for better clustering visibility
  const getClusteringThresholds = useCallback(() => {
    return {
      // Show clusters at very low zoom levels (far out view)
      ultraCluster: zoom <= 4,
      // Show medium clusters at low-medium zoom
      mediumCluster: zoom > 4 && zoom <= 6,
      // Show small clusters at medium zoom
      smallCluster: zoom > 6 && zoom <= 8,
      // Show individual markers at high zoom
      individual: zoom > 8
    };
  }, [zoom]);

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
    // Capture current center BEFORE changing zoom
    if (onZoomStart) {
      onZoomStart();
    }
    
    // Small delay to ensure center is captured before zoom changes
    setTimeout(() => {
      setZoom(prevZoom => {
        const newZoom = Math.min(prevZoom + zoomStep, maxZoom);
        console.log('Zoom in to:', newZoom);
        setZoomActivity(true);
        return newZoom;
      });
    }, 10);
  }, [maxZoom, zoomStep, onZoomStart]);

  const handleZoomOut = useCallback(() => {
    // Capture current center BEFORE changing zoom
    if (onZoomStart) {
      onZoomStart();
    }
    
    // Small delay to ensure center is captured before zoom changes
    setTimeout(() => {
      setZoom(prevZoom => {
        const newZoom = Math.max(prevZoom - zoomStep, minZoom);
        console.log('Zoom out to:', newZoom);
        setZoomActivity(true);
        return newZoom;
      });
    }, 10);
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
    setZoomLevel,
    getClusteringThresholds
  };
};
