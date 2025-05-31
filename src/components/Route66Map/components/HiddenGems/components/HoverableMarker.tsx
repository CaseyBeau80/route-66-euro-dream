
import React, { useEffect } from 'react';
import { HiddenGem } from '../types';
import { createVintageRoute66Icon } from '../VintageRoute66Icon';
import { createMarkerSetup } from '../MarkerSetup';
import HoverCardPortal from './HoverCardPortal';
import { useHiddenGemHoverContext } from '../contexts/HiddenGemHoverContext';

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
  const { setActiveGem } = useHiddenGemHoverContext();

  useEffect(() => {
    if (!map) return;

    const handleMouseEnter = (event: MouseEvent) => {
      console.log(`💎 Stabilized mouse enter for hidden gem: ${gem.title}`);
      setActiveGem(gem.title, { x: event.clientX + 10, y: event.clientY - 10 });
    };

    const handleMouseLeave = () => {
      console.log(`💎 Stabilized mouse leave for hidden gem: ${gem.title}`);
      setActiveGem(null);
    };

    const handlePositionUpdate = (x: number, y: number) => {
      // Only update position if this gem is currently active to prevent flickering
      setActiveGem(gem.title, { x, y });
    };

    const { cleanup } = createMarkerSetup({
      gem,
      map,
      onMarkerClick,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onPositionUpdate: handlePositionUpdate
    });

    return cleanup;
  }, [map, gem, onMarkerClick, setActiveGem]);

  return (
    <HoverCardPortal
      gem={gem}
      isVisible={false} // This will be overridden by the context
      position={{ x: 0, y: 0 }} // This will be overridden by the context
      onWebsiteClick={onWebsiteClick}
    />
  );
};

export default HoverableMarker;
