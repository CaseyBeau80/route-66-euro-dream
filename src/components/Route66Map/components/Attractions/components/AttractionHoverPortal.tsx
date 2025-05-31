
import React from 'react';
import { createPortal } from 'react-dom';
import { AttractionHoverProps } from '../types';
import AttractionHoverCard from '../AttractionHoverCard';

const AttractionHoverPortal: React.FC<AttractionHoverProps> = ({
  attraction,
  isVisible,
  position,
  onWebsiteClick
}) => {
  if (!isVisible) return null;

  console.log(`🔮 Portal rendering attraction hover card for ${attraction.name} at position:`, position);

  return createPortal(
    <AttractionHoverCard
      attraction={attraction}
      isVisible={isVisible}
      position={position}
      onWebsiteClick={onWebsiteClick}
    />,
    document.body
  );
};

export default AttractionHoverPortal;
