
import React from 'react';
import { createPortal } from 'react-dom';
import { HiddenGem } from '../types';
import { useCardPosition } from '../hooks/useCardPosition';
import DriveInHoverCard from './DriveInHoverCard';
import RegularGemHoverCard from './RegularGemHoverCard';

interface HoverCardPortalProps {
  gem: HiddenGem;
  isVisible: boolean;
  position: { x: number; y: number };
  onWebsiteClick: (website: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose?: () => void;
}

const HoverCardPortal: React.FC<HoverCardPortalProps> = ({
  gem,
  isVisible,
  position,
  onWebsiteClick,
  onMouseEnter,
  onMouseLeave,
  onClose
}) => {
  const cardPosition = useCardPosition({
    isVisible,
    position,
    cardWidth: 350,
    cardHeight: 280
  });

  // Only show drive-in styling for actual drive-in theaters from the drive_ins table
  // Hidden gems with "drive-in" in the name should use regular gem styling
  const isDriveIn = false; // Hidden gems always use regular gem styling

  if (!isVisible) return null;

  const cardContent = (
    <>
      {/* Backdrop for mobile click-off functionality */}
      <div
        className="fixed inset-0 z-40 pointer-events-auto md:pointer-events-none"
        onClick={onClose}
        style={{ zIndex: 44999 }}
      />
      
      {/* Hover card */}
      <div
        className="fixed pointer-events-auto z-50"
        style={{
          left: `${cardPosition.left}px`,
          top: `${cardPosition.top}px`,
          zIndex: 45000
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
      {isDriveIn ? (
        <DriveInHoverCard
          gem={gem}
          onWebsiteClick={onWebsiteClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ) : (
        <RegularGemHoverCard
          gem={gem}
          onWebsiteClick={onWebsiteClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClose={onClose}
        />
      )}
    </div>
    </>
  );

  return createPortal(cardContent, document.body);
};

export default HoverCardPortal;
