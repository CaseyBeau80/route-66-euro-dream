
import React, { useCallback, useState, useRef } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { mapBounds, mapOptions } from './config/MapConfig';
import SupabaseRoute66 from './components/SupabaseRoute66';

interface MapDisplayProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ selectedState, onStateClick }) => {
  const {
    isLoaded,
    loadError,
    currentZoom,
    setCurrentZoom,
    isDragging,
    setIsDragging,
    mapRef,
    checkMapBounds
  } = useGoogleMaps();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const preserveCenterRef = useRef<google.maps.LatLng | null>(null);
  const isInitialLoadRef = useRef(true);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isZoomingRef = useRef(false);

  // Debounced zoom handler to prevent rapid zoom changes
  const debouncedZoomHandler = useCallback((newZoom: number) => {
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
    
    zoomTimeoutRef.current = setTimeout(() => {
      setCurrentZoom(newZoom);
      isZoomingRef.current = false;
      console.log('🔍 Debounced zoom level set to:', newZoom);
    }, 100);
  }, [setCurrentZoom]);

  // Improved center preservation with better timing
  const captureCurrentCenter = useCallback(() => {
    if (map && !isInitialLoadRef.current && !isZoomingRef.current) {
      const currentCenter = map.getCenter();
      if (currentCenter) {
        preserveCenterRef.current = currentCenter;
        console.log('🎯 Captured center for preservation:', currentCenter.toJSON());
        return true;
      }
    }
    return false;
  }, [map]);

  // Enhanced zoom function with proper center preservation
  const performZoom = useCallback((newZoom: number) => {
    if (!map || isZoomingRef.current) return;
    
    console.log('🔍 Starting zoom operation to level:', newZoom);
    isZoomingRef.current = true;
    
    // Capture current center
    const centerCaptured = captureCurrentCenter();
    
    // Perform zoom
    map.setZoom(newZoom);
    
    // Restore center after zoom completes
    if (centerCaptured && preserveCenterRef.current) {
      setTimeout(() => {
        if (preserveCenterRef.current && map) {
          console.log('🎯 Restoring preserved center after zoom:', preserveCenterRef.current.toJSON());
          map.setCenter(preserveCenterRef.current);
          preserveCenterRef.current = null;
        }
      }, 150); // Slightly longer delay to ensure zoom has completed
    }
  }, [map, captureCurrentCenter]);

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("🗺️ Google Map loaded successfully");
    mapRef.current = map;
    setMap(map);
    
    // Set initial zoom and center
    map.setZoom(5);
    map.setCenter({ lat: 35.5, lng: -100 }); // Center of US for Route 66
    
    // Mark initial load as complete after a delay
    setTimeout(() => {
      isInitialLoadRef.current = false;
      console.log('🗺️ Initial load complete, center preservation now active');
    }, 1000);
    
    // Add zoom change listener with debouncing
    map.addListener('zoom_changed', () => {
      const newZoom = map.getZoom() || 5;
      
      // Only process if not currently in a zoom operation
      if (!isZoomingRef.current) {
        debouncedZoomHandler(newZoom);
      }
    });
    
    // Override the default zoom controls behavior with improved timing
    const originalSetZoom = map.setZoom;
    map.setZoom = function(zoom: number) {
      if (!isInitialLoadRef.current && !isZoomingRef.current) {
        // This is a programmatic zoom after initial load - preserve center
        const currentCenter = map.getCenter();
        if (currentCenter) {
          preserveCenterRef.current = currentCenter;
          console.log('🎯 Intercepted setZoom, preserving center:', currentCenter.toJSON());
        }
      }
      
      // Call original setZoom
      const result = originalSetZoom.call(this, zoom);
      
      // Restore center if we have one preserved
      if (preserveCenterRef.current && !isInitialLoadRef.current) {
        setTimeout(() => {
          if (preserveCenterRef.current) {
            console.log('🎯 Restoring center after intercepted zoom:', preserveCenterRef.current.toJSON());
            map.setCenter(preserveCenterRef.current);
            preserveCenterRef.current = null;
          }
        }, 150);
      }
      
      return result;
    };
    
    // Enhanced drag event listeners
    map.addListener('dragstart', () => {
      console.log('🖱️ Google Map drag started - user interaction detected');
      setIsDragging(true);
      // Clear any pending zoom operations when user starts dragging
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    });
    
    map.addListener('dragend', () => {
      console.log('🖱️ Google Map drag ended - checking bounds');
      setIsDragging(false);
      checkMapBounds();
    });
    
    map.addListener('bounds_changed', checkMapBounds);
    
    // Test draggability
    console.log('🗺️ Map draggable setting:', map.get('draggable'));
    console.log('🗺️ Map gesture handling:', map.get('gestureHandling'));
  }, [setCurrentZoom, setIsDragging, checkMapBounds, debouncedZoomHandler]);

  const onUnmount = useCallback(() => {
    console.log("🗺️ Google Map unmounted");
    mapRef.current = null;
    setMap(null);
    preserveCenterRef.current = null;
    isInitialLoadRef.current = true;
    isZoomingRef.current = false;
    
    // Clear any pending timeouts
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Map Loading Error
          </h3>
          <p className="text-gray-600 mb-4">
            Unable to load Google Maps. Please check your internet connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Route 66 Map...</p>
        </div>
      </div>
    );
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
        options={{
          ...mapOptions,
          draggable: true,
          panControl: true,
          gestureHandling: 'greedy',
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          restriction: {
            latLngBounds: mapBounds,
            strictBounds: false,
          },
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onDragStart={() => {
          console.log('🖱️ GoogleMap onDragStart callback triggered');
          setIsDragging(true);
        }}
        onDragEnd={() => {
          console.log('🖱️ GoogleMap onDragEnd callback triggered');
          setIsDragging(false);
        }}
      >
        {map && <SupabaseRoute66 map={map} />}
      </GoogleMap>
    </div>
  );
};

export default MapDisplay;
