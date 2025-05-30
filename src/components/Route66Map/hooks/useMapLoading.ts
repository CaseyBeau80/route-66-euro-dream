
import { useState } from 'react';

export const useMapLoading = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(5);

  return {
    isDragging,
    setIsDragging,
    currentZoom,
    setCurrentZoom
  };
};
