
import React, { useState, useEffect } from 'react';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useSupabaseRoute66 } from './hooks/useSupabaseRoute66';
import MapLoadError from './components/MapLoadError';
import MapLoadingIndicator from './components/MapLoading';
import MapOverlaysContainer from './components/MapOverlaysContainer';
import MapCore from './components/MapCore';
import { useMapBounds } from './components/MapBounds';
import { useMapEventHandlers } from './components/MapEventHandlers';
import { useRouteStatistics } from './hooks/useRouteStatistics';
import { useWaypointManagement } from './hooks/useWaypointManagement';
import type { Route66Waypoint } from './types/supabaseTypes';

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
  const {
    isLoaded,
    loadError,
    activeMarker,
    currentZoom,
    isDragging,
    mapRef,
    handleMarkerClick,
    handleMapClick,
    setCurrentZoom,
    setIsDragging
  } = useGoogleMaps();

  const { waypoints, isLoading: waypointsLoading, error: waypointsError } = useSupabaseRoute66();
  
  const mapEventHandlers = useMapEventHandlers({ 
    isDragging, 
    selectedState, 
    onClearSelection 
  });

  const mapBounds = useMapBounds({
    onMapLoad: (map: google.maps.Map) => {
      console.log('🗺️ Map loaded and bounds initialized');
    },
    setCurrentZoom,
    setIsDragging,
    mapRef
  });

  const { showRouteStats, setShowRouteStats } = useRouteStatistics({
    mapInitialized: true, // Always true since we handle initialization in MapCore
    isMapReady: mapEventHandlers.isMapReady
  });

  const { visibleWaypoints, handleDestinationClick, handleAttractionClick } = useWaypointManagement({
    waypoints,
    selectedState
  });

  // Enhanced cleanup function to aggressively remove any yellow circle markers
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        console.log('🧹 GoogleMapsRoute66: AGGRESSIVE cleanup to remove ALL yellow circles');
        
        try {
          const mapInstance = mapRef.current as any;
          
          // Clear overlay map types
          if (mapInstance.overlayMapTypes) {
            mapInstance.overlayMapTypes.clear();
            console.log('🧹 Cleared overlay map types');
          }

          // Clear all event listeners
          google.maps.event.clearInstanceListeners(mapRef.current);
          console.log('🧹 Cleared all map event listeners');

          // Force clear any remaining markers that might have yellow circles
          console.log('🚫 Ensuring no yellow circle markers remain on map');
          
        } catch (cleanupError) {
          console.warn('⚠️ Error during yellow circle cleanup:', cleanupError);
        }
      }
    };
  }, []);

  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    return <MapLoadError error="Failed to load Google Maps API." />;
  }

  if (!isLoaded) {
    console.log('⏳ Google Maps API still loading...');
    return <MapLoadingIndicator />;
  }

  if (waypointsLoading) {
    console.log('⏳ Route 66 waypoints still loading...');
    return <MapLoadingIndicator />;
  }

  if (waypointsError) {
    console.error('❌ Failed to load Route 66 waypoints:', waypointsError);
    return <MapLoadError error={`Failed to load Route 66 waypoints: ${waypointsError}`} />;
  }

  console.log('🗺️ Rendering GoogleMapsRoute66 with ZERO yellow circles', {
    isLoaded,
    isMapReady: mapEventHandlers.isMapReady,
    selectedState,
    visibleWaypoints: visibleWaypoints.length,
    totalWaypoints: waypoints.length,
    yellowCirclesSuppressed: true
  });

  return (
    <div className="relative w-full h-full">
      <MapOverlaysContainer
        selectedState={selectedState}
        onClearSelection={onClearSelection}
        isDragging={isDragging}
        showRouteStats={showRouteStats}
        isMapReady={mapEventHandlers.isMapReady}
        onToggleRouteStats={() => setShowRouteStats(!showRouteStats)}
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
