
import React from 'react';
import { HiddenGem } from '../types';

interface MarkerElementProps {
  gem: HiddenGem;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPositionUpdate: (x: number, y: number) => void;
  map: google.maps.Map;
}

export const MarkerElement: React.FC<MarkerElementProps> = ({
  gem,
  onMouseEnter,
  onMouseLeave,
  onPositionUpdate,
  map
}) => {
  const markerSetupRef = React.useRef<{ cleanup: () => void } | null>(null);

  React.useEffect(() => {
    if (!map) return;

    const { createMarkerSetup } = require('../MarkerSetup');
    
    const markerSetup = createMarkerSetup({
      gem,
      map,
      onMarkerClick: () => {}, // This will be handled by the parent component
      onMouseEnter,
      onMouseLeave,
      onPositionUpdate
    });

    markerSetupRef.current = markerSetup;

    return () => {
      if (markerSetupRef.current) {
        markerSetupRef.current.cleanup();
      }
    };
  }, [gem, map, onMouseEnter, onMouseLeave, onPositionUpdate]);

  return null;
};
