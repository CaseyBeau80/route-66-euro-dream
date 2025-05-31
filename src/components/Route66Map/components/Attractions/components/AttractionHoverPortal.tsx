
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

  // Use the dedicated hover portal root
  const portalRoot = document.getElementById('hover-portal-root') || document.body;

  return createPortal(
    <div 
      className="fixed pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999
      }}
    >
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
