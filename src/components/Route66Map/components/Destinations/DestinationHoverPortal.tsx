
import React from 'react';
import { createPortal } from 'react-dom';
import DestinationHoverCard from './DestinationHoverCard';
import type { Route66Waypoint } from '../../types/supabaseTypes';

interface DestinationHoverPortalProps {
  destination: Route66Waypoint;
  position: { x: number; y: number };
  isVisible: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const DestinationHoverPortal: React.FC<DestinationHoverPortalProps> = ({
  destination,
  position,
  isVisible,
  onMouseEnter,
  onMouseLeave
}) => {
  if (!isVisible) {
    console.log(`🚫 Hover card not visible for ${destination.name}`);
    return null;
  }

  console.log(`🏛️ SHOWING hover card for ${destination.name} at position:`, position);

  const portalRoot = document.getElementById('map-portal-root') || document.body;

  // Card dimensions (approximate)
  const cardWidth = 320;
  const cardHeight = 200;
  const margin = 20;

  // Better positioning to ensure card is always visible within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  let adjustedX = position.x;
  let adjustedY = position.y;

  // Horizontal positioning
  if (position.x + cardWidth + margin > viewportWidth) {
    // Position to the left of the marker
    adjustedX = position.x - cardWidth - margin;
  } else {
    // Position to the right of the marker
    adjustedX = position.x + margin;
  }

  // Vertical positioning
  if (position.y + cardHeight + margin > viewportHeight) {
    // Position above the marker
    adjustedY = position.y - cardHeight - margin;
  } else {
    // Position below the marker
    adjustedY = position.y + margin;
  }

  // Ensure card doesn't go off-screen
  adjustedX = Math.max(margin, Math.min(adjustedX, viewportWidth - cardWidth - margin));
  adjustedY = Math.max(margin, Math.min(adjustedY, viewportHeight - cardHeight - margin));

  console.log(`📍 Adjusted position for ${destination.name}:`, {
    original: position,
    adjusted: { x: adjustedX, y: adjustedY },
    viewport: { width: viewportWidth, height: viewportHeight },
    cardSize: { width: cardWidth, height: cardHeight }
  });

  return createPortal(
    <div
      className="fixed pointer-events-auto z-[100000] transition-opacity duration-200"
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
        opacity: isVisible ? 1 : 0,
        transform: 'translateZ(0)', // Force hardware acceleration
        willChange: 'opacity, transform'
      }}
      onMouseEnter={() => {
        console.log(`🏛️ Mouse entered hover card for ${destination.name}`);
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        console.log(`🏛️ Mouse left hover card for ${destination.name}`);
        onMouseLeave?.();
      }}
    >
      <DestinationHoverCard destination={destination} />
    </div>,
    portalRoot
  );
};

export default DestinationHoverPortal;
