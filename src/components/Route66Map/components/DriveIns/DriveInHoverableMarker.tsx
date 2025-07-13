
import React, { useCallback } from 'react';
import { DriveInData } from './hooks/useDriveInsData';
import { useDriveInMobile } from './hooks/useDriveInMobile';
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
  onWebsiteClick,
  map
}) => {
  const {
    isMobile,
    isClicked,
    clickPosition,
    isHovered,
    hoverPosition,
    handleTouchInteraction,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    closeClickable,
    cleanup
  } = useDriveInMobile();

  // Prevent hover card from disappearing when hovering over it
  const handleCardMouseEnter = useCallback(() => {
    console.log(`🐭 Mouse entered drive-in hover card for: ${driveIn.name} - keeping card visible`);
    handleMouseEnter(driveIn.name);
  }, [handleMouseEnter, driveIn.name]);

  const handleCardMouseLeave = useCallback(() => {
    console.log(`🐭 Mouse left drive-in hover card for: ${driveIn.name} - starting hide delay`);
    handleMouseLeave(driveIn.name);
  }, [handleMouseLeave, driveIn.name]);

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
        handleTouchInteraction={handleTouchInteraction}
        handleClick={handleClick}
        isMobile={isMobile}
        cleanup={cleanup}
      />

      {/* Hover card - only show when hovering and not on mobile */}
      {!isMobile && isHovered && (
        <DriveInHoverCardPortal
          driveIn={driveIn}
          isVisible={true}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        />
      )}
      
      {/* Clickable card - only show on mobile when tapped */}
      {isMobile && isClicked && (
        <DriveInHoverCardPortal
          driveIn={driveIn}
          isVisible={true}
          position={clickPosition}
          onWebsiteClick={onWebsiteClick}
          onMouseEnter={() => {}}
          onMouseLeave={closeClickable}
        />
      )}
    </>
  );
};

export default DriveInHoverableMarker;
