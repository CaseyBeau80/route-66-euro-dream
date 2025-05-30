
import React, { useEffect } from 'react';
import { useSimpleGoogleMaps } from './hooks/useSimpleGoogleMaps';
import { useCleanMapInitialization } from './hooks/useCleanMapInitialization';
import MapLoadingStates from './components/MapLoadingStates';
import MapContainer from './components/MapContainer';

interface MapDisplayProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ selectedState, onStateClick }) => {
  const {
    isLoaded,
    loadError,
    mapRef,
    setupMapListeners,
    initializeGoogleMaps,
    cleanup
  } = useSimpleGoogleMaps();

  const { map, onLoad, onUnmount } = useCleanMapInitialization({
    mapRef,
    setupMapListeners
  });

  // Initialize Google Maps on component mount
  useEffect(() => {
    initializeGoogleMaps();
  }, [initializeGoogleMaps]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Show loading or error states
  const loadingState = MapLoadingStates({ loadError, isLoaded });
  if (loadingState) {
    return loadingState;
  }

  return (
    <MapContainer
      map={map}
      onLoad={onLoad}
      onUnmount={onUnmount}
    />
  );
};

export default MapDisplay;
