
import { DriveInData } from './hooks/useDriveInsData';
import { MarkerAnimationUtils } from '../../utils/markerAnimationUtils';

interface DriveInMarkerEventHandlersConfig {
  driveIn: DriveInData;
  map: google.maps.Map;
  marker: google.maps.Marker;
  updatePosition: (x: number, y: number) => void;
  handleMouseEnter: (driveInName: string) => void;
  handleMouseLeave: (driveInName: string) => void;
}

const getMarkerScreenPosition = (map: google.maps.Map, marker: google.maps.Marker) => {
  const projection = map.getProjection();
  if (!projection) return null;

  const position = marker.getPosition();
  if (!position) return null;

  const mapDiv = map.getDiv();
  const mapRect = mapDiv.getBoundingClientRect();

  const bounds = map.getBounds();
  if (!bounds) return null;

  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  const x = ((position.lng() - sw.lng()) / (ne.lng() - sw.lng())) * mapRect.width;
  const y = ((ne.lat() - position.lat()) / (ne.lat() - sw.lat())) * mapRect.height;

  return {
    x: mapRect.left + x,
    y: mapRect.top + y
  };
};

export const createDriveInMarkerEventHandlers = ({
  driveIn,
  map,
  marker,
  updatePosition,
  handleMouseEnter,
  handleMouseLeave
}: DriveInMarkerEventHandlersConfig) => {
  
  const handleMouseOver = () => {
    console.log(`🐭 Mouse over drive-in: ${driveIn.name}`);
    
    // Trigger enhanced jiggle animation
    MarkerAnimationUtils.triggerEnhancedJiggle(marker, driveIn.name);
    
    const screenPos = getMarkerScreenPosition(map, marker);
    if (screenPos) {
      updatePosition(screenPos.x, screenPos.y);
      handleMouseEnter(driveIn.name);
    }
  };

  const handleMouseOut = () => {
    console.log(`🐭 Mouse out drive-in: ${driveIn.name}`);
    setTimeout(() => {
      handleMouseLeave(driveIn.name);
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
