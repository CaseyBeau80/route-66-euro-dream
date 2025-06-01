
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

  // Prevent hover card from disappearing when hovering over it
  const handleCardMouseEnter = useCallback(() => {
    console.log(`🐭 Mouse entered hover card for: ${gem.title} - keeping card visible`);
    handleMouseEnter(gem.title);
  }, [handleMouseEnter, gem.title]);

  const handleCardMouseLeave = useCallback(() => {
    console.log(`🐭 Mouse left hover card for: ${gem.title} - starting hide delay`);
    handleMouseLeave(gem.title);
  }, [handleMouseLeave, gem.title]);

  const handleCloseClickableCard = () => {
    setIsClicked(false);
  };

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

      {/* Hover card - only show when hovering and not clicked */}
      {!isClicked && (
        <HoverCardPortal
          gem={gem}
          isVisible={isHovered}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        />
      )}

      {/* Clickable card - show when clicked */}
      <HiddenGemClickableCard
        gem={gem}
        isVisible={isClicked}
        position={clickPosition}
        onClose={handleCloseClickableCard}
        onWebsiteClick={onWebsiteClick}
      />
    </>
  );
};

export default HoverableMarker;
