
import React, { useEffect } from 'react';
import HiddenGemCustomMarker from './HiddenGems/HiddenGemCustomMarker';
import { HiddenGemHoverProvider } from './HiddenGems/contexts/HiddenGemHoverContext';
import { useHiddenGems } from './HiddenGems/useHiddenGems';
import type { HiddenGem } from './HiddenGems/types';

interface HiddenGemsContainerProps {
  map: google.maps.Map;
  selectedState?: string | null;
  onGemClick: (gem: HiddenGem) => void;
}

const HiddenGemsContainer: React.FC<HiddenGemsContainerProps> = ({
  map,
  selectedState,
  onGemClick
}) => {
  const { hiddenGems, loading } = useHiddenGems();

  useEffect(() => {
    console.log('✨ HiddenGemsContainer: Rendering with enhanced hover system');
    console.log(`📍 Managing ${hiddenGems?.length || 0} hidden gems`);
    
    if (selectedState) {
      console.log(`🗺️ Filtering by state: ${selectedState}`);
    }
    
    return () => {
      console.log('🧹 HiddenGemsContainer: Cleaning up hidden gems');
    };
  }, [hiddenGems?.length, selectedState]);

  if (!map || loading || !hiddenGems?.length) {
    console.log('✨ HiddenGemsContainer: No map, loading, or no hidden gems available');
    return null;
  }

  // Filter gems by selected state if applicable - using location instead of state
  const filteredGems = selectedState 
    ? hiddenGems.filter(gem => 
        gem.location?.toLowerCase().includes(selectedState.toLowerCase())
      )
    : hiddenGems;

  console.log('✨ HiddenGemsContainer: Rendering hover-enhanced hidden gems with advanced positioning');

  return (
    <HiddenGemHoverProvider>
      {filteredGems.map((gem, index) => (
        <HiddenGemCustomMarker
          key={`hidden-gem-${gem.id || index}`}
          gem={gem}
          isActive={false}
          onMarkerClick={onGemClick}
          onWebsiteClick={(website) => {
            console.log(`🔗 Opening website: ${website}`);
            window.open(website, '_blank');
          }}
          map={map}
        />
      ))}
    </HiddenGemHoverProvider>
  );
};

export default HiddenGemsContainer;
