
import React from 'react';
import { createPortal } from 'react-dom';
import { HiddenGem } from '../types';
import HoverCardDisplay from '../HoverCardDisplay';
import { useHiddenGemHoverContext } from '../contexts/HiddenGemHoverContext';

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
  const { keepCardVisible, setActiveGem } = useHiddenGemHoverContext();

  if (!isVisible) return null;

  console.log(`🔮 Portal rendering hover card for ${gem.title} at position:`, position);

  return createPortal(
    <div
      onMouseEnter={() => keepCardVisible(gem.title)}
      onMouseLeave={() => setActiveGem(null)}
    >
      <HoverCardDisplay
        gem={gem}
        isVisible={isVisible}
        position={position}
        onWebsiteClick={onWebsiteClick}
      />
    </div>,
    document.body
  );
};

export default HoverCardPortal;
