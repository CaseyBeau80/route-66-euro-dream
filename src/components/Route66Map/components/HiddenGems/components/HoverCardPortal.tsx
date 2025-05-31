
import React from 'react';
import { createPortal } from 'react-dom';
import { HiddenGem } from '../types';
import HoverCardDisplay from '../HoverCardDisplay';

interface HoverCardPortalProps {
  gem: HiddenGem;
  isVisible: boolean;
  position: { x: number; y: number };
  onWebsiteClick: (website: string) => void;
}

const HoverCardPortal: React.FC<HoverCardPortalProps> = ({
  gem,
  isVisible,
  position,
  onWebsiteClick
}) => {
  if (!isVisible) return null;

  console.log(`🔮 Portal rendering hover card for ${gem.title} at position:`, position);

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
      <HoverCardDisplay
        gem={gem}
        isVisible={isVisible}
        position={position}
        onWebsiteClick={onWebsiteClick}
      />
    </div>,
    portalRoot
  );
};

export default HoverCardPortal;
