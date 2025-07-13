
import React, { useCallback, useState } from 'react';
import { HiddenGem } from '../types';
import { useMarkerHover } from '../hooks/useMarkerHover';
import { useIsMobile } from '@/hooks/use-mobile';
import HoverCardPortal from './HoverCardPortal';
import MarkerCore from './MarkerCore';
import HiddenGemClickableCard from '../HiddenGemClickableCard';

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
  const isMobile = useIsMobile();
  const [isClicked, setIsClicked] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

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

  // Handle marker click for mobile and desktop
  const handleMarkerClick = useCallback((gem: HiddenGem, position: { x: number; y: number }) => {
    console.log(`💎 Clicked hidden gem: ${gem.title}`, { isMobile, position });
    console.log(`💎 Device detection details:`, {
      isMobile,
      hasTouch: 'ontouchstart' in window,
      isSmallScreen: window.innerWidth <= 768,
      userAgent: navigator.userAgent.includes('Mobile')
    });
    
    // Always show clickable card when clicked (for testing both mobile and desktop)
    console.log(`💎 CLICKED: Setting clickable card visible for ${gem.title}`);
    setClickPosition(position);
    setIsClicked(true);
    handleMouseLeave(gem.title); // Hide hover card
    
    // Also trigger the original onMarkerClick for desktop functionality
    if (!isMobile) {
      console.log(`🖥️ DESKTOP: Also triggering onMarkerClick for ${gem.title}`);
      onMarkerClick(gem);
    }
  }, [isMobile, onMarkerClick, handleMouseLeave, gem.title]);

  // Handle closing the clickable card
  const handleCloseClickableCard = useCallback(() => {
    setIsClicked(false);
  }, []);

  console.log(`🔍 HoverableMarker render - ${gem.title}:`, {
    isHovered,
    isClicked,
    isMobile,
    shouldShowHover: isHovered && !isClicked
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
        handleClick={handleMarkerClick}
        isClicked={isClicked}
      />

      {/* Hover card - show when hovering and not clicked */}
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

      {/* Clickable card - show when clicked (primarily for mobile) */}
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
