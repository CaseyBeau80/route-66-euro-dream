
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

  // Use the portal root if it exists, otherwise fall back to document.body
  const portalRoot = document.getElementById('map-portal-root') || document.body;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[999999]">
      <AttractionHoverCard
        attraction={attraction}
        isVisible={isVisible}
        position={position}
        onWebsiteClick={onWebsiteClick}
      />
    </div>,
    portalRoot
  );
};

export default AttractionHoverPortal;
