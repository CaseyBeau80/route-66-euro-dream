
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
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+', // Transparent 1x1 SVG
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
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
