
import React from 'react';
import { useHiddenGems } from './HiddenGems/useHiddenGems';
import { useHiddenGemInteraction } from './HiddenGems/hooks/useHiddenGemInteraction';
import HiddenGemCustomMarker from './HiddenGems/HiddenGemCustomMarker';
import { HiddenGemsProps } from './HiddenGems/types';

const HiddenGemsContainer: React.FC<HiddenGemsProps> = ({ map, onGemClick }) => {
  const { hiddenGems, loading } = useHiddenGems();
  const { activeGem, handleMarkerClick, handleWebsiteClick, closeActiveGem } = useHiddenGemInteraction(onGemClick);

  if (loading) {
    console.log('⏳ Hidden gems still loading...');
    return null;
  }

  console.log(`🗺️ Rendering ${hiddenGems.length} vintage Route 66 hidden gems on map with custom hover overlays`);

  return (
    <>
      {/* Render all markers with custom hover overlays */}
      {hiddenGems.map((gem) => (
        <HiddenGemCustomMarker
          key={`hidden-gem-custom-marker-${gem.id}`}
          gem={gem}
          isActive={activeGem === gem.id}
          onMarkerClick={handleMarkerClick}
          onWebsiteClick={handleWebsiteClick}
          map={map}
        />
      ))}
    </>
  );
};

export default HiddenGemsContainer;
