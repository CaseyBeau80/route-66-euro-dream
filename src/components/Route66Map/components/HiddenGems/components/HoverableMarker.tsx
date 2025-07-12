
import React, { useCallback } from 'react';
import { HiddenGem } from '../types';
import { useMarkerHover } from '../hooks/useMarkerHover';
import HoverCardPortal from './HoverCardPortal';
import MarkerCore from './MarkerCore';

interface HoverableMarkerProps {
  gem: HiddenGem;
  onMarkerClick: (gem: HiddenGem) => void;
  onWebsiteClick: (website: string) => void;
  map: google.maps.Map;
}

const HoverableMarker: React.FC<HoverableMarkerProps> = ({
  gem,
  onWebsiteClick,
  map
}) => {
  const {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup
  } = useMarkerHover();

  // Prevent hover card from disappearing when hovering over it
  const handleCardMouseEnter = useCallback(() => {
    console.log(`🐭 Mouse entered hover card for: ${gem.title} - keeping card visible`);
    handleMouseEnter(gem.title);
  }, [handleMouseEnter, gem.title]);

  const handleCardMouseLeave = useCallback(() => {
    console.log(`🐭 Mouse left hover card for: ${gem.title} - starting hide delay`);
    handleMouseLeave(gem.title);
  }, [handleMouseLeave, gem.title]);

  console.log(`🔍 HoverableMarker render - ${gem.title}:`, {
    isHovered,
    shouldShowHover: isHovered
  });

  return (
    <>
      <MarkerCore
        gem={gem}
        map={map}
        updatePosition={updatePosition}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        cleanup={cleanup}
      />

      {/* Hover card - show when hovering */}
      {isHovered && (
        <HoverCardPortal
          gem={gem}
          isVisible={true}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        />
      )}
    </>
  );
};

export default HoverableMarker;
