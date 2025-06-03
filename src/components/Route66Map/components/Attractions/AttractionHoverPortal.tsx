
import React from 'react';
import { createPortal } from 'react-dom';
import { AttractionHoverProps } from './types';
import { useCardPosition } from '../HiddenGems/hooks/useCardPosition';
import AttractionHoverCard from './AttractionHoverCard';

interface EnhancedAttractionHoverProps extends AttractionHoverProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const AttractionHoverPortal: React.FC<EnhancedAttractionHoverProps> = ({
  attraction,
  isVisible,
  position,
  onWebsiteClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const cardPosition = useCardPosition({
    isVisible,
    position,
    cardWidth: 320,
    cardHeight: 280
  });

  if (!isVisible) return null;

  const cardContent = (
    <div
      className="fixed pointer-events-auto z-50"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        zIndex: 40000
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <AttractionHoverCard
        attraction={attraction}
        onWebsiteClick={onWebsiteClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </div>
  );

  return createPortal(cardContent, document.body);
};

export default AttractionHoverPortal;
