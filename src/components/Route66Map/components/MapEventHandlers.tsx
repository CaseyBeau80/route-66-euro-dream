
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
  const [isMapReady, setIsMapReady] = useState(false);

  const onMapReady = useCallback(() => {
    console.log('🎉 MapEventHandlers: Map is fully ready for enhanced Route 66 rendering');
    setIsMapReady(true);
  }, []);

  return {
    isMapReady,
    setIsMapReady,
    onMapReady
  };
};
