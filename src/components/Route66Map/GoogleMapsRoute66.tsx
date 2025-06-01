
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
    mapInitialized: true,
    isMapReady: mapEventHandlers.isMapReady
  });

  const { visibleWaypoints, handleDestinationClick, handleAttractionClick } = useWaypointManagement({
    waypoints,
    selectedState
  });

  // Enhanced mapRef stability tracking
  const [mapRefStabilityCounter, setMapRefStabilityCounter] = useState(0);
  const [isMapRefStable, setIsMapRefStable] = useState(false);

  // Track mapRef changes and stability
  useEffect(() => {
    const hasStableMap = !!(
      mapRef.current && 
      typeof mapRef.current.getZoom === 'function' &&
      typeof mapRef.current.setZoom === 'function' &&
      mapEventHandlers.isMapReady
    );

    setIsMapRefStable(hasStableMap);
    
    if (mapRef.current) {
      setMapRefStabilityCounter(prev => prev + 1);
    }

    console.log('🗺️ GoogleMapsRoute66 mapRef stability check:', {
      hasMapRef: !!mapRef.current,
      hasZoomMethods: !!(mapRef.current && typeof mapRef.current.getZoom === 'function'),
      isMapReady: mapEventHandlers.isMapReady,
      isMapRefStable: hasStableMap,
      stabilityCounter: mapRefStabilityCounter,
      currentZoom: mapRef.current?.getZoom()
    });
  }, [mapRef.current, mapEventHandlers.isMapReady]);

  // Enhanced cleanup with better error handling
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        console.log('🧹 GoogleMapsRoute66: Enhanced cleanup starting');
        
        try {
          const mapInstance = mapRef.current as any;
          
          // Clear overlay map types
          if (mapInstance.overlayMapTypes) {
            mapInstance.overlayMapTypes.clear();
            console.log('🧹 Cleared overlay map types');
          }

          // Clear all event listeners
          if (window.google?.maps?.event) {
            google.maps.event.clearInstanceListeners(mapRef.current);
            console.log('🧹 Cleared all map event listeners');
          }

          console.log('✅ Enhanced cleanup completed successfully');
          
        } catch (cleanupError) {
          console.warn('⚠️ Error during enhanced cleanup:', cleanupError);
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

  console.log('🗺️ Rendering GoogleMapsRoute66 with enhanced zoom controls', {
    isLoaded,
    isMapReady: mapEventHandlers.isMapReady,
    isMapRefStable,
    selectedState,
    visibleWaypoints: visibleWaypoints.length,
    totalWaypoints: waypoints.length,
    stabilityCounter: mapRefStabilityCounter
  });

  return (
    <div className="relative w-full h-full">
      <MapOverlaysContainer
        selectedState={selectedState}
        onClearSelection={onClearSelection}
        isDragging={isDragging}
        showRouteStats={showRouteStats}
        isMapReady={mapEventHandlers.isMapReady && isMapRefStable}
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
