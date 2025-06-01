
import React from 'react';
import { createPortal } from 'react-dom';
import { HiddenGem } from './types';
import { useCardPosition } from './hooks/useCardPosition';
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

  const isDriveIn = gem.title.toLowerCase().includes('drive-in');

  if (!isVisible) return null;

  const cardContent = (
    <div
      className="fixed pointer-events-auto z-50"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        zIndex: 55000
      }}
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
