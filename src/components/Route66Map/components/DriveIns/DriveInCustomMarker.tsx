
import React from 'react';
import { DriveInData } from './hooks/useDriveInsData';
import DriveInHoverableMarker from './DriveInHoverableMarker';

interface DriveInCustomMarkerProps {
  driveIn: DriveInData;
  isActive: boolean;
  onMarkerClick: (driveIn: DriveInData) => void;
  onWebsiteClick: (website: string) => void;
  map: google.maps.Map;
}

const DriveInCustomMarker: React.FC<DriveInCustomMarkerProps> = ({
  driveIn,
  isActive,
  onMarkerClick,
  onWebsiteClick,
  map
}) => {
  return (
    <DriveInHoverableMarker
      driveIn={driveIn}
      onMarkerClick={onMarkerClick}
      onWebsiteClick={onWebsiteClick}
      map={map}
    />
  );
};

export default DriveInCustomMarker;
