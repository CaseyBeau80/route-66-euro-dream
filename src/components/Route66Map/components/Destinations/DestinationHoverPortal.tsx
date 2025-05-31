
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

  // Better positioning to ensure card is always visible
  const adjustedPosition = {
    x: Math.min(Math.max(10, position.x), window.innerWidth - 330), // Card width + margin
    y: Math.max(10, Math.min(position.y - 160, window.innerHeight - 200)) // Adjust based on card height
  };

  console.log(`📍 Adjusted position for ${destination.name}:`, adjustedPosition);

  return createPortal(
    <div
      className="fixed pointer-events-auto z-[100000] transition-opacity duration-200"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
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
