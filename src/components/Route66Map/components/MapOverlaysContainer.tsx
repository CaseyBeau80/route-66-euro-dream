
import React from 'react';
import ClearSelectionOverlay from './overlays/ClearSelectionOverlay';
import ZoomControlsOverlay from './overlays/ZoomControlsOverlay';
import RouteStatsOverlay from './overlays/RouteStatsOverlay';

interface MapOverlaysContainerProps {
  selectedState: string | null;
  onClearSelection: () => void;
  isDragging: boolean;
  showRouteStats: boolean;
  isMapReady: boolean;
  onToggleRouteStats: () => void;
  mapRef?: React.MutableRefObject<google.maps.Map | null>;
}

const MapOverlaysContainer: React.FC<MapOverlaysContainerProps> = ({
  selectedState,
  onClearSelection,
  isDragging,
  showRouteStats,
  isMapReady,
  onToggleRouteStats,
  mapRef
}) => {
  // Enhanced debugging for component state
  React.useEffect(() => {
    console.log('🗺️ MapOverlaysContainer state update:', {
      isMapReady,
      hasMapRef: !!mapRef?.current,
      selectedState,
      showRouteStats,
      isDragging
    });
  }, [isMapReady, mapRef?.current, selectedState, showRouteStats, isDragging]);

  return (
    <>
      {/* Clear Selection Button */}
      <ClearSelectionOverlay
        selectedState={selectedState}
        onClearSelection={onClearSelection}
        isDragging={isDragging}
      />

      {/* Enhanced Zoom Controls */}
      <ZoomControlsOverlay
        isMapReady={isMapReady}
        mapRef={mapRef}
      />

      {/* Route Statistics Overlay */}
      <RouteStatsOverlay
        showRouteStats={showRouteStats}
        isMapReady={isMapReady}
        onToggleRouteStats={onToggleRouteStats}
      />
    </>
  );
};

export default MapOverlaysContainer;
