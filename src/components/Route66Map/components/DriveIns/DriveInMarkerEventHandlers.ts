
import { DriveInData } from './hooks/useDriveInsData';

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
    if (!map || !marker) return;
    
    const projection = map.getProjection();
    if (!projection) return;
    
    const position = marker.getPosition();
    if (!position) return;
    
    const point = projection.fromLatLngToPoint(position);
    if (!point) return;
    
    const scale = Math.pow(2, map.getZoom() || 0);
    const worldCoordinate = new google.maps.Point(
      point.x * scale,
      point.y * scale
    );
    
    const pixelOffset = new google.maps.Point(
      Math.floor(worldCoordinate.x),
      Math.floor(worldCoordinate.y)
    );
    
    updatePosition(pixelOffset.x, pixelOffset.y);
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
