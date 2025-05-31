
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
  if (!isVisible) return null;

  const portalRoot = document.getElementById('map-portal-root') || document.body;

  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 280), // Card width + padding
    y: Math.max(20, position.y - 150) // Adjust to show above cursor
  };

  return createPortal(
    <div
      className="fixed pointer-events-auto z-[100000] transition-opacity duration-200"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        opacity: isVisible ? 1 : 0
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <DestinationHoverCard destination={destination} />
    </div>,
    portalRoot
  );
};

export default DestinationHoverPortal;
