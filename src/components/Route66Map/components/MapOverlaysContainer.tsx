
import React from 'react';
import Route66Badge from '../MapElements/Route66Badge';
import ClearSelectionButton from '../MapElements/ClearSelectionButton';
import ZoomControls from '../MapElements/ZoomControls';
import RouteStatsOverlay from './overlays/RouteStatsOverlay';

interface MapOverlaysContainerProps {
  selectedState: string | null;
  onClearSelection: () => void;
  isDragging: boolean;
  showRouteStats: boolean;
  isMapReady: boolean;
  onToggleRouteStats: () => void;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
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
  console.log('🎮 MapOverlaysContainer: Rendering with Google Maps zoom controls');

  return (
    <>
      {/* Route 66 Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Route66Badge />
      </div>

      {/* Clear Selection Button */}
      {selectedState && (
        <ClearSelectionButton 
          selectedState={selectedState} 
          onClearSelection={onClearSelection} 
        />
      )}

      {/* Google Maps Zoom Controls */}
      {mapRef.current && isMapReady && (
        <ZoomControls
          onZoomIn={() => {}} // Handled internally by the component
          onZoomOut={() => {}} // Handled internally by the component
          currentZoom={mapRef.current.getZoom() || 4}
          minZoom={3}
          maxZoom={18}
          map={mapRef.current}
        />
      )}

      {/* Route Statistics */}
      {showRouteStats && (
        <RouteStatsOverlay 
          onToggle={onToggleRouteStats}
          isDragging={isDragging}
        />
      )}
    </>
  );
};

export default MapOverlaysContainer;
