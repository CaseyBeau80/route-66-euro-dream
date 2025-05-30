
import React, { useState } from 'react';
import { Marker } from '@react-google-maps/api';
import { useHiddenGems } from './HiddenGems/useHiddenGems';
import { createVintageRoute66Icon } from './HiddenGems/VintageRoute66Icon';
import HiddenGemInfoWindow from './HiddenGems/HiddenGemInfoWindow';
import { HiddenGem, HiddenGemsProps } from './HiddenGems/types';

const HiddenGems: React.FC<HiddenGemsProps> = ({ map, onGemClick }) => {
  const { hiddenGems, loading } = useHiddenGems();
  const [activeGem, setActiveGem] = useState<string | null>(null);

  const handleMarkerClick = (gem: HiddenGem) => {
    console.log('🎯 Hidden gem clicked:', gem.title);
    setActiveGem(activeGem === gem.id ? null : gem.id);
    if (onGemClick) {
      onGemClick(gem);
    }
  };

  const handleWebsiteClick = (website: string) => {
    console.log('🌐 Opening website:', website);
    const url = website.startsWith('http') ? website : `https://${website}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    console.log('⏳ Hidden gems still loading...');
    return null;
  }

  console.log(`🗺️ Rendering ${hiddenGems.length} vintage Route 66 hidden gems on map`);

  return (
    <>
      {hiddenGems.map((gem) => {
        console.log(`Rendering vintage gem: ${gem.title} at ${gem.latitude}, ${gem.longitude}`);
        return (
          <Marker
            key={`hidden-gem-${gem.id}`}
            position={{ lat: Number(gem.latitude), lng: Number(gem.longitude) }}
            onClick={() => handleMarkerClick(gem)}
            icon={createVintageRoute66Icon()}
            title={`Hidden Gem: ${gem.title}`}
            zIndex={1000}
          >
            {activeGem === gem.id && (
              <HiddenGemInfoWindow
                gem={gem}
                onClose={() => setActiveGem(null)}
                onWebsiteClick={handleWebsiteClick}
              />
            )}
          </Marker>
        );
      })}
    </>
  );
};

export default HiddenGems;
