
import React from 'react';
import { useDriveInsData } from './hooks/useDriveInsData';
import { useDriveInInteraction } from './hooks/useDriveInInteraction';
import DriveInCustomMarker from './DriveInCustomMarker';
import DriveInOverlay from './DriveInOverlay';

interface DriveInsContainerProps {
  map: google.maps.Map;
  onDriveInClick?: (driveIn: any) => void;
}

const DriveInsContainer: React.FC<DriveInsContainerProps> = ({ 
  map, 
  onDriveInClick 
}) => {
  const { driveIns, loading } = useDriveInsData();
  const { 
    activeDriveIn, 
    handleMarkerClick, 
    handleWebsiteClick, 
    closeActiveDriveIn 
  } = useDriveInInteraction(onDriveInClick);

  if (loading) {
    console.log('⏳ Drive-ins still loading...');
    return null;
  }

  console.log(`🎬 Rendering ${driveIns.length} drive-in theaters directly from drive_ins table`);

  return (
    <>
      {/* Render active drive-in overlay if one is selected */}
      {activeDriveIn && (
        (() => {
          const driveIn = driveIns.find(d => d.id === activeDriveIn);
          return driveIn ? (
            <DriveInOverlay
              key={`drive-in-overlay-${driveIn.id}`}
              driveIn={driveIn}
              map={map}
              onClose={closeActiveDriveIn}
              onWebsiteClick={handleWebsiteClick}
            />
          ) : null;
        })()
      )}

      {/* Render all drive-in markers with hover functionality */}
      {driveIns.map((driveIn) => (
        <DriveInCustomMarker
          key={`drive-in-marker-${driveIn.id}`}
          driveIn={driveIn}
          isActive={activeDriveIn === driveIn.id}
          onMarkerClick={handleMarkerClick}
          onWebsiteClick={handleWebsiteClick}
          map={map}
        />
      ))}
    </>
  );
};

export default DriveInsContainer;
