
import React from 'react';
import { HiddenGem } from './types';
import HoverableMarker from './components/HoverableMarker';
import { useHiddenGemHoverContext } from './contexts/HiddenGemHoverContext';

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
  console.log(`🔧 Rendering simplified gem marker: ${gem.title} at ${gem.latitude}, ${gem.longitude}`);

  return (
    <HoverableMarker
      gem={gem}
      onMarkerClick={onMarkerClick}
      onWebsiteClick={onWebsiteClick}
      map={map}
    />
  );
};

export default HiddenGemCustomMarker;
