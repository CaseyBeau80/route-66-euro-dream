
import React from 'react';
import { useHiddenGems } from './HiddenGems/useHiddenGems';
import { useHiddenGemInteraction } from './HiddenGems/hooks/useHiddenGemInteraction';
import HiddenGemCustomOverlay from './HiddenGems/HiddenGemCustomOverlay';
import HiddenGemCustomMarker from './HiddenGems/HiddenGemCustomMarker';
import { HiddenGemsProps } from './HiddenGems/types';

const HiddenGemsContainer: React.FC<HiddenGemsProps> = ({ map, onGemClick }) => {
  const { hiddenGems, loading } = useHiddenGems();
  const { activeGem, handleMarkerClick, handleWebsiteClick, closeActiveGem } = useHiddenGemInteraction(onGemClick);

  if (loading) {
    console.log('⏳ Hidden gems still loading...');
    return null;
  }

  console.log(`💎 HiddenGemsContainer: Rendering ${hiddenGems.length} hidden gems from hidden_gems table only`);

  return (
    <>
      {/* Render active gem overlay if one is selected */}
      {activeGem && (
        (() => {
          const gem = hiddenGems.find(g => g.id === activeGem);
          return gem ? (
            <HiddenGemCustomOverlay
              key={`hidden-gem-overlay-${gem.id}`}
              gem={gem}
              map={map}
              onClose={closeActiveGem}
              onWebsiteClick={handleWebsiteClick}
            />
          ) : null;
        })()
      )}

      {/* Render all hidden gem markers with hover functionality */}
      {hiddenGems.map((gem) => {
        console.log(`💎 Rendering marker for: ${gem.title} at ${gem.latitude}, ${gem.longitude}`);
        return (
          <HiddenGemCustomMarker
            key={`hidden-gem-marker-${gem.id}`}
            gem={gem}
            isActive={activeGem === gem.id}
            onMarkerClick={handleMarkerClick}
            onWebsiteClick={handleWebsiteClick}
            map={map}
          />
        );
      })}
    </>
  );
};

export default HiddenGemsContainer;
