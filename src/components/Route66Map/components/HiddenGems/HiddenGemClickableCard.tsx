
import React from 'react';
import { createPortal } from 'react-dom';
import { HiddenGem } from './types';
import { useCardPosition } from './hooks/useCardPosition';
import { useMobileCardDismissal } from '@/hooks/useMobileCardDismissal';
import DriveInCard from './components/DriveInCard';
import RegularGemCard from './components/RegularGemCard';

interface HiddenGemClickableCardProps {
  gem: HiddenGem;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onWebsiteClick: (website: string) => void;
}

const HiddenGemClickableCard: React.FC<HiddenGemClickableCardProps> = ({
  gem,
  isVisible,
  position,
  onClose,
  onWebsiteClick
}) => {
  const cardPosition = useCardPosition({
    isVisible,
    position,
    cardWidth: 350,
    cardHeight: 280
  });

  const cardId = `hidden-gem-${gem.id}`;
  
  useMobileCardDismissal({
    isVisible,
    onClose,
    cardId
  });

  // Only show drive-in styling for actual drive-in theaters from the drive_ins table
  // Hidden gems with "drive-in" in the name should use regular gem styling
  const isDriveIn = false; // Hidden gems always use regular gem styling

  if (!isVisible) return null;

  const cardContent = (
    <div
      className="fixed pointer-events-auto z-50 touch-manipulation"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        zIndex: 60000
      }}
      data-card-id={cardId}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {isDriveIn ? (
        <DriveInCard
          gem={gem}
          onClose={onClose}
          onWebsiteClick={onWebsiteClick}
        />
      ) : (
        <RegularGemCard
          gem={gem}
          onClose={onClose}
          onWebsiteClick={onWebsiteClick}
        />
      )}
    </div>
  );

  return createPortal(cardContent, document.body);
};

export default HiddenGemClickableCard;
