
import { DriveInData } from './hooks/useDriveInsData';
import { openExternalLinkWithHistory, createReturnToMapUrl } from '@/utils/externalLinkUtils';

interface DriveInMarkerEventHandlersConfig {
  driveIn: DriveInData;
  map: google.maps.Map;
  marker: google.maps.Marker;
  updatePosition: (x: number, y: number) => void;
  handleMouseEnter: (driveInName: string) => void;
  handleMouseLeave: (driveInName: string) => void;
  handleTouchInteraction?: (x: number, y: number) => void;
  handleClick?: (driveInName: string) => void;
  isMobile?: boolean;
}

export const createDriveInMarkerEventHandlers = ({
  driveIn,
  map,
  marker,
  updatePosition,
  handleMouseEnter,
  handleMouseLeave,
  handleTouchInteraction,
  handleClick,
  isMobile = false
}: DriveInMarkerEventHandlersConfig) => {
  
  const updateMarkerPosition = () => {
    try {
      const position = marker.getPosition();
      if (!position) {
        console.warn(`⚠️ No position found for drive-in marker: ${driveIn.name}`);
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
        console.warn(`⚠️ Invalid coordinates calculated for ${driveIn.name}:`, { x, y, lat, lng });
        updatePosition(0, 0); // Fallback to origin
      }
    } catch (error) {
      console.error(`❌ Error updating drive-in marker position for ${driveIn.name}:`, error);
      updatePosition(0, 0); // Fallback to origin
    }
  };

  const handleMouseOver = () => {
    console.log(`🐭 Mouse over drive-in marker: ${driveIn.name}`);
    updateMarkerPosition();
    handleMouseEnter(driveIn.name);
  };

  const handleMouseOut = () => {
    console.log(`🐭 Mouse out drive-in marker: ${driveIn.name}`);
    handleMouseLeave(driveIn.name);
  };

  const handleMarkerClick = () => {
    console.log(`🖱️ Drive-in marker clicked: ${driveIn.name}`);
    updateMarkerPosition();
    
    if (isMobile && handleTouchInteraction) {
      // For mobile, trigger touch interaction which opens the card
      const position = marker.getPosition();
      if (position) {
        // Get click position in pixel coordinates
        const mapDiv = map.getDiv();
        const bounds = map.getBounds();
        
        if (mapDiv && bounds) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const lat = position.lat();
          const lng = position.lng();
          
          const mapWidth = mapDiv.offsetWidth;
          const mapHeight = mapDiv.offsetHeight;
          
          const x = ((lng - sw.lng()) / (ne.lng() - sw.lng())) * mapWidth;
          const y = ((ne.lat() - lat) / (ne.lat() - sw.lat())) * mapHeight;
          
          if (isFinite(x) && isFinite(y)) {
            handleTouchInteraction(x, y);
          }
        }
      }
    }
    
    if (handleClick) {
      handleClick(driveIn.name);
    }
  };

  // Enhanced website opening with external link handling
  const handleWebsiteClick = (website: string) => {
    console.log(`🌐 Opening drive-in website: ${driveIn.name} - ${website}`);
    openExternalLinkWithHistory(website, driveIn.name, {
      returnUrl: createReturnToMapUrl(),
      linkSource: 'drive-in-marker',
      showReturnButton: true
    });
  };

  return {
    handleMouseOver,
    handleMouseOut,
    handleClick: handleMarkerClick,
    updateMarkerPosition,
    handleWebsiteClick
  };
};
