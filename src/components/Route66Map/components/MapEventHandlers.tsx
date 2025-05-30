
import { useCallback, useState } from 'react';

interface MapEventHandlersProps {
  isDragging: boolean;
  selectedState: string | null;
  onClearSelection: () => void;
}

export const useMapEventHandlers = ({
  isDragging,
  selectedState,
  onClearSelection
}: MapEventHandlersProps) => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  const onMapReady = useCallback((readyMap: google.maps.Map) => {
    console.log('🎉 MapEventHandlers: Map is fully ready for enhanced Route 66 rendering');
    setIsMapReady(true);
  }, []);

  return {
    mapInitialized,
    setMapInitialized,
    isMapReady,
    setIsMapReady,
    onMapReady
  };
};
