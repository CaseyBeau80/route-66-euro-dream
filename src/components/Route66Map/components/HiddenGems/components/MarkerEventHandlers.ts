
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
    // Only show hover if not clicked
    if (!isClicked) {
      console.log(`🐭 Mouse over ${isDriveIn ? 'DRIVE-IN' : 'gem'}: ${gem.title}`);
      const screenPos = getMarkerScreenPosition(map, marker);
      if (screenPos) {
        updatePosition(screenPos.x, screenPos.y);
        handleMouseEnter(gem.title);
      }
    } else {
      console.log(`🚫 Hover blocked - ${gem.title} is already clicked`);
    }
  };

  const handleMouseOut = () => {
    // Only handle mouse out if not clicked
    if (!isClicked) {
      console.log(`🐭 Mouse out ${isDriveIn ? 'DRIVE-IN' : 'gem'}: ${gem.title}`);
      // Reduced timeout to make hover disappear faster when not clicked
      setTimeout(() => {
        if (!isClicked) { // Double check it's still not clicked
          handleMouseLeave(gem.title);
        }
      }, 300);
    }
  };

  const handleClick = () => {
    console.log(`🎯 Clicked ${isDriveIn ? 'DRIVE-IN' : 'gem'}: ${gem.title}`);
    
    // IMMEDIATELY clear hover state before setting clicked state
    clearHover();
    
    // Calculate click position
    const screenPos = getMarkerScreenPosition(map, marker);
    if (screenPos) {
      setClickPosition(screenPos);
    }
    
    // Set clicked state
    setIsClicked(true);
    
    // Call the click handler
    onMarkerClick(gem);
    
    console.log(`✅ Click handled for ${gem.title} - hover cleared, clickable card should show`);
  };

  const updateMarkerPosition = () => {
    // Only update position if not clicked (to prevent hover card repositioning during click)
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
