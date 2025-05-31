
import React from 'react';
import { HiddenGem } from '../types';
import { createMarkerSetup } from '../MarkerSetup';

interface MarkerElementProps {
  gem: HiddenGem;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPositionUpdate: (x: number, y: number) => void;
  map: google.maps.Map;
}

const MarkerElement: React.FC<MarkerElementProps> = ({
  gem,
  onMouseEnter,
  onMouseLeave,
  onPositionUpdate,
  map
}) => {
  React.useEffect(() => {
    if (!map) return;

    const { cleanup } = createMarkerSetup({
      gem,
      map,
      onMarkerClick: () => {}, // Click handling is done separately
      onMouseEnter,
      onMouseLeave,
      onPositionUpdate
    });

    return cleanup;
  }, [gem, map, onMouseEnter, onMouseLeave, onPositionUpdate]);

  return null;
};

export default MarkerElement;
