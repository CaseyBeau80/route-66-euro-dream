
import React from 'react';
import { useHiddenGems } from './HiddenGems/useHiddenGems';
import { useHiddenGemInteraction } from './HiddenGems/hooks/useHiddenGemInteraction';
import HiddenGemMarker from './HiddenGems/HiddenGemMarker';
import HiddenGemCustomOverlay from './HiddenGems/HiddenGemCustomOverlay';
import { HiddenGemsProps } from './HiddenGems/types';

const HiddenGemsContainer: React.FC<HiddenGemsProps> = ({ map, onGemClick }) => {
  const { hiddenGems, loading } = useHiddenGems();
  const { activeGem, handleMarkerClick, handleWebsiteClick, closeActiveGem } = useHiddenGemInteraction(onGemClick);

  if (loading) {
    console.log('⏳ Hidden gems still loading...');
    return null;
  }

  console.log(`🗺️ Rendering ${hiddenGems.length} vintage Route 66 hidden gems on map`);

  // Find the active gem object
  const activeGemObject = hiddenGems.find(gem => gem.id === activeGem);

  return (
    <>
      {/* Render all markers */}
      {hiddenGems.map((gem) => (
        <HiddenGemMarker
          key={`hidden-gem-marker-${gem.id}`}
          gem={gem}
          isActive={activeGem === gem.id}
          onMarkerClick={handleMarkerClick}
          map={map}
        />
      ))}
      
      {/* Render the active custom overlay */}
      {activeGemObject && (
        <HiddenGemCustomOverlay
          key={`hidden-gem-overlay-${activeGemObject.id}`}
          gem={activeGemObject}
          map={map}
          onClose={closeActiveGem}
          onWebsiteClick={handleWebsiteClick}
        />
      )}
    </>
  );
};

export default HiddenGemsContainer;
