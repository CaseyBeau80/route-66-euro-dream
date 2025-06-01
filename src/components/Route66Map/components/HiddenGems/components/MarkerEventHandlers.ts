
import { HiddenGem } from '../types';
import { getMarkerScreenPosition } from './MarkerPositioning';

interface MarkerEventHandlersConfig {
  gem: HiddenGem;
  map: google.maps.Map;
  marker: google.maps.Marker;
  updatePosition: (x: number, y: number) => void;
  handleMouseEnter: (gemTitle: string) => void;
  handleMouseLeave: (gemTitle: string) => void;
}

export const createMarkerEventHandlers = ({
  gem,
  map,
  marker,
  updatePosition,
  handleMouseEnter,
  handleMouseLeave
}: MarkerEventHandlersConfig) => {
  const isDriveIn = gem.title.toLowerCase().includes('drive-in') || 
                   gem.title.toLowerCase().includes('drive in') ||
                   gem.title.toLowerCase().includes('theater') ||
                   gem.title.toLowerCase().includes('theatre');

  const handleMouseOver = () => {
    console.log(`🐭 Mouse over ${isDriveIn ? 'DRIVE-IN' : 'gem'}: ${gem.title}`);
    const screenPos = getMarkerScreenPosition(map, marker);
    if (screenPos) {
      updatePosition(screenPos.x, screenPos.y);
      handleMouseEnter(gem.title);
    }
  };

  const handleMouseOut = () => {
    console.log(`🐭 Mouse out ${isDriveIn ? 'DRIVE-IN' : 'gem'}: ${gem.title}`);
    setTimeout(() => {
      handleMouseLeave(gem.title);
    }, 300);
  };

  const updateMarkerPosition = () => {
    if (marker) {
      const screenPos = getMarkerScreenPosition(map, marker);
      if (screenPos) {
        updatePosition(screenPos.x, screenPos.y);
      }
    }
  };

  return {
    handleMouseOver,
    handleMouseOut,
    updateMarkerPosition
  };
};
