
import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import SupabaseRoute66 from './SupabaseRoute66';

interface MapContainerProps {
  map: google.maps.Map | null;
  onLoad: (map: google.maps.Map) => void;
  onUnmount: () => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  map,
  onLoad,
  onUnmount
}) => {
  // Optimized map options for native dragging
  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    gestureHandling: 'greedy' as const,
    draggable: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    keyboardShortcuts: true,
    clickableIcons: true,
    styles: []
  };

  console.log('🗺️ MapContainer: Native dragging configuration active');

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%'
        }}
        center={{ lat: 35.5, lng: -100 }}
        zoom={5}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {map && <SupabaseRoute66 map={map} />}
      </GoogleMap>
    </div>
  );
};

export default MapContainer;
