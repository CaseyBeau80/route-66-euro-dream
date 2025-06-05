
import React, { useState } from 'react';
import MapInitializerCore from './MapInitializerCore';
import DestinationCitiesRoute66Renderer from '../services/DestinationCitiesRoute66Renderer';
import DestinationCitiesContainer from './DestinationCitiesContainer';
import AttractionsContainer from './AttractionsContainer';
import HiddenGemsContainer from './HiddenGemsContainer';
import DriveInsContainer from './DriveIns/DriveInsContainer';
import StateHighlighting from './StateHighlighting';
import ScrollZoomHint from './ScrollZoomHint';
import MapDebugPanel from './MapDebugPanel';
import { GlobalPolylineCleaner } from '../services/GlobalPolylineCleaner';
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
  const [routeCleanupComplete, setRouteCleanupComplete] = useState(false);

  // Enhanced map load handler - REDUCED cleanup to preserve route
  const handleMapLoad = async (map: google.maps.Map) => {
    console.log('🗺️ MapCore: Enhanced map load starting with MINIMAL cleanup');
    
    // MINIMAL cleanup - only clear obvious duplicates, preserve main route
    try {
      console.log('🧹 Performing minimal cleanup to preserve main route');
      // Don't perform nuclear cleanup here - let the route renderer handle it
      setRouteCleanupComplete(true);
    } catch (error) {
      console.error('❌ Error during minimal cleanup:', error);
      setRouteCleanupComplete(true); // Continue anyway
    }
    
    // Enable mouse wheel zoom on the map
    map.setOptions({
      scrollwheel: true,
      gestureHandling: 'greedy'
    });
    
    // Call the original onMapLoad
    onMapLoad(map);
  };

  console.log('🗺️ MapCore render - ROUTE PRESERVATION MODE:', {
    isMapReady,
    hasMap: !!mapRef.current,
    visibleWaypoints: visibleWaypoints.length,
    hasGoogleMaps: !!(window.google && window.google.maps),
    showScrollHint,
    routeCleanupComplete,
    activePolylines: mapRef.current ? GlobalPolylineCleaner.getActivePolylineCount() : 0
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
      
      {/* Scroll Zoom Hint Overlay - only show if needed */}
      <ScrollZoomHint show={showScrollHint} />
      
      {/* Orange State Highlighting */}
      {mapRef.current && isMapReady && (
        <StateHighlighting map={mapRef.current} />
      )}
      
      {/* ROUTE SYSTEM: DestinationCitiesRoute66Renderer with IMMEDIATE rendering */}
      {mapRef.current && isMapReady && (
        <DestinationCitiesRoute66Renderer
          key={`route-renderer-${isMapReady}`}
          map={mapRef.current}
          isMapReady={isMapReady}
        />
      )}

      {/* Destination Markers - using destination_cities table */}
      {mapRef.current && isMapReady && (
        <DestinationCitiesContainer
          map={mapRef.current}
          waypoints={visibleWaypoints}
          onDestinationClick={onDestinationClick}
        />
      )}

      {/* Attraction Markers - NOW using attractions table directly */}
      {mapRef.current && isMapReady && (
        <AttractionsContainer
          map={mapRef.current}
          waypoints={[]} // Empty since we're using the attractions table
          onAttractionClick={onAttractionClick}
        />
      )}

      {/* Drive-In Theaters - using drive_ins table */}
      {mapRef.current && isMapReady && (
        <DriveInsContainer
          map={mapRef.current}
          onDriveInClick={(driveIn) => {
            console.log('🎬 Drive-in selected from drive_ins table:', driveIn.name);
          }}
        />
      )}

      {/* Hidden Gems - NOW using hidden_gems table directly */}
      {mapRef.current && isMapReady && (
        <HiddenGemsContainer 
          map={mapRef.current} 
          onGemClick={(gem) => {
            console.log('💎 Hidden gem selected from hidden_gems table:', gem.title);
          }}
        />
      )}

      {/* Debug Panel - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <MapDebugPanel map={mapRef.current} />
      )}
    </div>
  );
};

export default MapCore;
