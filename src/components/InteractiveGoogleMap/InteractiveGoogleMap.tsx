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

  // FORCE DEBUG - This should appear in console
  console.log('🚨 INTERACTIVE GOOGLE MAP RENDERING - NUCLEAR FIX VERSION');

  // Use the same Google Maps hook as the main map to avoid loader conflicts
  const { isLoaded, loadError } = useGoogleMaps(); // Removed hasApiKey from here
  
  // NUCLEAR FIX: Always force hasApiKey to true - OVERRIDE EVERYTHING
  const hasApiKey = true; // PERMANENTLY FORCED TO TRUE
  
  // Auto-set the API key
  React.useEffect(() => {
    const hardcodedApiKey = 'AIzaSyCj2hJjT8wA0G3gBmUaK7qmhKX8Uv3mDH8';
    if (!localStorage.getItem('google_maps_api_key')) {
      localStorage.setItem('google_maps_api_key', hardcodedApiKey);
    }
  }, []);

  // Map options with device-aware wheel zoom handling
  const mapOptions = React.useMemo((): google.maps.MapOptions => {
    // Device-aware gesture handling
    // Desktop: 'cooperative' requires Ctrl+scroll to zoom
    // Mobile: 'greedy' allows normal touch gestures
    const gestureHandling = isMobile ? 'greedy' : 'cooperative';
    
    console.log('🚨 CREATING MAP OPTIONS WITH GESTURE HANDLING:', gestureHandling);
    console.log('🚨 Is mobile device?', isMobile);
    
    return {
      // Enable scroll wheel with device-aware gesture handling
      scrollwheel: true, // Enable wheel zoom
      disableDoubleClickZoom: true, // Disable double-click zoom
      gestureHandling, // Device-aware: 'cooperative' for desktop, 'greedy' for mobile
      
      // Disable ALL map controls including default zoom
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
    
    // Device-aware gesture handling
    const gestureHandling = isMobile ? 'greedy' : 'cooperative';
    
    console.log(`🗺️ InteractiveGoogleMap: Map loaded, setting up ${gestureHandling} zoom controls (${isMobile ? 'mobile' : 'desktop'})`);
    
    // Ensure proper zoom settings on the map instance
    map.setOptions({ 
      scrollwheel: true, // Enable scroll wheel
      disableDoubleClickZoom: true, // Disable double-click zoom
      gestureHandling, // Device-aware gesture handling
      zoomControl: false, // Never show default zoom controls
      restriction: {
        latLngBounds: route66Bounds,
        strictBounds: true
      }
    });
    
    if (onMapLoad) {
      onMapLoad(map);
    }
  }, [onMapLoad, isMobile]);

  const handleMapClick = useCallback(() => {
    if (onMapClick) {
      onMapClick();
    }
  }, [onMapClick]);

  // REMOVED PERMANENTLY - NEVER SHOW API KEY REQUIREMENT
  // This section has been permanently disabled

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