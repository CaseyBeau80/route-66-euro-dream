
import React from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { useSupabaseRoute66 } from '../../hooks/useSupabaseRoute66';
import { useMapEventHandlers } from '../MapEventHandlers';
import { useMapBounds } from '../MapBounds';
import { useMapState } from '../../hooks/useMapState';
import MapInitializer from '../MapInitializer';
import MapLoadError from '../MapLoadError';
import MapLoadingIndicator from '../MapLoading';
import MapEffects from './MapEffects';
import MapServices from './MapServices';
import MapContent from './MapContent';
import MapControls from './MapControls';

interface MapContainerProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  selectedState,
  onStateClick,
  onClearSelection
}) => {
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
  const { mapInitialized, setMapInitialized, showRouteStats, setShowRouteStats, useClusteringMode, setUseClusteringMode } = useMapState();
  
  const mapEventHandlers = useMapEventHandlers({ 
    isDragging, 
    selectedState, 
    onClearSelection 
  });

  const mapBounds = useMapBounds({
    onMapLoad: () => setMapInitialized(true),
    setCurrentZoom,
    setIsDragging,
    mapRef
  });

  // Filter waypoints by selected state if applicable
  const visibleWaypoints = selectedState 
    ? waypoints.filter(waypoint => waypoint.state === selectedState)
    : waypoints;

  // Split waypoints into attractions and destinations
  const attractions = visibleWaypoints.filter(wp => !wp.is_major_stop);
  const destinations = visibleWaypoints.filter(wp => wp.is_major_stop);

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

  console.log('🗺️ Rendering MapContainer with clustering', {
    isLoaded,
    mapInitialized,
    isMapReady: mapEventHandlers.isMapReady,
    selectedState,
    useClusteringMode,
    visibleWaypoints: visibleWaypoints.length,
    totalWaypoints: waypoints.length
  });

  return (
    <div className="relative w-full h-full">
      {/* Portal root for hover cards - positioned at document body level */}
      <div id="hover-portal-root" className="fixed inset-0 pointer-events-none z-[999999]" />
      
      <MapControls
        selectedState={selectedState}
        onClearSelection={onClearSelection}
        isDragging={isDragging}
        showRouteStats={showRouteStats}
        setShowRouteStats={setShowRouteStats}
        useClusteringMode={useClusteringMode}
        setUseClusteringMode={setUseClusteringMode}
        isMapReady={mapEventHandlers.isMapReady}
      />
      
      <MapInitializer onLoad={mapBounds.handleMapLoad} onClick={handleMapClick}>
        {mapInitialized && mapRef.current && (
          <>
            <MapEffects mapRef={mapRef} />
            
            <MapServices 
              map={mapRef.current}
              mapEventHandlers={mapEventHandlers}
            />
            
            <MapContent
              map={mapRef.current}
              useClusteringMode={useClusteringMode}
              attractions={attractions}
              destinations={destinations}
              isMapReady={mapEventHandlers.isMapReady}
            />
          </>
        )}
      </MapInitializer>
    </div>
  );
};

export default MapContainer;
