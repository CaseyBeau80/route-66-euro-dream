
import React, { useEffect } from 'react';

interface MapEffectsProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

const MapEffects: React.FC<MapEffectsProps> = ({ mapRef }) => {
  // Cleanup function to remove any existing polylines
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        console.log('🧹 Cleaning up any existing polylines on component unmount');
        
        try {
          const mapInstance = mapRef.current as any;
          
          if (mapInstance.overlayMapTypes) {
            mapInstance.overlayMapTypes.clear();
            console.log('🧹 Cleared overlay map types');
          }

          google.maps.event.clearInstanceListeners(mapRef.current);
          console.log('🧹 Cleared all map event listeners');
          
        } catch (cleanupError) {
          console.warn('⚠️ Error during polyline cleanup:', cleanupError);
        }
      }
    };
  }, [mapRef]);

  return null;
};

export default MapEffects;
