
import React from 'react';
import MapInitializer from './MapInitializer';
import MapInitializationService from '../services/MapInitializationService';
import StateHighlighting from './StateHighlighting';
import MapLayers from './MapLayers';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface MapCoreProps {
  mapInitialized: boolean;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  isMapReady: boolean;
  visibleWaypoints: Route66Waypoint[];
  onMapLoad: (map: google.maps.Map) => void;
  onMapClick: () => void;
  onMapReady: (map: google.maps.Map) => void;
  onDestinationClick: (destination: Route66Waypoint) => void;
  onAttractionClick: (waypoint: Route66Waypoint) => void;
}

const MapCore: React.FC<MapCoreProps> = ({
  mapInitialized,
  mapRef,
  isMapReady,
  visibleWaypoints,
  onMapLoad,
  onMapClick,
  onMapReady,
  onDestinationClick,
  onAttractionClick
}) => {
  return (
    <MapInitializer onLoad={onMapLoad} onClick={onMapClick}>
      {mapInitialized && mapRef.current && (
        <>
          <MapInitializationService 
            map={mapRef.current} 
            onMapReady={onMapReady}
          />
          
          {/* Add state highlighting as the base layer */}
          <StateHighlighting map={mapRef.current} />
          
          <MapLayers
            map={mapRef.current}
            isMapReady={isMapReady}
            visibleWaypoints={visibleWaypoints}
            onDestinationClick={onDestinationClick}
            onAttractionClick={onAttractionClick}
          />
        </>
      )}
    </MapInitializer>
  );
};

export default MapCore;
