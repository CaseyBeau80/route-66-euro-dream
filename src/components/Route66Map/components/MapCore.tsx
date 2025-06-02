
import React, { useState } from 'react';
import MapInitializerCore from './MapInitializerCore';
import DestinationCitiesRoute66Renderer from '../services/DestinationCitiesRoute66Renderer';
import DestinationCitiesContainer from './DestinationCitiesContainer';
import AttractionsContainer from './AttractionsContainer';
import HiddenGemsContainer from './HiddenGemsContainer';
import StateHighlighting from './StateHighlighting';
import ScrollZoomHint from './ScrollZoomHint';
import ZoomControls from './ZoomControls';
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

  // Enhanced map load handler with nuclear cleanup
  const handleMapLoad = async (map: google.maps.Map) => {
    console.log('🗺️ MapCore: Enhanced map load with nuclear cleanup starting');
    
    // Perform nuclear cleanup of any existing polylines
    try {
      await GlobalPolylineCleaner.cleanupAllPolylines(map);
      console.log('✅ Nuclear polyline cleanup completed successfully');
      setRouteCleanupComplete(true);
    } catch (error) {
      console.error('❌ Error during nuclear cleanup:', error);
      setRouteCleanupComplete(true); // Continue anyway
    }
    
    // Call the original onMapLoad
    onMapLoad(map);
  };

  console.log('🗺️ MapCore render with WORKING zoom controls and scroll zoom:', {
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
      
      {/* Working Zoom Controls with proper event handling */}
      {mapRef.current && isMapReady && (
        <div className="absolute inset-0 pointer-events-none z-[999]">
          <ZoomControls
            map={mapRef.current}
            isMapReady={isMapReady}
          />
        </div>
      )}
      
      {/* Scroll Zoom Hint Overlay - only show if needed */}
      <ScrollZoomHint show={showScrollHint} />
      
      {/* Orange State Highlighting */}
      {mapRef.current && isMapReady && (
        <StateHighlighting map={mapRef.current} />
      )}
      
      {/* SINGLE ROUTE SYSTEM: Only DestinationCitiesRoute66Renderer is active */}
      {mapRef.current && isMapReady && routeCleanupComplete && (
        <DestinationCitiesRoute66Renderer
          key={`single-destination-route-${isMapReady}-${routeCleanupComplete}`}
          map={mapRef.current}
          isMapReady={isMapReady}
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
          waypoints={visibleWaypoints}
          onAttractionClick={onAttractionClick}
        />
      )}

      {/* Hidden Gems */}
      {mapRef.current && isMapReady && (
        <HiddenGemsContainer map={mapRef.current} />
      )}
    </div>
  );
};

export default MapCore;
