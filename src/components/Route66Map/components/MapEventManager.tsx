
import React, { useEffect } from 'react';

interface MapEventManagerProps {
  map: google.maps.Map | null;
  onMapClick: () => void;
}

const MapEventManager: React.FC<MapEventManagerProps> = ({
  map,
  onMapClick
}) => {
  useEffect(() => {
    if (!map) return;

    // Add click listener
    const clickListener = map.addListener('click', onMapClick);

    // Cleanup function
    const cleanup = () => {
      if (clickListener) {
        google.maps.event.removeListener(clickListener);
      }
    };

    // Store cleanup function on map
    (map as any).__eventCleanup = cleanup;

    return cleanup;
  }, [map, onMapClick]);

  return null;
};

export default MapEventManager;
