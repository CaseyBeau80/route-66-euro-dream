
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
  const { activeGem, hoverPosition, keepCardVisible, setActiveGem } = useHiddenGemHoverContext();

  // Use the stabilized context state instead of local props
  const shouldShow = activeGem === gem.title;
  const stabilizedPosition = shouldShow ? hoverPosition : position;

  if (!shouldShow) return null;

  console.log(`🔮 Portal rendering STABILIZED hover card for ${gem.title} at position:`, stabilizedPosition);

  return createPortal(
    <div
      onMouseEnter={() => keepCardVisible(gem.title)}
      onMouseLeave={() => setActiveGem(null)}
    >
      <HoverCardDisplay
        gem={gem}
        isVisible={shouldShow}
        position={stabilizedPosition}
        onWebsiteClick={onWebsiteClick}
      />
    </div>,
    document.body
  );
};

export default HoverCardPortal;
