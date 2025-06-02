
import { DriveInData } from './hooks/useDriveInsData';
import { getMarkerScreenPosition } from '../HiddenGems/components/MarkerPositioning';

interface DriveInMarkerEventHandlersProps {
  driveIn: DriveInData;
  map: google.maps.Map;
  marker: google.maps.Marker;
  updatePosition: (x: number, y: number) => void;
  handleMouseEnter: (driveInName: string) => void;
  handleMouseLeave: (driveInName: string) => void;
}

export const createDriveInMarkerEventHandlers = ({
  driveIn,
  map,
  marker,
  updatePosition,
  handleMouseEnter,
  handleMouseLeave
}: DriveInMarkerEventHandlersProps) => {
  
  const updateMarkerPosition = () => {
    console.log(`🎬 Updating drive-in marker position for: ${driveIn.name}`);
    
    const screenPosition = getMarkerScreenPosition(map, marker);
    if (screenPosition) {
      console.log(`📍 Drive-in screen position calculated:`, {
        driveInName: driveIn.name,
        screenPosition
      });
      updatePosition(screenPosition.x, screenPosition.y);
    } else {
      console.warn(`⚠️ Could not calculate screen position for drive-in: ${driveIn.name}`);
    }
  };

  const handleMouseOver = () => {
    console.log(`🎬 Mouse over drive-in marker: ${driveIn.name}`);
    updateMarkerPosition();
    handleMouseEnter(driveIn.name);
  };

  const handleMouseOut = () => {
    console.log(`🎬 Mouse out drive-in marker: ${driveIn.name}`);
    handleMouseLeave(driveIn.name);
  };

  return {
    updateMarkerPosition,
    handleMouseOver,
    handleMouseOut
  };
};
