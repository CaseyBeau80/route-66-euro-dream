

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useIsMobile } from '@/hooks/use-mobile';

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

  // Get API key from environment or localStorage
  const apiKey = React.useMemo(() => {
    const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const storedApiKey = localStorage.getItem('google_maps_api_key');
    
    if (storedApiKey && storedApiKey.trim() !== '' && storedApiKey !== 'demo-key') {
      return storedApiKey.trim();
    } else if (envApiKey && envApiKey.trim() !== '' && envApiKey !== 'demo-key') {
      return envApiKey.trim();
    }
    
    return '';
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'interactive-google-map',
    googleMapsApiKey: apiKey,
    libraries: ['maps'] as const,
  });

  // Map options optimized for different devices
  const mapOptions = React.useMemo((): google.maps.MapOptions => {
    console.log('🗺️ Creating map options for device:', isMobile ? 'mobile' : 'desktop');
    
    return {
      // Gesture handling - greedy allows all touch gestures on mobile
      gestureHandling: 'greedy',
      
      // FORCE disable mouse scroll wheel zoom on all devices
      scrollwheel: false,
      
      // Map controls
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
    console.log('🗺️ InteractiveGoogleMap loaded successfully');
    mapRef.current = map;
    setIsMapReady(true);
    
    // Multiple layers of scroll zoom prevention
    const mapDiv = map.getDiv();
    
    // Method 1: Prevent wheel events on the map container
    const preventWheelZoom = (e: WheelEvent) => {
      console.log('🚫 Wheel event intercepted - preventing zoom');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };
    
    // Method 2: Prevent mousewheel events (older browsers)
    const preventMouseWheelZoom = (e: Event) => {
      console.log('🚫 MouseWheel event intercepted - preventing zoom');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };
    
    // Method 3: Prevent DOMMouseScroll events (Firefox)
    const preventDOMMouseScroll = (e: Event) => {
      console.log('🚫 DOMMouseScroll event intercepted - preventing zoom');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };
    
    // Add multiple event listeners to catch all scroll events
    mapDiv.addEventListener('wheel', preventWheelZoom, { passive: false, capture: true });
    mapDiv.addEventListener('mousewheel', preventMouseWheelZoom, { passive: false, capture: true });
    mapDiv.addEventListener('DOMMouseScroll', preventDOMMouseScroll, { passive: false, capture: true });
    
    // Also disable zoom on the map itself using Google Maps API
    map.setOptions({ 
      scrollwheel: false,
      gestureHandling: isMobile ? 'greedy' : 'cooperative'
    });
    
    // Store cleanup function
    (map as any).__scrollCleanup = () => {
      console.log('🧹 Cleaning up scroll event listeners');
      mapDiv.removeEventListener('wheel', preventWheelZoom, { capture: true });
      mapDiv.removeEventListener('mousewheel', preventMouseWheelZoom, { capture: true });
      mapDiv.removeEventListener('DOMMouseScroll', preventDOMMouseScroll, { capture: true });
    };
    
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

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (mapRef.current && (mapRef.current as any).__scrollCleanup) {
        (mapRef.current as any).__scrollCleanup();
      }
    };
  }, []);

  if (!apiKey) {
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
        {children}
      </GoogleMap>
      
      {/* Enhanced device info display for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-3 py-2 rounded shadow-lg">
          <div>{isMobile ? '📱 Mobile' : '🖥️ Desktop'}</div>
          <div>Scroll Zoom: <span className="text-red-300 font-bold">DISABLED</span></div>
          <div>Gesture: {isMobile ? 'Greedy' : 'Cooperative'}</div>
        </div>
      )}
    </div>
  );
};

export default InteractiveGoogleMap;

