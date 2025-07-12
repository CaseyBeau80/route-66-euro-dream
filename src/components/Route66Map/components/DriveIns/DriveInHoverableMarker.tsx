
import React, { useCallback, useContext, useEffect } from 'react';
import { DriveInData } from './hooks/useDriveInsData';
import { useDriveInMarkerHover } from './hooks/useDriveInMarkerHover';
import { MapHoverContext } from '@/components/Route66Map/GoogleMapsRoute66';
import DriveInHoverCardPortal from './DriveInHoverCardPortal';
import DriveInMarkerCore from './DriveInMarkerCore';

interface DriveInHoverableMarkerProps {
  driveIn: DriveInData;
  onMarkerClick: (driveIn: DriveInData) => void;
  onWebsiteClick: (website: string) => void;
  map: google.maps.Map;
}

const DriveInHoverableMarker: React.FC<DriveInHoverableMarkerProps> = ({
  driveIn,
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
  } = useDriveInMarkerHover();
  
  const mapHoverContext = useContext(MapHoverContext);

  // Register hover clear function with map
  useEffect(() => {
    if (mapHoverContext && clearHover) {
      return mapHoverContext.registerHoverClear(clearHover);
    }
  }, [mapHoverContext, clearHover]);

  // Handle marker click - use tap on mobile, hover on desktop
  const handleMarkerInteraction = useCallback((driveIn: DriveInData) => {
    console.log(`🚗 Drive-in marker interaction: ${driveIn.name} (mobile: ${isMobile})`);
    
    // Clear any existing hovers first to prevent duplicates
    if (mapHoverContext) {
      mapHoverContext.clearAllHovers();
    }
    
    if (isMobile) {
      handleTap(driveIn.name);
    } else {
      // Desktop behavior - click shows hover card
      handleMouseEnter(driveIn.name);
    }
    
    if (onMarkerClick) {
      onMarkerClick(driveIn);
    }
  }, [isMobile, handleTap, handleMouseEnter, onMarkerClick, mapHoverContext]);

  // Prevent hover card from disappearing when hovering over it
  const handleCardMouseEnter = useCallback(() => {
    console.log(`🐭 Mouse entered drive-in hover card for: ${driveIn.name} - keeping card visible`);
    if (!isMobile) handleMouseEnter(driveIn.name);
  }, [handleMouseEnter, driveIn.name, isMobile]);

  const handleCardMouseLeave = useCallback(() => {
    console.log(`🐭 Mouse left drive-in hover card for: ${driveIn.name} - starting hide delay`);
    if (!isMobile) handleMouseLeave(driveIn.name);
  }, [handleMouseLeave, driveIn.name, isMobile]);

  console.log(`🔍 DriveInHoverableMarker render - ${driveIn.name}:`, {
    isHovered,
    status: driveIn.status
  });

  return (
    <>
      <DriveInMarkerCore
        driveIn={driveIn}
        map={map}
        updatePosition={updatePosition}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        onMarkerClick={handleMarkerInteraction}
        cleanup={cleanup}
      />

      {/* Hover card - show when hovering */}
      {isHovered && (
        <DriveInHoverCardPortal
          driveIn={driveIn}
          isVisible={true}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
          onClose={clearHover}
        />
      )}
    </>
  );
};

export default DriveInHoverableMarker;
