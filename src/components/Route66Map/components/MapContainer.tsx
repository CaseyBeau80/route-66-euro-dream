
import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
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
  // Simplified map options for better interaction
  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    gestureHandling: 'greedy' as const,
    draggable: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    keyboardShortcuts: true,
    styles: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ saturation: 36 }, { color: '#333333' }, { lightness: 40 }]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 }]
      }
    ]
  };

  // Map bounds for Route 66 corridor
  const mapBounds = {
    north: 42.0,
    south: 32.0,
    east: -117.0,
    west: -109.0
  };

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
          restriction: {
            latLngBounds: mapBounds,
            strictBounds: false,
          },
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {map && <SupabaseRoute66 map={map} />}
      </GoogleMap>
    </div>
  );
};

export default MapContainer;
