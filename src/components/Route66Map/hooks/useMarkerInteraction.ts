
import { useState, useCallback } from 'react';

export const useMarkerInteraction = () => {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  // Handle marker click
  const handleMarkerClick = useCallback((index: number) => {
    setActiveMarker(index === activeMarker ? null : index);
  }, [activeMarker]);

  // Handle map click
  const handleMapClick = useCallback(() => {
    setActiveMarker(null);
  }, []);

  return {
    activeMarker,
    handleMarkerClick,
    handleMapClick
  };
};
