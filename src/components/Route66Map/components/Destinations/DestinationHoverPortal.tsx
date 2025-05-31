
import React from 'react';
import { createPortal } from 'react-dom';
import DestinationHoverCard from './DestinationHoverCard';
import type { Route66Waypoint } from '../../types/supabaseTypes';

interface DestinationHoverPortalProps {
  destination: Route66Waypoint;
  position: { x: number; y: number };
  isVisible: boolean;
}

const DestinationHoverPortal: React.FC<DestinationHoverPortalProps> = ({
  destination,
  position,
  isVisible
}) => {
  if (!isVisible) return null;

  console.log(`🔮 Portal rendering destination hover card for ${destination.name} at position:`, position);

  // Use the portal root if it exists, otherwise fall back to document.body
  const portalRoot = document.getElementById('map-portal-root') || document.body;

  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 280), // Card width + padding
    y: Math.max(20, position.y - 150) // Adjust to show above cursor
  };

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[999999]">
      <div
        className="absolute transition-opacity duration-200"
        style={{
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`,
          opacity: isVisible ? 1 : 0,
          pointerEvents: 'auto'
        }}
      >
        <DestinationHoverCard destination={destination} />
      </div>
    </div>,
    portalRoot
  );
};

export default DestinationHoverPortal;
