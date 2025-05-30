
import React, { useCallback, useRef } from 'react';
import { GoogleMap } from '@react-google-maps/api';

interface MapContainerProps {
  isLoaded: boolean;
}

const MapContainer: React.FC<MapContainerProps> = ({ isLoaded }) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("🗺️ Google Map loaded successfully in MapContainer");
    mapRef.current = map;
    
    // Set initial position for Route 66
    const route66Center = { lat: 35.5, lng: -100 };
    map.setZoom(5);
    map.setCenter(route66Center);
    
    console.log('✅ Map ready for Route 66 rendering - no services will be added here');
  }, []);

  const onUnmount = useCallback(() => {
    console.log("🗺️ Google Map unmounted");
    if (mapRef.current) {
      google.maps.event.clearInstanceListeners(mapRef.current);
    }
    mapRef.current = null;
  }, []);

  // Optimized map options for native dragging and Route 66 visibility
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
    minZoom: 3,
    maxZoom: 18,
    styles: []
  };

  if (!isLoaded) {
    return null;
  }

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
        {/* No Route 66 services here - they will be handled by GoogleMapsRoute66 component */}
      </GoogleMap>
    </div>
  );
};

export default MapContainer;
