
import React, { useEffect, useState } from 'react';
import { useHiddenGems } from './HiddenGems/useHiddenGems';
import HiddenGemCustomMarker from './HiddenGems/HiddenGemCustomMarker';
import { HiddenGemHoverProvider } from './HiddenGems/contexts/HiddenGemHoverContext';
import type { HiddenGem } from './HiddenGems/types';

interface HiddenGemsContainerProps {
  map: google.maps.Map | null;
  selectedState: string | null;
  isVisible?: boolean;
  onGemClick?: (gem: HiddenGem) => void;
  onWebsiteClick?: (website: string) => void;
}

const HiddenGemsContainer: React.FC<HiddenGemsContainerProps> = ({
  map,
  selectedState,
  isVisible = true,
  onGemClick,
  onWebsiteClick = (url) => window.open(url, '_blank')
}) => {
  const [activeGem, setActiveGem] = useState<HiddenGem | null>(null);
  const { 
    gems,
    isLoading,
    error 
  } = useHiddenGems();

  console.log(`💎 HiddenGemsContainer: Rendering with ${gems?.length || 0} hidden gems`, {
    selectedState,
    isVisible,
    isLoading,
    error: !!error
  });

  useEffect(() => {
    console.log('💎 HiddenGemsContainer: Initializing with improved hover behavior');
    
    return () => {
      console.log('🧹 HiddenGemsContainer: Cleaning up');
    };
  }, []);

  if (!isVisible || !map || isLoading || error || !gems?.length) {
    if (isLoading) console.log('💎 HiddenGemsContainer: Loading gems...');
    if (error) console.log('💎 HiddenGemsContainer: Error loading gems:', error);
    if (!gems?.length) console.log('💎 HiddenGemsContainer: No gems available');
    return null;
  }

  // Filter gems by selected state if applicable
  const filteredGems = selectedState 
    ? gems.filter(gem => 
        gem.state?.toLowerCase() === selectedState.toLowerCase()
      )
    : gems;

  console.log(`💎 HiddenGemsContainer: Showing ${filteredGems.length} hidden gems (filtered by state: ${selectedState || 'none'})`);

  const handleGemClick = (gem: HiddenGem) => {
    console.log(`💎 HiddenGemsContainer: Gem clicked - ${gem.title}`);
    setActiveGem(gem);
    onGemClick?.(gem);
  };

  return (
    <HiddenGemHoverProvider>
      {filteredGems.map((gem) => (
        <HiddenGemCustomMarker
          key={gem.id}
          gem={gem}
          isActive={activeGem?.id === gem.id}
          onMarkerClick={handleGemClick}
          onWebsiteClick={onWebsiteClick}
          map={map}
        />
      ))}
    </HiddenGemHoverProvider>
  );
};

export default HiddenGemsContainer;
