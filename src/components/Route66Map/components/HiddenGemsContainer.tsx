
import React from 'react';
import { useHiddenGems } from './HiddenGems/useHiddenGems';
import { useHiddenGemInteraction } from './HiddenGems/hooks/useHiddenGemInteraction';
import HiddenGemCustomOverlay from './HiddenGems/HiddenGemCustomOverlay';
import { HiddenGemsProps } from './HiddenGems/types';

const HiddenGemsContainer: React.FC<HiddenGemsProps> = ({ map, onGemClick }) => {
  const { hiddenGems, loading } = useHiddenGems();
  const { activeGem, handleMarkerClick, handleWebsiteClick, closeActiveGem } = useHiddenGemInteraction(onGemClick);

  if (loading) {
    console.log('⏳ Hidden gems still loading...');
    return null;
  }

  console.log(`🗺️ Rendering ${hiddenGems.length} vintage Route 66 hidden gems on map with Google Maps overlay system`);

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

      {/* Render all markers for interaction */}
      {hiddenGems.map((gem) => (
        <HiddenGemMarker
          key={`hidden-gem-marker-${gem.id}`}
          gem={gem}
          onMarkerClick={handleMarkerClick}
          map={map}
        />
      ))}
    </>
  );
};

// Simple marker component for interaction only
const HiddenGemMarker: React.FC<{
  gem: any;
  onMarkerClick: (gem: any) => void;
  map: google.maps.Map;
}> = ({ gem, onMarkerClick, map }) => {
  React.useEffect(() => {
    if (!map) return;

    // Create a simple marker for clicking
    const marker = new google.maps.Marker({
      position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#dc2626',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      title: `Hidden Gem: ${gem.title}`,
      zIndex: 1000
    });

    const handleClick = () => {
      console.log(`🎯 Clicked gem: ${gem.title}`);
      onMarkerClick(gem);
    };

    marker.addListener('click', handleClick);

    return () => {
      marker.setMap(null);
    };
  }, [gem, map, onMarkerClick]);

  return null;
};

export default HiddenGemsContainer;
