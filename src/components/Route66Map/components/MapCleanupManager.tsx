
import React, { useEffect } from 'react';
import { useGoogleMapsContext } from './GoogleMapsProvider';

export const MapCleanupManager: React.FC = () => {
  const { mapRef } = useGoogleMapsContext();

  // Simple cleanup effect
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        console.log('🧹 MapCleanupManager: Simple cleanup');
        
        try {
          const mapInstance = mapRef.current as any;
          
          if (mapInstance.overlayMapTypes) {
            mapInstance.overlayMapTypes.clear();
          }

          if (window.google?.maps?.event) {
            google.maps.event.clearInstanceListeners(mapRef.current);
          }

          console.log('✅ Simple cleanup completed');
          
        } catch (cleanupError) {
          console.error('❌ Error during cleanup:', cleanupError);
        }
      }
    };
  }, [mapRef]);

  return null;
};
