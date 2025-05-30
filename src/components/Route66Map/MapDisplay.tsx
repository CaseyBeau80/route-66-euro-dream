
import React from 'react';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useMapInitialization } from './hooks/useMapInitialization';
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
    currentZoom,
    setCurrentZoom,
    isDragging,
    setIsDragging,
    mapRef,
    checkMapBounds
  } = useGoogleMaps();

  const { map, onLoad, onUnmount } = useMapInitialization({
    setCurrentZoom,
    setIsDragging,
    checkMapBounds,
    mapRef
  });

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
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    />
  );
};

export default MapDisplay;
