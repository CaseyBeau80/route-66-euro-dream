
import React from 'react';
import ClearSelectionButton from '../../MapElements/ClearSelectionButton';
import MapInteractionHints from '../MapInteractionHints';
import RouteStatisticsOverlay from '../RouteStatisticsOverlay';

interface MapControlsProps {
  selectedState: string | null;
  onClearSelection: () => void;
  isDragging: boolean;
  showRouteStats: boolean;
  setShowRouteStats: (show: boolean) => void;
  useClusteringMode: boolean;
  setUseClusteringMode: (use: boolean) => void;
  isMapReady: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  selectedState,
  onClearSelection,
  isDragging,
  showRouteStats,
  setShowRouteStats,
  useClusteringMode,
  setUseClusteringMode,
  isMapReady
}) => {
  return (
    <>
      {selectedState && (
        <ClearSelectionButton 
          selectedState={selectedState} 
          onClearSelection={onClearSelection} 
        />
      )}
      
      <MapInteractionHints isDragging={isDragging} />
      
      {/* Route Statistics Overlay */}
      <RouteStatisticsOverlay 
        isVisible={showRouteStats && isMapReady}
        onToggle={() => setShowRouteStats(!showRouteStats)}
      />

      {/* Clustering toggle button */}
      {isMapReady && (
        <div className="absolute top-4 right-4 z-[10000]">
          <button
            onClick={() => setUseClusteringMode(!useClusteringMode)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium shadow-lg hover:bg-gray-50 transition-colors"
          >
            {useClusteringMode ? '📍 Clustered' : '🔍 Individual'}
          </button>
        </div>
      )}
    </>
  );
};

export default MapControls;
