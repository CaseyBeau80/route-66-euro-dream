
import React, { useEffect } from 'react';
import { HiddenGem } from '../types';
import { createVintageRoute66Icon } from '../VintageRoute66Icon';
import { createMarkerSetup } from '../MarkerSetup';
import HoverCardPortal from './HoverCardPortal';
import MarkerInteractionHandler from './MarkerInteractionHandler';

interface HoverableMarkerProps {
  gem: HiddenGem;
  onMarkerClick: (gem: HiddenGem) => void;
  onWebsiteClick: (website: string) => void;
  map: google.maps.Map;
}

const HoverableMarker: React.FC<HoverableMarkerProps> = ({
  gem,
  onMarkerClick,
  onWebsiteClick,
  map
}) => {
  return (
    <MarkerInteractionHandler gem={gem}>
      {({ isHovered, hoverPosition, handleMouseEnter, handleMouseLeave, updatePosition }) => {
        useEffect(() => {
          if (!map) return;

          const { cleanup } = createMarkerSetup({
            gem,
            map,
            onMarkerClick,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onPositionUpdate: updatePosition
          });

          return cleanup;
        }, [map, gem, onMarkerClick, handleMouseEnter, handleMouseLeave, updatePosition]);

        return (
          <HoverCardPortal
            gem={gem}
            isVisible={isHovered}
            position={hoverPosition}
            onWebsiteClick={onWebsiteClick}
          />
        );
      }}
    </MarkerInteractionHandler>
  );
};

export default HoverableMarker;
