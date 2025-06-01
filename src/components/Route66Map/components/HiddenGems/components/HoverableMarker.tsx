
import React, { useCallback, useState } from 'react';
import { HiddenGem } from '../types';
import { useMarkerHover } from '../hooks/useMarkerHover';
import HoverCardPortal from './HoverCardPortal';
import HiddenGemClickableCard from '../HiddenGemClickableCard';
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

  const [isClicked, setIsClicked] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  // Prevent hover card from appearing when hovering over it during clicked state
  const handleCardMouseEnter = useCallback(() => {
    if (!isClicked) {
      console.log(`🐭 Mouse entered hover card for: ${gem.title} - keeping card visible`);
      handleMouseEnter(gem.title);
    }
  }, [handleMouseEnter, gem.title, isClicked]);

  const handleCardMouseLeave = useCallback(() => {
    if (!isClicked) {
      console.log(`🐭 Mouse left hover card for: ${gem.title} - starting hide delay`);
      handleMouseLeave(gem.title);
    }
  }, [handleMouseLeave, gem.title, isClicked]);

  const handleCloseClickableCard = () => {
    console.log(`🔄 Closing clickable card for: ${gem.title}`);
    setIsClicked(false);
  };

  // Debug logging
  console.log(`🔍 HoverableMarker render - ${gem.title}:`, {
    isHovered,
    isClicked,
    shouldShowHover: !isClicked && isHovered,
    shouldShowClickable: isClicked
  });

  return (
    <>
      <MarkerCore
        gem={gem}
        map={map}
        isClicked={isClicked}
        updatePosition={updatePosition}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        clearHover={clearHover}
        cleanup={cleanup}
        onMarkerClick={onMarkerClick}
        setIsClicked={setIsClicked}
        setClickPosition={setClickPosition}
      />

      {/* Hover card - ONLY show when hovering AND NOT clicked */}
      {!isClicked && isHovered && (
        <HoverCardPortal
          gem={gem}
          isVisible={true}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        />
      )}

      {/* Clickable card - show when clicked */}
      {isClicked && (
        <HiddenGemClickableCard
          gem={gem}
          isVisible={isClicked}
          position={clickPosition}
          onClose={handleCloseClickableCard}
          onWebsiteClick={onWebsiteClick}
        />
      )}
    </>
  );
};

export default HoverableMarker;
