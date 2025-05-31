
import React, { useState, useEffect } from 'react';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useSupabaseRoute66 } from './hooks/useSupabaseRoute66';
import MapInitializer from './components/MapInitializer';
import ClearSelectionButton from './MapElements/ClearSelectionButton';
import MapInteractionHints from './components/MapInteractionHints';
import MapLoadError from './components/MapLoadError';
import MapLoadingIndicator from './components/MapLoading';
import MapInitializationService from './services/MapInitializationService';
import StateHighlighting from './components/StateHighlighting';
import HiddenGemsContainer from './components/HiddenGemsContainer';
import UltraSmoothRouteRenderer from './services/UltraSmoothRouteRenderer';
import RouteStatisticsOverlay from './components/RouteStatisticsOverlay';
import EnhancedClusteringContainer from './components/clustering/EnhancedClusteringContainer';
import { useMapBounds } from './components/MapBounds';
import { useMapEventHandlers } from './components/MapEventHandlers';

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
  const [mapInitialized, setMapInitialized] = useState(false);
  const [showRouteStats, setShowRouteStats] = useState(true);
  
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

  // Auto-hide route stats after 10 seconds
  useEffect(() => {
    if (showRouteStats && mapInitialized) {
      const timer = setTimeout(() => {
        setShowRouteStats(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showRouteStats, mapInitialized]);

  // Cleanup function to remove any existing polylines
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        console.log('🧹 Cleaning up any existing polylines on component unmount');
        
        try {
          const mapInstance = mapRef.current as any;
          
          if (mapInstance.overlayMapTypes) {
            mapInstance.overlayMapTypes.clear();
            console.log('🧹 Cleared overlay map types');
          }

          google.maps.event.clearInstanceListeners(mapRef.current);
          console.log('🧹 Cleared all map event listeners');
          
        } catch (cleanupError) {
          console.warn('⚠️ Error during polyline cleanup:', cleanupError);
        }
      }
    };
  }, []);

  // Filter waypoints by selected state if applicable
  const visibleWaypoints = selectedState 
    ? waypoints.filter(waypoint => waypoint.state === selectedState)
    : waypoints;

  // Handle marker clicks
  const handleWaypointClick = (waypoint: any) => {
    console.log('🎯 Waypoint clicked:', waypoint.name);
  };

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

  console.log('🗺️ Rendering GoogleMapsRoute66 with Enhanced Clustering', {
    isLoaded,
    mapInitialized,
    isMapReady: mapEventHandlers.isMapReady,
    selectedState,
    visibleWaypoints: visibleWaypoints.length,
    totalWaypoints: waypoints.length
  });

  return (
    <div className="relative w-full h-full">
      {selectedState && (
        <ClearSelectionButton 
          selectedState={selectedState} 
          onClearSelection={onClearSelection} 
        />
      )}
      
      <MapInteractionHints isDragging={isDragging} />
      
      {/* Route Statistics Overlay */}
      <RouteStatisticsOverlay 
        isVisible={showRouteStats && mapEventHandlers.isMapReady}
        onToggle={() => setShowRouteStats(!showRouteStats)}
      />
      
      <MapInitializer onLoad={mapBounds.handleMapLoad} onClick={handleMapClick}>
        {mapInitialized && mapRef.current && (
          <>
            <MapInitializationService 
              map={mapRef.current} 
              onMapReady={mapEventHandlers.onMapReady}
            />
            
            {/* Add state highlighting as the base layer */}
            <StateHighlighting map={mapRef.current} />
            
            {mapEventHandlers.isMapReady && (
              <>
                {/* Render the ultra-smooth Route 66 with ~2000 interpolated points */}
                <UltraSmoothRouteRenderer 
                  map={mapRef.current}
                  isMapReady={mapEventHandlers.isMapReady}
                />
                
                {/* Render Hidden Gems with hover cards */}
                <HiddenGemsContainer 
                  map={mapRef.current}
                  onGemClick={(gem) => {
                    console.log('✨ Hidden gem selected:', gem.title);
                  }}
                />
                
                {/* Enhanced Clustering System with Destination City Protection */}
                <EnhancedClusteringContainer
                  map={mapRef.current}
                  waypoints={visibleWaypoints}
                  onMarkerClick={handleWaypointClick}
                />
              </>
            )}
          </>
        )}
      </MapInitializer>
    </div>
  );
};

export default GoogleMapsRoute66;
