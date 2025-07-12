
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

  // Updated card dimensions to account for expanded tiles
  const cardWidth = 320;
  const cardHeight = 500; // Increased height to accommodate expanded weather content
  const margin = 20;

  // Better positioning to ensure card is always visible within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  let adjustedX = position.x;
  let adjustedY = position.y;

  // Horizontal positioning - prefer to show to the right of marker
  if (position.x + cardWidth + margin > viewportWidth) {
    // Position to the left of the marker
    adjustedX = position.x - cardWidth - margin;
  } else {
    // Position to the right of the marker
    adjustedX = position.x + margin;
  }

  // Vertical positioning - prefer to show above marker to avoid cut-off
  if (position.y + cardHeight + margin > viewportHeight) {
    // Position above the marker
    adjustedY = position.y - cardHeight - margin;
    // If it would go off the top, position it at the top with some margin
    if (adjustedY < margin) {
      adjustedY = margin;
    }
  } else {
    // Position below the marker
    adjustedY = position.y + margin;
  }

  // Ensure card doesn't go off-screen with extra safety margins
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
      className="fixed pointer-events-auto z-[100000] transition-all duration-200"
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
        opacity: isVisible ? 1 : 0,
        transform: 'translateZ(0)',
        willChange: 'opacity, transform',
        maxHeight: '90vh',
        overflow: 'visible'
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
