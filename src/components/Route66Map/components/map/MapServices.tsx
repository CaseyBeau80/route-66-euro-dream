
import React from 'react';
import MapInitializationService from '../../services/MapInitializationService';
import StateHighlighting from '../StateHighlighting';
import UltraSmoothRouteRenderer from '../../services/UltraSmoothRouteRenderer';

interface MapServicesProps {
  map: google.maps.Map;
  mapEventHandlers: {
    onMapReady: (map: google.maps.Map) => void;
    isMapReady: boolean;
  };
}

const MapServices: React.FC<MapServicesProps> = ({ map, mapEventHandlers }) => {
  return (
    <>
      <MapInitializationService 
        map={map} 
        onMapReady={mapEventHandlers.onMapReady}
      />
      
      {/* Add state highlighting as the base layer */}
      <StateHighlighting map={map} />
      
      {mapEventHandlers.isMapReady && (
        <>
          {/* Render the ultra-smooth Route 66 with ~2000 interpolated points */}
          <UltraSmoothRouteRenderer 
            map={map}
            isMapReady={mapEventHandlers.isMapReady}
          />
        </>
      )}
    </>
  );
};

export default MapServices;
