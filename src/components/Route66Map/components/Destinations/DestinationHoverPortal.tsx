
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

  // Use the dedicated hover portal root
  const portalRoot = document.getElementById('hover-portal-root') || document.body;

  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 280), // Card width + padding
    y: Math.max(20, position.y - 150) // Adjust to show above cursor
  };

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
      <div
        className="absolute transition-opacity duration-200 pointer-events-auto"
        style={{
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`,
          opacity: isVisible ? 1 : 0
        }}
      >
        <DestinationHoverCard destination={destination} />
      </div>
    </div>,
    portalRoot
  );
};

export default DestinationHoverPortal;
