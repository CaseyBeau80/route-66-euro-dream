
import React from 'react';
import { Marker } from '@react-google-maps/api';
import { createVintageRoute66Icon } from './VintageRoute66Icon';
import HiddenGemInfoWindow from './HiddenGemInfoWindow';
import { HiddenGem } from './types';

interface HiddenGemMarkerProps {
  gem: HiddenGem;
  isActive: boolean;
  onMarkerClick: (gem: HiddenGem) => void;
  onClose: () => void;
  onWebsiteClick: (website: string) => void;
  map?: google.maps.Map;
}

const HiddenGemMarker: React.FC<HiddenGemMarkerProps> = ({
  gem,
  isActive,
  onMarkerClick,
  onClose,
  onWebsiteClick,
  map
}) => {
  console.log(`Rendering vintage gem: ${gem.title} at ${gem.latitude}, ${gem.longitude}`);
  
  return (
    <Marker
      key={`hidden-gem-${gem.id}`}
      position={{ lat: Number(gem.latitude), lng: Number(gem.longitude) }}
      onClick={() => onMarkerClick(gem)}
      icon={createVintageRoute66Icon()}
      title={`Hidden Gem: ${gem.title}`}
      zIndex={1000}
    >
      {isActive && (
        <HiddenGemInfoWindow
          gem={gem}
          onClose={onClose}
          onWebsiteClick={onWebsiteClick}
          map={map}
        />
      )}
    </Marker>
  );
};

export default HiddenGemMarker;
