
import React, { useCallback } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { mapContainerStyle, center, mapOptions } from '../config/MapConfig';
import { route66Towns } from '@/types/route66';

interface MapInitializerProps {
  onLoad: (map: google.maps.Map) => void;
  onClick: () => void;
  children: React.ReactNode;
}

const MapInitializer: React.FC<MapInitializerProps> = ({ 
  onLoad, 
  onClick, 
  children 
}) => {
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={5} // Start with a lower zoom level
      options={mapOptions}
      onClick={onClick}
      onLoad={onLoad}
    >
      {children}
    </GoogleMap>
  );
};

export default MapInitializer;
