
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
  showDefaultZoomControls?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 35.2,
  lng: -98.5
};

// Expanded Route 66 corridor bounds - now includes Chicago fully  
const route66Bounds = {
  north: 42.5, // Expanded north to fully include Chicago
  south: 32.0,
  east: -85.0, // Expanded east to better include Chicago area
  west: -122.0 // Expanded west to better include California
};

const InteractiveGoogleMap: React.FC<InteractiveGoogleMapProps> = ({
  onMapLoad,
  onMapClick,
  children,
  center = defaultCenter,
  zoom = 5,
  className = '',
  showDefaultZoomControls = false
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const isMobile = useIsMobile();
  const [isMapReady, setIsMapReady] = useState(false);

  // Use the same Google Maps hook as the main map to avoid loader conflicts
  const { isLoaded, loadError, hasApiKey } = useGoogleMaps();

  // Map options - Disable user zoom gestures but allow programmatic zoom
  const mapOptions = React.useMemo((): google.maps.MapOptions => {
    return {
      // Disable user-initiated zoom gestures but allow programmatic zoom
      scrollwheel: false, // Disable scroll wheel zoom
      disableDoubleClickZoom: true, // Disable double-click zoom
      gestureHandling: 'cooperative', // Allow programmatic changes but require Ctrl for user gestures
      
      // Disable ALL default map controls including zoom
      zoomControl: false, // Always disabled - we use custom controls only
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      
      // Expanded Route 66 corridor restrictions
      restriction: {
        latLngBounds: route66Bounds,
        strictBounds: true
      },
      minZoom: 4, // Focused minimum zoom for Route 66
      maxZoom: 12, // Reasonable maximum for route exploration
      
      // Map styling focused on Route 66
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#f8c967' }, { weight: 1.5 }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#bfdbfe' }]
        }
      ]
    };
  }, [isMobile]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setIsMapReady(true);
    
    console.log('🗺️ Map loaded with custom zoom controls enabled');
    
    // Get the map container element to add event listeners
    const mapDiv = map.getDiv();
    if (mapDiv) {
      console.log('🚫 Adding wheel event prevention for mouse wheel zoom');
      
      // Prevent wheel zoom completely (override cooperative gesture handling for wheel events)
      const wheelHandler = (e: WheelEvent) => {
        console.log('🚫 Preventing wheel zoom - use custom zoom controls instead');
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      // Prevent double-click zoom completely
      const dblClickHandler = (e: MouseEvent) => {
        console.log('🚫 Preventing double-click zoom - use custom zoom controls instead');
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      // Add event listeners with capture to override Google Maps behavior
      mapDiv.addEventListener('wheel', wheelHandler, { passive: false, capture: true });
      mapDiv.addEventListener('dblclick', dblClickHandler, { capture: true });
      
      // Store handlers for cleanup
      (mapDiv as any)._wheelHandler = wheelHandler;
      (mapDiv as any)._dblClickHandler = dblClickHandler;
    }
    
    if (onMapLoad) {
      onMapLoad(map);
    }
  }, [onMapLoad]);

  const handleMapClick = useCallback(() => {
    if (onMapClick) {
      onMapClick();
    }
  }, [onMapClick]);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        const mapDiv = mapRef.current.getDiv();
        if (mapDiv && (mapDiv as any)._wheelHandler) {
          mapDiv.removeEventListener('wheel', (mapDiv as any)._wheelHandler, { capture: true });
          mapDiv.removeEventListener('dblclick', (mapDiv as any)._dblClickHandler, { capture: true });
        }
      }
    };
  }, []);

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
        options={mapOptions}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
      >
        {children}
      </GoogleMap>
    </div>
  );
};

export default InteractiveGoogleMap;
