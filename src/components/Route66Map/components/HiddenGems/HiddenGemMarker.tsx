
import React from 'react';
import { Marker } from '@react-google-maps/api';
import { createVintageRoute66Icon } from './VintageRoute66Icon';
import { HiddenGem } from './types';
import HiddenGemHoverCard from './HiddenGemHoverCard';

interface HiddenGemMarkerProps {
  gem: HiddenGem;
  isActive: boolean;
  onMarkerClick: (gem: HiddenGem) => void;
  onWebsiteClick: (website: string) => void;
  map?: google.maps.Map;
}

const HiddenGemMarker: React.FC<HiddenGemMarkerProps> = ({
  gem,
  isActive,
  onMarkerClick,
  onWebsiteClick,
  map
}) => {
  console.log(`Rendering vintage gem marker with hover: ${gem.title} at ${gem.latitude}, ${gem.longitude}`);
  
  return (
    <HiddenGemHoverCard 
      gem={gem} 
      onWebsiteClick={onWebsiteClick}
    >
      <div>
        <Marker
          key={`hidden-gem-${gem.id}`}
          position={{ lat: Number(gem.latitude), lng: Number(gem.longitude) }}
          onClick={() => onMarkerClick(gem)}
          icon={createVintageRoute66Icon()}
          title={`Hidden Gem: ${gem.title}`}
          zIndex={1000}
        />
      </div>
    </HiddenGemHoverCard>
  );
};

export default HiddenGemMarker;
