
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
  // Enhanced map options to ensure dragging works properly
  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    gestureHandling: 'greedy' as const, // This enables all gestures including drag
    draggable: true, // Explicitly enable dragging
    scrollwheel: true,
    disableDoubleClickZoom: false,
    keyboardShortcuts: true,
    // Remove any restrictions that might interfere with dragging
    clickableIcons: true,
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

  // Relaxed map bounds for Route 66 corridor - less restrictive
  const mapBounds = {
    north: 45.0,  // Expanded bounds
    south: 30.0,
    east: -115.0,
    west: -105.0
  };

  console.log('🗺️ MapContainer rendering with draggable:', true);

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
            strictBounds: false, // Allow some flexibility
          },
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onDragStart={() => {
          console.log('🖱️ GoogleMap onDragStart triggered');
          onDragStart();
        }}
        onDragEnd={() => {
          console.log('🖱️ GoogleMap onDragEnd triggered');
          onDragEnd();
        }}
      >
        {map && <SupabaseRoute66 map={map} />}
      </GoogleMap>
    </div>
  );
};

export default MapContainer;
