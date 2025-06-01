
import React, { useEffect, useRef } from 'react';
import { useMapInitialization } from '../hooks/useMapInitialization';
import MapScrollHandler from './MapScrollHandler';
import MapEventManager from './MapEventManager';

interface MapInitializerCoreProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  onMapLoad: (map: google.maps.Map) => void;
  onMapClick: () => void;
  onMapReady: () => void;
  setShowScrollHint: (show: boolean) => void;
}

const MapInitializerCore: React.FC<MapInitializerCoreProps> = ({
  mapRef,
  onMapLoad,
  onMapClick,
  onMapReady,
  setShowScrollHint
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapInitialized, initializeMap } = useMapInitialization({
    onMapLoad,
    onMapReady,
    onMapClick
  });

  useEffect(() => {
    if (mapInitialized || !containerRef.current || mapRef.current) {
      return;
    }

    const map = initializeMap(containerRef.current);
    if (map) {
      mapRef.current = map;
    }
  }, [mapInitialized, initializeMap, mapRef]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Call all cleanup functions if they exist
      if (mapRef.current) {
        const map = mapRef.current as any;
        if (map.__scrollCleanup) {
          map.__scrollCleanup();
        }
        if (map.__eventCleanup) {
          map.__eventCleanup();
        }
      }
    };
  }, [mapRef]);

  return (
    <>
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Scroll Handler */}
      <MapScrollHandler
        map={mapRef.current}
        containerRef={containerRef}
        setShowScrollHint={setShowScrollHint}
      />
      
      {/* Event Manager */}
      <MapEventManager
        map={mapRef.current}
        onMapClick={onMapClick}
      />
    </>
  );
};

export default MapInitializerCore;
