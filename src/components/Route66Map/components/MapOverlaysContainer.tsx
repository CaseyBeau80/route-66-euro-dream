
import React from 'react';
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
  console.log('🎮 MapOverlaysContainer: Rendering WITHOUT Route66Badge to prevent floating shield');

  return (
    <>
      {/* REMOVED: Route 66 Badge - this was causing the floating shield near Nevada */}
      
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
      <RouteStatsOverlay 
        showRouteStats={showRouteStats}
        isMapReady={isMapReady}
        onToggleRouteStats={onToggleRouteStats}
      />
    </>
  );
};

export default MapOverlaysContainer;
