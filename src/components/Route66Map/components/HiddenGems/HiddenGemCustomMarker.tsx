
import React from 'react';
import { HiddenGem } from './types';
import MarkerInteractionHandler from './components/MarkerInteractionHandler';
import MarkerElement from './components/MarkerElement';
import MarkerClickHandler from './components/MarkerClickHandler';
import HoverCardDisplay from './HoverCardDisplay';

interface HiddenGemCustomMarkerProps {
  gem: HiddenGem;
  isActive: boolean;
  onMarkerClick: (gem: HiddenGem) => void;
  onWebsiteClick: (website: string) => void;
  map: google.maps.Map;
}

const HiddenGemCustomMarker: React.FC<HiddenGemCustomMarkerProps> = ({
  gem,
  isActive,
  onMarkerClick,
  onWebsiteClick,
  map
}) => {
  console.log(`Rendering custom gem marker: ${gem.title} at ${gem.latitude}, ${gem.longitude}`);

  return (
    <MarkerInteractionHandler gem={gem}>
      {({ isHovered, hoverPosition, handleMouseEnter, handleMouseLeave, updatePosition, cleanup }) => (
        <>
          <MarkerElement
            gem={gem}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onPositionUpdate={updatePosition}
            map={map}
          />
          
          <MarkerClickHandler
            gem={gem}
            onMarkerClick={onMarkerClick}
            map={map}
          />
          
          {/* Render the hover card within the map container */}
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 999999 }}>
              <HoverCardDisplay
                gem={gem}
                isVisible={isHovered}
                position={hoverPosition}
                onWebsiteClick={onWebsiteClick}
              />
            </div>
          )}
        </>
      )}
    </MarkerInteractionHandler>
  );
};

export default HiddenGemCustomMarker;
