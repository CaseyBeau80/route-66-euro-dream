
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiddenGem } from './types';
import HoverableMarker from './components/HoverableMarker';
import { generateHiddenGemUrl } from '@/utils/slugUtils';

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
  const navigate = useNavigate();
  
  console.log(`🔧 Rendering simplified gem marker: ${gem.title} at ${gem.latitude}, ${gem.longitude}`);

  const handleGemClick = (clickedGem: HiddenGem) => {
    console.log(`💎 Hidden gem clicked: ${clickedGem.title}`);
    
    // Call the original callback if provided
    if (onMarkerClick) {
      onMarkerClick(clickedGem);
    }
    
    // Navigate to the detail page
    const url = generateHiddenGemUrl(clickedGem);
    navigate(url);
  };

  return (
    <HoverableMarker
      gem={gem}
      onMarkerClick={handleGemClick}
      onWebsiteClick={onWebsiteClick}
      map={map}
    />
  );
};

export default HiddenGemCustomMarker;
