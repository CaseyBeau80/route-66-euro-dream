
import React from 'react';
import { useHiddenGems } from './HiddenGems/useHiddenGems';
import HiddenGemCustomMarker from './HiddenGems/HiddenGemCustomMarker';
import { HiddenGemsProps } from './HiddenGems/types';

const HiddenGemsContainer: React.FC<HiddenGemsProps> = ({ map, onGemClick }) => {
  const { hiddenGems, loading } = useHiddenGems();

  if (loading) {
    console.log('⏳ Hidden gems still loading...');
    return null;
  }

  console.log(`💎 HiddenGemsContainer: Rendering ${hiddenGems.length} hidden gems from hidden_gems table only`);

  return (
    <>

      {/* Render all hidden gem markers with hover functionality */}
      {hiddenGems.map((gem) => {
        console.log(`💎 Rendering marker for: ${gem.title} at ${gem.latitude}, ${gem.longitude}`);
        return (
          <HiddenGemCustomMarker
            key={`hidden-gem-marker-${gem.id}`}
            gem={gem}
            isActive={false}
            onMarkerClick={onGemClick}
            onWebsiteClick={(website) => window.open(website, '_blank')}
            map={map}
          />
        );
      })}
    </>
  );
};

export default HiddenGemsContainer;
