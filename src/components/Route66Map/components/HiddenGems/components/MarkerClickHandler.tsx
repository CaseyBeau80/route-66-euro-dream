
import React from 'react';
import { HiddenGem } from '../types';

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

    // Create an invisible marker for click handling with larger clickable area
    const clickMarker = new google.maps.Marker({
      position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
      map: map,
      icon: {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0idHJhbnNwYXJlbnQiLz48L3N2Zz4K', // Transparent 40x40 circle
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      },
      title: `Click to open: ${gem.title}`,
      zIndex: 999 // Lower than visual marker but higher than map
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
