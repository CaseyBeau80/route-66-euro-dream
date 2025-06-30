
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGoogleMaps } from '@/components/Route66Map/hooks/useGoogleMaps';

interface InteractiveGoogleMapProps {
  onMapLoad?: (map: google.maps.Map) => void;
  onMapClick?: () => void;
  children?: React.ReactNode;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 36.0, // Route 66 corridor center
  lng: -96.0
};

// Route 66 focused bounds
const mapBounds = {
  north: 42.0,
  south: 32.0,
  east: -80.0,
  west: -125.0,
};

const InteractiveGoogleMap: React.FC<InteractiveGoogleMapProps> = ({
  onMapLoad,
  onMapClick,
  children,
  center = defaultCenter,
  zoom = 5,
  className = ''
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const isMobile = useIsMobile();
  const [isMapReady, setIsMapReady] = useState(false);

  // Use the same Google Maps hook as the main map to avoid loader conflicts
  const { isLoaded, loadError, hasApiKey } = useGoogleMaps();

  // Clean Route 66 focused map options
  const route66MapOptions = React.useMemo((): google.maps.MapOptions => {
    console.log('🗺️ Creating clean Route 66 map options for device:', isMobile ? 'mobile' : 'desktop');
    
    return {
      // Enable scroll wheel zoom
      scrollwheel: true,
      gestureHandling: isMobile ? 'greedy' : 'cooperative',
      
      // Map controls
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      
      // Route 66 corridor restrictions
      restriction: {
        latLngBounds: mapBounds,
        strictBounds: true
      },
      minZoom: 4,
      maxZoom: 12,
      
      // Clean map styling - remove aggressive orange overlay
      styles: [
        {
          // Simplify water styling
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#a2d2ff' }]
        },
        {
          // Make highways more visible
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#ffd60a' }, { weight: 2 }]
        },
        {
          // Clean up administrative boundaries
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#c9b2a6' }, { weight: 1 }]
        },
        {
          // Subtle landscape styling
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f8f4f0' }]
        },
        {
          // Clean road styling
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#ffffff' }]
        },
        {
          // Hide unnecessary POI labels
          featureType: 'poi.business',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };
  }, [isMobile]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    console.log('🗺️ InteractiveGoogleMap loaded with clean Route 66 styling');
    mapRef.current = map;
    setIsMapReady(true);
    
    // Apply clean Route 66 settings
    map.setOptions(route66MapOptions);
    
    // Set initial view optimized for Route 66 corridor
    map.setZoom(5);
    map.setCenter(defaultCenter);
    
    console.log('✅ Clean Route 66 map loaded successfully');
    
    if (onMapLoad) {
      onMapLoad(map);
    }
  }, [onMapLoad, route66MapOptions]);

  const handleMapClick = useCallback(() => {
    console.log('🗺️ Route 66 map clicked');
    if (onMapClick) {
      onMapClick();
    }
  }, [onMapClick]);

  if (!hasApiKey) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Google Maps API Key Required
          </h3>
          <p className="text-gray-600 text-sm">
            Please add your Google Maps API key to display the Route 66 map
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Route 66 Map Loading Error
          </h3>
          <p className="text-red-600 text-sm">
            {loadError.message}
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading Route 66 interactive map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={route66MapOptions}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
      >
        {children}
      </GoogleMap>
      
      {/* Clean debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-3 py-2 rounded shadow-lg">
          <div className="text-blue-300 font-bold">🛣️ ROUTE 66</div>
          <div>{isMobile ? '📱 Mobile' : '🖥️ Desktop'}</div>
          <div>Bounds: RESTRICTED</div>
          <div>Zoom: {4}-{12}</div>
        </div>
      )}
    </div>
  );
};

export default InteractiveGoogleMap;
