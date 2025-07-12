
import { HiddenGem } from '../types';

interface MarkerEventHandlersConfig {
  gem: HiddenGem;
  map: google.maps.Map;
  marker: google.maps.Marker;
  updatePosition: (x: number, y: number) => void;
  handleMouseEnter: (gemTitle: string) => void;
  handleMouseLeave: (gemTitle: string) => void;
  onMarkerClick?: (gem: HiddenGem) => void;
}

export const createMarkerEventHandlers = ({
  gem,
  map,
  marker,
  updatePosition,
  handleMouseEnter,
  handleMouseLeave,
  onMarkerClick
}: MarkerEventHandlersConfig) => {
  
  const updateMarkerPosition = () => {
    try {
      const position = marker.getPosition();
      if (!position) {
        console.warn(`⚠️ No position found for marker: ${gem.title}`);
        return;
      }

      const projection = map.getProjection();
      if (!projection) {
        console.warn(`⚠️ No projection found for map`);
        return;
      }

      // Get the map container element
      const mapDiv = map.getDiv();
      if (!mapDiv) {
        console.warn(`⚠️ No map div found`);
        return;
      }

      // Convert lat/lng to pixel coordinates
      const bounds = map.getBounds();
      const ne = bounds?.getNorthEast();
      const sw = bounds?.getSouthWest();
      
      if (!ne || !sw) {
        console.warn(`⚠️ No bounds found for map`);
        return;
      }

      // Calculate pixel position more safely
      const lat = position.lat();
      const lng = position.lng();
      
      const mapWidth = mapDiv.offsetWidth;
      const mapHeight = mapDiv.offsetHeight;
      
      // Simple linear interpolation for pixel coordinates
      const x = ((lng - sw.lng()) / (ne.lng() - sw.lng())) * mapWidth;
      const y = ((ne.lat() - lat) / (ne.lat() - sw.lat())) * mapHeight;
      
      // Validate coordinates before updating
      if (isFinite(x) && isFinite(y)) {
        updatePosition(x, y);
      } else {
        console.warn(`⚠️ Invalid coordinates calculated for ${gem.title}:`, { x, y, lat, lng });
        updatePosition(0, 0); // Fallback to origin
      }
    } catch (error) {
      console.error(`❌ Error updating marker position for ${gem.title}:`, error);
      updatePosition(0, 0); // Fallback to origin
    }
  };

  const handleMouseOver = () => {
    console.log(`🐭 Mouse over marker: ${gem.title}`);
    updateMarkerPosition();
    handleMouseEnter(gem.title);
  };

  const handleMouseOut = () => {
    console.log(`🐭 Mouse out marker: ${gem.title}`);
    handleMouseLeave(gem.title);
  };

  const handleClick = () => {
    console.log(`💎 Click detected on hidden gem: ${gem.title}`);
    if (onMarkerClick) {
      onMarkerClick(gem);
    }
  };

  return {
    handleMouseOver,
    handleMouseOut,
    handleClick,
    updateMarkerPosition
  };
};
