
import React from 'react';
import { Marker } from '@react-google-maps/api';
import { createVintageRoute66Icon } from './VintageRoute66Icon';
import { HiddenGem } from './types';

interface HiddenGemMarkerProps {
  gem: HiddenGem;
  isActive: boolean;
  onMarkerClick: (gem: HiddenGem) => void;
  map?: google.maps.Map;
}

const HiddenGemMarker: React.FC<HiddenGemMarkerProps> = ({
  gem,
  isActive,
  onMarkerClick,
  map
}) => {
  console.log(`Rendering vintage gem marker: ${gem.title} at ${gem.latitude}, ${gem.longitude}`);
  
  return (
    <Marker
      key={`hidden-gem-${gem.id}`}
      position={{ lat: Number(gem.latitude), lng: Number(gem.longitude) }}
      onClick={() => onMarkerClick(gem)}
      icon={createVintageRoute66Icon()}
      title={`Hidden Gem: ${gem.title}`}
      zIndex={1000}
    />
  );
};

export default HiddenGemMarker;
