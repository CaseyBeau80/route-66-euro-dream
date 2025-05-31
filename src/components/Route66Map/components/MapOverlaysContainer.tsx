
import React from 'react';
import ClearSelectionButton from '../MapElements/ClearSelectionButton';
import CityNavigation from './CityNavigation';
import MapInteractionHints from './MapInteractionHints';
import RouteStatisticsOverlay from './RouteStatisticsOverlay';

interface MapOverlaysContainerProps {
  selectedState: string | null;
  onClearSelection: () => void;
  isDragging: boolean;
  showRouteStats: boolean;
  isMapReady: boolean;
  onToggleRouteStats: () => void;
}

const MapOverlaysContainer: React.FC<MapOverlaysContainerProps> = ({
  selectedState,
  onClearSelection,
  isDragging,
  showRouteStats,
  isMapReady,
  onToggleRouteStats
}) => {
  return (
    <>
      {selectedState && (
        <ClearSelectionButton 
          selectedState={selectedState} 
          onClearSelection={onClearSelection} 
        />
      )}
      
      {/* City Navigation Panel */}
      <CityNavigation />
      
      <MapInteractionHints isDragging={isDragging} />
      
      {/* Route Statistics Overlay */}
      <RouteStatisticsOverlay 
        isVisible={showRouteStats && isMapReady}
        onToggle={onToggleRouteStats}
      />
    </>
  );
};

export default MapOverlaysContainer;
