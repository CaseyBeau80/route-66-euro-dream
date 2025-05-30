
import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { mapBounds, mapOptions } from '../config/MapConfig';
import SupabaseRoute66 from './SupabaseRoute66';

interface MapContainerProps {
  map: google.maps.Map | null;
  onLoad: (map: google.maps.Map) => void;
  onUnmount: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  map,
  onLoad,
  onUnmount,
  onDragStart,
  onDragEnd
}) => {
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%'
        }}
        center={{ lat: 35.5, lng: -100 }}
        zoom={5}
        options={{
          ...mapOptions,
          draggable: true,
          panControl: true,
          gestureHandling: 'greedy',
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          restriction: {
            latLngBounds: mapBounds,
            strictBounds: false,
          },
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onDragStart={() => {
          console.log('🖱️ GoogleMap onDragStart callback triggered');
          onDragStart();
        }}
        onDragEnd={() => {
          console.log('🖱️ GoogleMap onDragEnd callback triggered');
          onDragEnd();
        }}
      >
        {map && <SupabaseRoute66 map={map} />}
      </GoogleMap>
    </div>
  );
};

export default MapContainer;
