
import React, { useEffect, useRef } from 'react';
import { HiddenGem } from './types';
import { useMarkerHover } from './hooks/useMarkerHover';
import { createMarkerSetup } from './MarkerSetup';
import HoverCardDisplay from './HoverCardDisplay';

interface HiddenGemCustomMarkerProps {
  gem: HiddenGem;
  isActive: boolean;
  onMarkerClick: (gem: HiddenGem) => void;
  onWebsiteClick: (website: string) => void;
  map: google.maps.Map;
}

const HiddenGemCustomMarker: React.FC<HiddenGemCustomMarkerProps> = ({
  gem,
  isActive,
  onMarkerClick,
  onWebsiteClick,
  map
}) => {
  const markerSetupRef = useRef<{ cleanup: () => void } | null>(null);
  const {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup: cleanupHover
  } = useMarkerHover();

  useEffect(() => {
    if (!map) return;

    const markerSetup = createMarkerSetup({
      gem,
      map,
      onMarkerClick,
      onMouseEnter: () => handleMouseEnter(gem.title),
      onMouseLeave: () => handleMouseLeave(gem.title),
      onPositionUpdate: updatePosition
    });

    markerSetupRef.current = markerSetup;

    // Cleanup function
    return () => {
      cleanupHover();
      if (markerSetupRef.current) {
        markerSetupRef.current.cleanup();
      }
    };
  }, [gem, map, onMarkerClick, handleMouseEnter, handleMouseLeave, updatePosition, cleanupHover]);

  console.log(`Rendering custom gem marker: ${gem.title} at ${gem.latitude}, ${gem.longitude}, hovered: ${isHovered}`);

  return (
    <HoverCardDisplay
      gem={gem}
      isVisible={isHovered}
      position={hoverPosition}
      onWebsiteClick={onWebsiteClick}
    />
  );
};

export default HiddenGemCustomMarker;
