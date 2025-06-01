
import React from 'react';
import { GoogleMapsProvider, useGoogleMapsContext } from './components/GoogleMapsProvider';
import { MapStateManager } from './components/MapStateManager';
import { WaypointManager } from './components/WaypointManager';
import { MapCleanupManager } from './components/MapCleanupManager';
import { MapErrorHandler } from './components/MapErrorHandler';
import MapOverlaysContainer from './components/MapOverlaysContainer';
import MapCore from './components/MapCore';

interface GoogleMapsRoute66Props {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

const GoogleMapsRoute66: React.FC<GoogleMapsRoute66Props> = ({ 
  selectedState,
  onStateClick,
  onClearSelection
}: GoogleMapsRoute66Props) => {
  return (
    <GoogleMapsProvider>
      <MapErrorHandler>
        <MapStateManager
          selectedState={selectedState}
          onClearSelection={onClearSelection}
        >
          {({ mapEventHandlers, mapBounds, showRouteStats, setShowRouteStats }) => (
            <WaypointManager selectedState={selectedState}>
              {({ visibleWaypoints, handleDestinationClick, handleAttractionClick }) => (
                <GoogleMapsRoute66Core
                  selectedState={selectedState}
                  onClearSelection={onClearSelection}
                  mapEventHandlers={mapEventHandlers}
                  mapBounds={mapBounds}
                  showRouteStats={showRouteStats}
                  setShowRouteStats={setShowRouteStats}
                  visibleWaypoints={visibleWaypoints}
                  handleDestinationClick={handleDestinationClick}
                  handleAttractionClick={handleAttractionClick}
                />
              )}
            </WaypointManager>
          )}
        </MapStateManager>
        <MapCleanupManager />
      </MapErrorHandler>
    </GoogleMapsProvider>
  );
};

interface GoogleMapsRoute66CoreProps {
  selectedState: string | null;
  onClearSelection: () => void;
  mapEventHandlers: any;
  mapBounds: any;
  showRouteStats: boolean;
  setShowRouteStats: (show: boolean) => void;
  visibleWaypoints: any[];
  handleDestinationClick: (destination: any) => void;
  handleAttractionClick: (attraction: any) => void;
}

const GoogleMapsRoute66Core: React.FC<GoogleMapsRoute66CoreProps> = ({
  selectedState,
  onClearSelection,
  mapEventHandlers,
  mapBounds,
  showRouteStats,
  setShowRouteStats,
  visibleWaypoints,
  handleDestinationClick,
  handleAttractionClick
}) => {
  const { isDragging, mapRef, handleMapClick } = useGoogleMapsContext();

  console.log('🗺️ Rendering GoogleMapsRoute66 with refactored components', {
    isMapReady: mapEventHandlers.isMapReady,
    selectedState,
    visibleWaypoints: visibleWaypoints.length,
    hasMapRef: !!mapRef?.current
  });

  return (
    <div className="relative w-full h-full">
      {/* Simplified overlays - only pass essential props */}
      <MapOverlaysContainer
        selectedState={selectedState}
        onClearSelection={onClearSelection}
        isDragging={isDragging}
        showRouteStats={showRouteStats}
        isMapReady={mapEventHandlers.isMapReady}
        onToggleRouteStats={() => setShowRouteStats(!showRouteStats)}
        mapRef={mapRef}
      />
      
      <MapCore
        mapRef={mapRef}
        isMapReady={mapEventHandlers.isMapReady}
        visibleWaypoints={visibleWaypoints}
        onMapLoad={mapBounds.handleMapLoad}
        onMapClick={handleMapClick}
        onMapReady={mapEventHandlers.onMapReady}
        onDestinationClick={handleDestinationClick}
        onAttractionClick={handleAttractionClick}
      />
    </div>
  );
};

export default GoogleMapsRoute66;
