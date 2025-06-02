
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

  // REMOVED: Drive-in filtering since we now have a dedicated DriveInsContainer
  // All hidden gems will be shown as regular gems
  const nonDriveInGems = hiddenGems.filter(gem => {
    const title = gem.title.toLowerCase();
    const desc = gem.description?.toLowerCase() || '';
    return !(title.includes('drive-in') || 
           title.includes('drive in') ||
           title.includes('theater') ||
           title.includes('theatre') ||
           desc.includes('drive-in') ||
           desc.includes('drive in') ||
           desc.includes('theater') ||
           desc.includes('theatre'));
  });

  console.log(`🗺️ HiddenGemsContainer: Rendering ${nonDriveInGems.length} NON-DRIVE-IN hidden gems (${hiddenGems.length - nonDriveInGems.length} drive-ins filtered out for dedicated system)`);

  return (
    <>
      {/* Render active gem overlay if one is selected */}
      {activeGem && (
        (() => {
          const gem = nonDriveInGems.find(g => g.id === activeGem);
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

      {/* Render all NON-DRIVE-IN markers with hover functionality */}
      {nonDriveInGems.map((gem) => (
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
