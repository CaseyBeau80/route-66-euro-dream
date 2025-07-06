
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MapInitializerCore from './MapInitializerCore';
import DestinationCitiesContainer from './DestinationCitiesContainer';
import AttractionsContainer from './AttractionsContainer';
import HiddenGemsContainer from './HiddenGemsContainer';
import DriveInsContainer from './DriveIns/DriveInsContainer';
import StateHighlighting from './StateHighlighting';
import ScrollZoomHint from './ScrollZoomHint';
import MapDebugPanel from './MapDebugPanel';
import NuclearRouteManager from './NuclearRouteManager';
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
  const isMobile = useIsMobile();

  const handleMapLoad = async (map: google.maps.Map) => {
    console.log('🗺️ MapCore: Map loaded, setting up controls');
    
    // Use device-aware gesture handling
    // Desktop: 'cooperative' requires Ctrl+scroll to zoom
    // Mobile: 'greedy' allows normal touch gestures
    const gestureHandling = isMobile ? 'greedy' : 'cooperative';
    
    map.setOptions({
      scrollwheel: true,
      gestureHandling
    });
    
    console.log(`🎯 Gesture handling set to: ${gestureHandling} (${isMobile ? 'mobile' : 'desktop'})`);
    
    onMapLoad(map);
  };

  console.log('☢️ MapCore render - Using NUCLEAR RouteManager ONLY:', {
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
      
      {/* ☢️ NUCLEAR ROUTE MANAGER - THE ONLY ROUTE COMPONENT ☢️ */}
      {mapRef.current && isMapReady && (
        <NuclearRouteManager
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
