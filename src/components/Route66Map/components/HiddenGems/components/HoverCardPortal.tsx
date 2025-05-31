
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

  return createPortal(
    <HoverCardDisplay
      gem={gem}
      isVisible={isVisible}
      position={position}
      onWebsiteClick={onWebsiteClick}
    />,
    document.body
  );
};

export default HoverCardPortal;
