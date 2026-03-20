
import { useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

interface StoryMapScrollMapProps {
  center: { lat: number; lng: number };
  zoom: number;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeId: 'terrain',
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#C0392B' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#922B21' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1a3a5c' }] },
    { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#3d3d3d' }] },
  ],
};

const StoryMapScrollMap = ({ center, zoom }: StoryMapScrollMapProps) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: 'google-map-script',
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);
  };

  // Smooth pan when center/zoom changes
  useEffect(() => {
    if (mapRef.current && mapReady) {
      mapRef.current.panTo(center);
      mapRef.current.setZoom(zoom);
    }
  }, [center, zoom, mapReady]);

  if (!apiKey) {
    return (
      <div className="flex h-full items-center justify-center bg-[#2C2C2C] text-white/50">
        <p className="font-['Special_Elite'] text-sm">Map unavailable</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-[#2C2C2C]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#C0392B]" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      options={mapOptions}
    />
  );
};

export default StoryMapScrollMap;
