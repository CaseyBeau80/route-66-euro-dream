
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

  // Enhanced website click handler with navigation to detail page
  const handleWebsiteClick = (website: string) => {
    console.log(`💎 Website clicked for ${gem.title}: ${website}`);
    
    // If website exists, open it
    if (website) {
      onWebsiteClick(website);
    } else {
      // Fallback to detail page navigation
      const url = generateHiddenGemUrl(gem);
      navigate(url);
    }
  };

  // Handle marker click to show hover card, not navigate immediately
  const handleGemClick = (clickedGem: HiddenGem) => {
    console.log(`💎 Hidden gem marker clicked: ${clickedGem.title} - showing hover card`);
    
    // Call the original callback if provided
    if (onMarkerClick) {
      onMarkerClick(clickedGem);
    }
    
    // Don't navigate immediately on marker click - let hover card handle navigation
  };

  return (
    <HoverableMarker
      gem={gem}
      onMarkerClick={handleGemClick}
      onWebsiteClick={handleWebsiteClick}
      map={map}
    />
  );
};

export default HiddenGemCustomMarker;
