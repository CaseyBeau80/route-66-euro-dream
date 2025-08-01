
import React from 'react';
import { createPortal } from 'react-dom';
import { DriveInData } from './hooks/useDriveInsData';
import { useDriveInCardPosition } from './hooks/useDriveInCardPosition';
import DriveInTheaterHoverCard from './DriveInTheaterHoverCard';

interface DriveInHoverCardPortalProps {
  driveIn: DriveInData;
  isVisible: boolean;
  position: { x: number; y: number };
  onWebsiteClick: (website: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose?: () => void;
  cardId?: string;
}

const DriveInHoverCardPortal: React.FC<DriveInHoverCardPortalProps> = ({
  driveIn,
  isVisible,
  position,
  onWebsiteClick,
  onMouseEnter,
  onMouseLeave,
  onClose,
  cardId
}) => {
  const cardPosition = useDriveInCardPosition({
    isVisible,
    position,
    cardWidth: 350,
    cardHeight: 300
  });

  if (!isVisible) return null;

  const cardContent = (
    <div
      className="fixed pointer-events-auto z-50"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        zIndex: 45000
      }}
      data-card-id={cardId}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <DriveInTheaterHoverCard
        driveIn={driveIn}
        onWebsiteClick={onWebsiteClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClose={onClose}
      />
    </div>
  );

  return createPortal(cardContent, document.body);
};

export default DriveInHoverCardPortal;
