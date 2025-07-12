
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
    clearHover,
    handleTap,
    isMobile
  } = useMarkerHover();
  
  const mapHoverContext = useContext(MapHoverContext);

  // Register hover clear function with map
  useEffect(() => {
    if (mapHoverContext && clearHover) {
      return mapHoverContext.registerHoverClear(clearHover);
    }
  }, [mapHoverContext, clearHover]);

  // Handle marker click - use tap on mobile, hover on desktop
  const handleMarkerInteraction = useCallback((gem: HiddenGem) => {
    console.log(`💎 Marker interaction: ${gem.title} (mobile: ${isMobile})`);
    
    if (isMobile) {
      handleTap(gem.title);
    } else {
      // Desktop behavior - click shows hover card
      handleMouseEnter(gem.title);
    }
    
    if (onMarkerClick) {
      onMarkerClick(gem);
    }
  }, [isMobile, handleTap, handleMouseEnter, onMarkerClick]);

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
        onMarkerClick={handleMarkerInteraction}
        cleanup={cleanup}
      />

      {/* Hover card - show when hovering */}
      {isHovered && (
        <HoverCardPortal
          gem={gem}
          isVisible={true}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick}
          onMouseEnter={() => !isMobile && handleMouseEnter(gem.title)}
          onMouseLeave={() => !isMobile && handleMouseLeave(gem.title)}
        />
      )}
    </>
  );
};

export default HoverableMarker;
