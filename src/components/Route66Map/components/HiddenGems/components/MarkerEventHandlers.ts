
import { HiddenGem } from '../types';
import { LayoutOptimizer } from '../../../utils/LayoutOptimizer';
import { ReflowOptimizer } from '@/utils/ReflowOptimizer';

interface MarkerEventHandlersConfig {
  gem: HiddenGem;
  map: google.maps.Map;
  marker: google.maps.Marker;
  updatePosition: (x: number, y: number) => void;
  handleMouseEnter: (gemTitle: string) => void;
  handleMouseLeave: (gemTitle: string) => void;
  handleClick?: (gem: HiddenGem, position: { x: number; y: number }) => void;
  isClicked?: boolean;
}

export const createMarkerEventHandlers = ({
  gem,
  map,
  marker,
  updatePosition,
  handleMouseEnter,
  handleMouseLeave,
  handleClick,
  isClicked = false
}: MarkerEventHandlersConfig) => {
  
  const updateMarkerPosition = async () => {
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

      // Use ReflowOptimizer for batched dimension reads to prevent forced reflows
      const dimensions = await ReflowOptimizer.getDimensions(mapDiv, `map_dims_${gem.id}`);
      const { width: mapWidth, height: mapHeight } = dimensions;
      
      // Calculate pixel position more safely
      const lat = position.lat();
      const lng = position.lng();
      
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

  const handleMouseOver = async (e: google.maps.MapMouseEvent) => {
    if (!isClicked) {
      console.log(`🐭 Mouse over marker: ${gem.title}`);
      
      // Update position with batched layout reads to prevent forced reflows
      if (e.domEvent && e.domEvent.target) {
        try {
          const rect = await ReflowOptimizer.getBoundingRect(
            e.domEvent.target as Element, 
            `hover_rect_${gem.id}`
          );
          updatePosition(rect.left + rect.width / 2, rect.top);
        } catch (error) {
          console.warn(`⚠️ Error getting rect for ${gem.title}:`, error);
          await updateMarkerPosition();
        }
      } else {
        await updateMarkerPosition();
      }
      
      handleMouseEnter(gem.title);
    }
  };

  const handleMouseOut = () => {
    if (!isClicked) {
      console.log(`🐭 Mouse out marker: ${gem.title}`);
      handleMouseLeave(gem.title);
    }
  };

  const handleClickEvent = async (e: google.maps.MapMouseEvent) => {
    console.log(`🖱️ Click hidden gem: ${gem.title}`);
    
    if (handleClick) {
      let clickPosition = { x: 0, y: 0 };
      
      // Calculate click position with batched layout reads to prevent forced reflows
      if (e.domEvent && e.domEvent.target) {
        try {
          const rect = await ReflowOptimizer.getBoundingRect(
            e.domEvent.target as Element,
            `click_rect_${gem.id}`
          );
          clickPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top
          };
        } catch (error) {
          console.warn(`⚠️ Error getting click rect for ${gem.title}:`, error);
          await updateMarkerPosition();
          clickPosition = { x: 0, y: 0 };
        }
      } else {
        // Fallback to calculated position
        await updateMarkerPosition();
        clickPosition = { x: 0, y: 0 };
      }
      
      handleClick(gem, clickPosition);
    }
  };

  return {
    handleMouseOver,
    handleMouseOut,
    handleClickEvent,
    updateMarkerPosition
  };
};
