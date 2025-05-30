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

  // Function to capture current center before zoom operations
  const captureCurrentCenter = useCallback(() => {
    if (map && !isInitialLoadRef.current) {
      const currentCenter = map.getCenter();
      if (currentCenter) {
        preserveCenterRef.current = currentCenter;
        console.log('🎯 Captured center for preservation:', currentCenter.toJSON());
      }
    }
  }, [map]);

  // Function to perform zoom while preserving center
  const zoomToLevel = useCallback((newZoom: number) => {
    if (!map) return;
    
    // Capture current center before zoom
    captureCurrentCenter();
    
    // Perform zoom
    map.setZoom(newZoom);
    
    // Restore center after a brief delay to ensure zoom has processed
    setTimeout(() => {
      if (preserveCenterRef.current) {
        console.log('🎯 Restoring preserved center:', preserveCenterRef.current.toJSON());
        map.setCenter(preserveCenterRef.current);
        preserveCenterRef.current = null;
      }
    }, 50);
  }, [map, captureCurrentCenter]);

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("🗺️ Google Map loaded successfully");
    mapRef.current = map;
    setMap(map);
    
    // Set initial zoom and center
    map.setZoom(5);
    map.setCenter({ lat: 35.5, lng: -100 }); // Center of US for Route 66
    
    // Mark initial load as complete after a short delay
    setTimeout(() => {
      isInitialLoadRef.current = false;
      console.log('🗺️ Initial load complete, center preservation now active');
    }, 1000);
    
    // Add zoom change listener
    map.addListener('zoom_changed', () => {
      const newZoom = map.getZoom() || 5;
      setCurrentZoom(newZoom);
      console.log('🔍 Zoom level changed to:', newZoom);
    });
    
    // Override the default zoom controls behavior
    const originalSetZoom = map.setZoom;
    map.setZoom = function(zoom: number) {
      if (!isInitialLoadRef.current) {
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
        }, 50);
      }
      
      return result;
    };
    
    map.addListener('dragstart', () => {
      setIsDragging(true);
    });
    
    map.addListener('dragend', () => {
      setIsDragging(false);
      checkMapBounds();
    });
    
    map.addListener('bounds_changed', checkMapBounds);
  }, [setCurrentZoom, setIsDragging, checkMapBounds]);

  const onUnmount = useCallback(() => {
    console.log("🗺️ Google Map unmounted");
    mapRef.current = null;
    setMap(null);
    preserveCenterRef.current = null;
    isInitialLoadRef.current = true;
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
          restriction: {
            latLngBounds: mapBounds,
            strictBounds: false,
          },
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {map && <SupabaseRoute66 map={map} />}
      </GoogleMap>
    </div>
  );
};

export default MapDisplay;
