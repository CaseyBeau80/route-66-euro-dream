
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGoogleMaps } from '@/components/Route66Map/hooks/useGoogleMaps';
import NuclearRouteManager from '@/components/Route66Map/components/NuclearRouteManager';
import DestinationCitiesContainer from '@/components/Route66Map/components/DestinationCitiesContainer';
import AttractionsContainer from '@/components/Route66Map/components/AttractionsContainer';
import HiddenGemsContainer from '@/components/Route66Map/components/HiddenGemsContainer';
import DriveInsContainer from '@/components/Route66Map/components/DriveIns/DriveInsContainer';

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
  lat: 35.0,
  lng: -98.0
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

  // Map options optimized for different devices with proper zoom controls
  const mapOptions = React.useMemo((): google.maps.MapOptions => {
    console.log('🗺️ Creating map options for device:', isMobile ? 'mobile' : 'desktop');
    
    return {
      // Enable scroll wheel zoom but with controlled gesture handling
      scrollwheel: true,
      gestureHandling: isMobile ? 'greedy' : 'cooperative',
      
      // Map controls - ensure zoom control is enabled
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      clickableIcons: false,
      
      // Map restrictions
      restriction: {
        latLngBounds: {
          north: 85,
          south: -85,
          west: -180,
          east: 180
        },
        strictBounds: false
      },
      minZoom: 2,
      maxZoom: 18,
      
      // Map styling
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };
  }, [isMobile]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    console.log('🗺️ InteractiveGoogleMap loaded successfully with Route 66 content and zoom enabled');
    mapRef.current = map;
    setIsMapReady(true);
    
    // Set proper zoom options on the map
    map.setOptions({ 
      scrollwheel: true,
      gestureHandling: isMobile ? 'greedy' : 'cooperative',
      zoomControl: true
    });
    
    console.log('✅ Zoom controls enabled:', {
      scrollwheel: true,
      gestureHandling: isMobile ? 'greedy' : 'cooperative',
      zoomControl: true
    });
    
    if (onMapLoad) {
      onMapLoad(map);
    }
  }, [onMapLoad, isMobile]);

  const handleMapClick = useCallback(() => {
    console.log('🗺️ Map clicked');
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
            Please add your Google Maps API key to display the map
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
            Map Loading Error
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading interactive map...</p>
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
        options={mapOptions}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
      >
        {/* Route 66 Content - Only render when map is ready */}
        {mapRef.current && isMapReady && (
          <>
            {/* Route Rendering - SINGLE route system */}
            <NuclearRouteManager map={mapRef.current} isMapReady={isMapReady} />
            
            {/* Markers and Interactive Elements */}
            <DestinationCitiesContainer map={mapRef.current} />
            <AttractionsContainer map={mapRef.current} />
            <HiddenGemsContainer map={mapRef.current} />
            <DriveInsContainer map={mapRef.current} />
          </>
        )}
        
        {/* Any additional children passed from parent */}
        {children}
      </GoogleMap>
      
      {/* Enhanced device info display for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-3 py-2 rounded shadow-lg">
          <div>{isMobile ? '📱 Mobile' : '🖥️ Desktop'}</div>
          <div>Scroll Zoom: <span className="text-green-300 font-bold">ENABLED</span></div>
          <div>Gesture: {isMobile ? 'Greedy' : 'Cooperative'}</div>
          <div>Route 66: <span className="text-green-300 font-bold">LOADED</span></div>
        </div>
      )}
    </div>
  );
};

export default InteractiveGoogleMap;
