
import React, { useCallback, useContext, useEffect } from 'react';
import { HiddenGem } from '../types';
import { useMarkerHover } from '../hooks/useMarkerHover';
import { MapHoverContext } from '@/components/Route66Map/GoogleMapsRoute66';
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
  onMarkerClick,
  onWebsiteClick,
  map
}) => {
  const {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup,
    clearHover
  } = useMarkerHover();
  
  const mapHoverContext = useContext(MapHoverContext);

  // Register hover clear function with map
  useEffect(() => {
    if (mapHoverContext && clearHover) {
      return mapHoverContext.registerHoverClear(clearHover);
    }
  }, [mapHoverContext, clearHover]);

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
        onMarkerClick={onMarkerClick}
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
