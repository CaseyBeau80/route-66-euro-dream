
import React, { useState, useEffect, useCallback } from 'react';
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
    mapInitialized: true,
    isMapReady: mapEventHandlers.isMapReady
  });

  const { visibleWaypoints, handleDestinationClick, handleAttractionClick } = useWaypointManagement({
    waypoints,
    selectedState
  });

  // Simple cleanup effect
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        console.log('🧹 GoogleMapsRoute66: Simple cleanup');
        
        try {
          const mapInstance = mapRef.current as any;
          
          if (mapInstance.overlayMapTypes) {
            mapInstance.overlayMapTypes.clear();
          }

          if (window.google?.maps?.event) {
            google.maps.event.clearInstanceListeners(mapRef.current);
          }

          console.log('✅ Simple cleanup completed');
          
        } catch (cleanupError) {
          console.error('❌ Error during cleanup:', cleanupError);
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

  console.log('🗺️ Rendering GoogleMapsRoute66 with simplified zoom controls', {
    isLoaded,
    isMapReady: mapEventHandlers.isMapReady,
    selectedState,
    visibleWaypoints: visibleWaypoints.length,
    totalWaypoints: waypoints.length,
    hasMapRef: !!mapRef.current
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
