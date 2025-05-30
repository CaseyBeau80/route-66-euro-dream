
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
  // Simplified map options focused on enabling dragging
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
    // Remove any custom styles that might interfere
    styles: []
  };

  // More generous map bounds for Route 66 corridor
  const mapBounds = {
    north: 50.0,
    south: 25.0,
    east: -110.0,
    west: -125.0
  };

  console.log('🗺️ MapContainer rendering with basic dragging config');

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
        onDragStart={() => {
          console.log('🖱️ Native GoogleMap drag started');
          onDragStart();
        }}
        onDragEnd={() => {
          console.log('🖱️ Native GoogleMap drag ended');
          onDragEnd();
        }}
      >
        {map && <SupabaseRoute66 map={map} />}
      </GoogleMap>
    </div>
  );
};

export default MapContainer;
