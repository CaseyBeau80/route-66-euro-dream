
import React from 'react';
import { HiddenGem } from '../types';
import { createVintageRoute66Icon } from '../VintageRoute66Icon';

interface MarkerClickHandlerProps {
  gem: HiddenGem;
  onMarkerClick: (gem: HiddenGem) => void;
  map: google.maps.Map;
}

const MarkerClickHandler: React.FC<MarkerClickHandlerProps> = ({
  gem,
  onMarkerClick,
  map
}) => {
  React.useEffect(() => {
    if (!map) return;

    // Create a separate invisible marker just for click handling
    const clickMarker = new google.maps.Marker({
      position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
      map: map,
      icon: {
        ...createVintageRoute66Icon(),
        opacity: 0 // Make it invisible
      },
      title: `Hidden Gem: ${gem.title}`,
      zIndex: 1001 // Higher than the visual marker
    });

    const handleClick = () => {
      console.log(`🎯 Clicked gem: ${gem.title}`);
      onMarkerClick(gem);
    };

    clickMarker.addListener('click', handleClick);

    return () => {
      clickMarker.setMap(null);
    };
  }, [gem, map, onMarkerClick]);

  return null;
};

export default MarkerClickHandler;
