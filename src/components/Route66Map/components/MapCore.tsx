
import React, { useState } from 'react';
import MapInitializerCore from './MapInitializerCore';
import CleanSingleRoute from './CleanSingleRoute';
import DestinationCitiesContainer from './DestinationCitiesContainer';
import AttractionsContainer from './AttractionsContainer';
import HiddenGemsContainer from './HiddenGemsContainer';
import DriveInsContainer from './DriveIns/DriveInsContainer';
import StateHighlighting from './StateHighlighting';
import ScrollZoomHint from './ScrollZoomHint';
import MapDebugPanel from './MapDebugPanel';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface MapCoreProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  isMapReady: boolean;
  visibleWaypoints: Route66Waypoint[];
  onMapLoad: (map: google.maps.Map) => void;
  onMapClick: () => void;
  onMapReady: () => void;
  onDestinationClick: (destination: Route66Waypoint) => void;
  onAttractionClick: (attraction: Route66Waypoint) => void;
}

const MapCore: React.FC<MapCoreProps> = ({
  mapRef,
  isMapReady,
  visibleWaypoints,
  onMapLoad,
  onMapClick,
  onMapReady,
  onDestinationClick,
  onAttractionClick
}) => {
  const [showScrollHint, setShowScrollHint] = useState(false);

  const handleMapLoad = async (map: google.maps.Map) => {
    console.log('🗺️ MapCore: Map loaded, setting up controls');
    
    // Enable mouse wheel zoom
    map.setOptions({
      scrollwheel: true,
      gestureHandling: 'greedy'
    });
    
    onMapLoad(map);
  };

  console.log('🗺️ MapCore render - Clean Single Route System:', {
    isMapReady,
    hasMap: !!mapRef.current,
    visibleWaypoints: visibleWaypoints.length
  });

  return (
    <div className="relative w-full h-full">
      {/* Map Initializer */}
      <MapInitializerCore
        mapRef={mapRef}
        onMapLoad={handleMapLoad}
        onMapClick={onMapClick}
        onMapReady={onMapReady}
        setShowScrollHint={setShowScrollHint}
      />
      
      {/* Scroll Zoom Hint */}
      <ScrollZoomHint show={showScrollHint} />
      
      {/* State Highlighting */}
      {mapRef.current && isMapReady && (
        <StateHighlighting map={mapRef.current} />
      )}
      
      {/* Clean Single Route - Simple and Reliable */}
      {mapRef.current && isMapReady && visibleWaypoints.length > 0 && (
        <CleanSingleRoute
          key={`clean-route-${isMapReady}-${visibleWaypoints.length}`}
          map={mapRef.current}
          waypoints={visibleWaypoints}
        />
      )}

      {/* Destination Markers */}
      {mapRef.current && isMapReady && (
        <DestinationCitiesContainer
          map={mapRef.current}
          waypoints={visibleWaypoints}
          onDestinationClick={onDestinationClick}
        />
      )}

      {/* Attraction Markers */}
      {mapRef.current && isMapReady && (
        <AttractionsContainer
          map={mapRef.current}
          waypoints={[]}
          onAttractionClick={onAttractionClick}
        />
      )}

      {/* Drive-In Theaters */}
      {mapRef.current && isMapReady && (
        <DriveInsContainer
          map={mapRef.current}
          onDriveInClick={(driveIn) => {
            console.log('🎬 Drive-in selected:', driveIn.name);
          }}
        />
      )}

      {/* Hidden Gems */}
      {mapRef.current && isMapReady && (
        <HiddenGemsContainer 
          map={mapRef.current} 
          onGemClick={(gem) => {
            console.log('💎 Hidden gem selected:', gem.title);
          }}
        />
      )}

      {/* Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <MapDebugPanel map={mapRef.current} />
      )}
    </div>
  );
};

export default MapCore;
