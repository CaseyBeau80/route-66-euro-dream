
import { HiddenGem } from '../types';
import { getMarkerScreenPosition } from './MarkerPositioning';

interface MarkerEventHandlersConfig {
  gem: HiddenGem;
  map: google.maps.Map;
  marker: google.maps.Marker;
  isClicked: boolean;
  updatePosition: (x: number, y: number) => void;
  handleMouseEnter: (gemTitle: string) => void;
  handleMouseLeave: (gemTitle: string) => void;
  clearHover: () => void;
  onMarkerClick: (gem: HiddenGem) => void;
  setIsClicked: (clicked: boolean) => void;
  setClickPosition: (position: { x: number; y: number }) => void;
}

export const createMarkerEventHandlers = ({
  gem,
  map,
  marker,
  isClicked,
  updatePosition,
  handleMouseEnter,
  handleMouseLeave,
  clearHover,
  onMarkerClick,
  setIsClicked,
  setClickPosition
}: MarkerEventHandlersConfig) => {
  const isDriveIn = gem.title.toLowerCase().includes('drive-in');

  const handleMouseOver = () => {
    if (!isClicked) { // Only show hover if not clicked
      console.log(`🐭 Mouse over ${isDriveIn ? 'DRIVE-IN' : 'gem'}: ${gem.title}`);
      const screenPos = getMarkerScreenPosition(map, marker);
      if (screenPos) {
        updatePosition(screenPos.x, screenPos.y);
        handleMouseEnter(gem.title);
      }
    }
  };

  const handleMouseOut = () => {
    if (!isClicked) { // Only hide hover if not clicked
      console.log(`🐭 Mouse out ${isDriveIn ? 'DRIVE-IN' : 'gem'}: ${gem.title}`);
      // Increased delay from 100ms to 500ms to give more time to move to card
      setTimeout(() => {
        handleMouseLeave(gem.title);
      }, 500);
    }
  };

  const handleClick = () => {
    console.log(`🎯 Clicked ${isDriveIn ? 'DRIVE-IN' : 'gem'}: ${gem.title}`);
    
    // Calculate click position
    const screenPos = getMarkerScreenPosition(map, marker);
    if (screenPos) {
      setClickPosition(screenPos);
    }
    
    setIsClicked(true);
    clearHover(); // Clear hover state on click
    onMarkerClick(gem);
  };

  const updateMarkerPosition = () => {
    if (marker && !isClicked) {
      const screenPos = getMarkerScreenPosition(map, marker);
      if (screenPos) {
        updatePosition(screenPos.x, screenPos.y);
      }
    }
  };

  return {
    handleMouseOver,
    handleMouseOut,
    handleClick,
    updateMarkerPosition
  };
};
