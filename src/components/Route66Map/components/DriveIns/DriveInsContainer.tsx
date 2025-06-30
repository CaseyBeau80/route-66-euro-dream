
import React, { useEffect } from 'react';
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

  // Enhanced debugging
  useEffect(() => {
    console.log('🎬 DriveInsContainer: State update', {
      mapExists: !!map,
      loading,
      driveInsCount: driveIns.length,
      activeDriveIn,
      firstDriveIn: driveIns[0] ? {
        name: driveIns[0].name,
        lat: driveIns[0].latitude,
        lng: driveIns[0].longitude,
        status: driveIns[0].status
      } : null
    });

    // Check if map bounds include drive-in locations
    if (map && driveIns.length > 0) {
      const bounds = map.getBounds();
      if (bounds) {
        const sampleDriveIn = driveIns[0];
        const isInBounds = bounds.contains({
          lat: Number(sampleDriveIn.latitude),
          lng: Number(sampleDriveIn.longitude)
        });
        console.log('🎬 Sample drive-in in map bounds:', isInBounds);
      }
    }
  }, [map, loading, driveIns, activeDriveIn]);

  if (loading) {
    console.log('⏳ Drive-ins still loading...');
    return null;
  }

  if (driveIns.length === 0) {
    console.log('❌ No drive-ins loaded');
    return null;
  }

  console.log(`🎬 Rendering ${driveIns.length} drive-in theaters with enhanced debugging`);

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

      {/* Render all drive-in markers with enhanced debugging */}
      {driveIns.map((driveIn, index) => {
        console.log(`🎬 Rendering drive-in marker ${index + 1}/${driveIns.length}: ${driveIn.name}`);
        return (
          <DriveInCustomMarker
            key={`drive-in-marker-${driveIn.id}`}
            driveIn={driveIn}
            isActive={activeDriveIn === driveIn.id}
            onMarkerClick={handleMarkerClick}
            onWebsiteClick={handleWebsiteClick}
            map={map}
          />
        );
      })}
    </>
  );
};

export default DriveInsContainer;
