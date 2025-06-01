
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

  // Enhanced drive-in detection
  const driveInGems = hiddenGems.filter(gem => {
    const title = gem.title.toLowerCase();
    const desc = gem.description?.toLowerCase() || '';
    return title.includes('drive-in') || 
           title.includes('drive in') ||
           title.includes('theater') ||
           title.includes('theatre') ||
           desc.includes('drive-in') ||
           desc.includes('drive in') ||
           desc.includes('theater') ||
           desc.includes('theatre');
  });

  console.log(`🎬 Found ${driveInGems.length} drive-in theaters in hidden gems:`, driveInGems.map(d => d.title));
  console.log(`🗺️ Rendering ${hiddenGems.length} total vintage Route 66 hidden gems on map with custom icons`);

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

      {/* Render all markers with hover functionality */}
      {hiddenGems.map((gem) => (
        <HiddenGemCustomMarker
          key={`hidden-gem-marker-${gem.id}`}
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
