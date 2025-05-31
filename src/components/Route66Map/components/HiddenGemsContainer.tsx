
import React from 'react';
import { useHiddenGems } from './HiddenGems/useHiddenGems';
import { useHiddenGemInteraction } from './HiddenGems/hooks/useHiddenGemInteraction';
import HiddenGemMarker from './HiddenGems/HiddenGemMarker';
import HiddenGemInfoWindow from './HiddenGems/HiddenGemInfoWindow';
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
      
      {/* Render the active info window as a sibling */}
      {activeGemObject && (
        <HiddenGemInfoWindow
          key={`hidden-gem-info-${activeGemObject.id}`}
          gem={activeGemObject}
          onClose={closeActiveGem}
          onWebsiteClick={handleWebsiteClick}
          map={map}
        />
      )}
    </>
  );
};

export default HiddenGemsContainer;
