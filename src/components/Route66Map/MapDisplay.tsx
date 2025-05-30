
import React, { useCallback, useState, useRef } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useMapEvents } from './hooks/useMapEvents';
import { useZoomPreservation } from './hooks/useZoomPreservation';
import { mapBounds, mapOptions } from './config/MapConfig';
import SupabaseRoute66 from './components/SupabaseRoute66';
import MapLoadingStates from './components/MapLoadingStates';

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
  
  const {
    preserveCenterRef,
    isInitialLoadRef,
    zoomTimeoutRef,
    isZoomingRef,
    debouncedZoomHandler,
    captureCurrentCenter,
    performZoom,
    markInitialLoadComplete,
    cleanup
  } = useZoomPreservation();

  // Create a bound version of debouncedZoomHandler for this component
  const boundDebouncedZoomHandler = useCallback((newZoom: number) => {
    debouncedZoomHandler(newZoom, setCurrentZoom);
  }, [debouncedZoomHandler, setCurrentZoom]);

  const { setupMapListeners } = useMapEvents({
    setCurrentZoom,
    setIsDragging,
    checkMapBounds,
    debouncedZoomHandler: boundDebouncedZoomHandler,
    preserveCenterRef,
    isInitialLoadRef,
    isZoomingRef
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("🗺️ Google Map loaded successfully");
    mapRef.current = map;
    setMap(map);
    
    // Set initial zoom and center
    map.setZoom(5);
    map.setCenter({ lat: 35.5, lng: -100 }); // Center of US for Route 66
    
    // Mark initial load as complete after a delay
    markInitialLoadComplete();
    
    // Setup all map listeners
    setupMapListeners(map);
    
    // Clear any pending zoom operations when user starts dragging
    map.addListener('dragstart', () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    });
  }, [setCurrentZoom, setIsDragging, checkMapBounds, boundDebouncedZoomHandler, setupMapListeners, markInitialLoadComplete, zoomTimeoutRef]);

  const onUnmount = useCallback(() => {
    console.log("🗺️ Google Map unmounted");
    mapRef.current = null;
    setMap(null);
    cleanup();
  }, [cleanup]);

  // Show loading or error states
  const loadingState = MapLoadingStates({ loadError, isLoaded });
  if (loadingState) {
    return loadingState;
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
