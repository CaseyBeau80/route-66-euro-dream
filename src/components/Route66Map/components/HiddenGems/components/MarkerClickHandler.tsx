
import React from 'react';
import { HiddenGem } from '../types';

interface MarkerClickHandlerProps {
  gem: HiddenGem;
  onMarkerClick: (gem: HiddenGem) => void;
  map: google.maps.Map;
}

export const MarkerClickHandler: React.FC<MarkerClickHandlerProps> = ({
  gem,
  onMarkerClick,
  map
}) => {
  React.useEffect(() => {
    if (!map) return;

    const handleClick = () => {
      console.log(`🎯 Clicked gem: ${gem.title}`);
      onMarkerClick(gem);
    };

    // Add click listener to the map for this specific gem location
    const clickListener = google.maps.event.addListener(map, 'click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const clickLat = event.latLng.lat();
        const clickLng = event.latLng.lng();
        const gemLat = Number(gem.latitude);
        const gemLng = Number(gem.longitude);
        
        // Check if click is near the gem location (within a small tolerance)
        const tolerance = 0.001;
        if (Math.abs(clickLat - gemLat) < tolerance && Math.abs(clickLng - gemLng) < tolerance) {
          handleClick();
        }
      }
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [gem, onMarkerClick, map]);

  return null;
};
