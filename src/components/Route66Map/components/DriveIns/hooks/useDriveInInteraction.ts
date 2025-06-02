
import { useState, useCallback } from 'react';
import { DriveInData } from './useDriveInsData';

export const useDriveInInteraction = (onDriveInClick?: (driveIn: DriveInData) => void) => {
  const [activeDriveIn, setActiveDriveIn] = useState<string | null>(null);

  const handleMarkerClick = useCallback((driveIn: DriveInData) => {
    console.log(`🎬 Drive-in marker clicked: ${driveIn.name} in ${driveIn.city_name}, ${driveIn.state}`);
    setActiveDriveIn(driveIn.id);
    onDriveInClick?.(driveIn);
  }, [onDriveInClick]);

  const handleWebsiteClick = useCallback((website: string) => {
    console.log(`🌐 Opening drive-in website: ${website}`);
    window.open(website, '_blank', 'noopener,noreferrer');
  }, []);

  const closeActiveDriveIn = useCallback(() => {
    console.log('❌ Closing active drive-in overlay');
    setActiveDriveIn(null);
  }, []);

  return {
    activeDriveIn,
    handleMarkerClick,
    handleWebsiteClick,
    closeActiveDriveIn
  };
};
