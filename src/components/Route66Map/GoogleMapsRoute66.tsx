
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
import UltraSmoothRouteRenderer from './services/UltraSmoothRouteRenderer';
import RouteStatisticsOverlay from './components/RouteStatisticsOverlay';
import ClusterManager from './components/markers/ClusterManager';
import { useMapBounds } from './components/MapBounds';
import { useMapEventHandlers } from './components/MapEventHandlers';

// Import individual components for non-clustered rendering when needed
import HiddenGemsContainer from './components/HiddenGemsContainer';
import AttractionsContainer from './components/AttractionsContainer';
import DestinationCitiesContainer from './components/DestinationCitiesContainer';

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
  const [useClusteringMode, setUseClusteringMode] = useState(true);
  
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

  console.log('🗺️ Rendering GoogleMapsRoute66 with clustering', {
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

      {/* Clustering toggle button */}
      {mapEventHandlers.isMapReady && (
        <div className="absolute top-4 right-4 z-[10000]">
          <button
            onClick={() => setUseClusteringMode(!useClusteringMode)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium shadow-lg hover:bg-gray-50 transition-colors"
          >
            {useClusteringMode ? '📍 Clustered' : '🔍 Individual'}
          </button>
        </div>
      )}
      
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
                
                {/* Conditional rendering based on clustering mode */}
                {useClusteringMode ? (
                  <ClusterManager
                    map={mapRef.current}
                    hiddenGems={[]} // ClusterManager will load real data internally
                    attractions={attractions}
                    destinations={destinations}
                    onGemClick={(gem) => {
                      console.log('✨ Hidden gem selected (clustered):', gem.title);
                    }}
                    onAttractionClick={(attraction) => {
                      console.log('🎯 Attraction selected (clustered):', attraction.name);
                    }}
                    onDestinationClick={(destination) => {
                      console.log('🏛️ Destination city selected (clustered):', destination.name);
                    }}
                  />
                ) : (
                  <>
                    {/* Render Hidden Gems with hover cards */}
                    <HiddenGemsContainer 
                      map={mapRef.current}
                      onGemClick={(gem) => {
                        console.log('✨ Hidden gem selected:', gem.title);
                      }}
                    />
                    
                    {/* Render Destination Cities with hover cards */}
                    <DestinationCitiesContainer
                      map={mapRef.current}
                      waypoints={destinations}
                      onDestinationClick={(destination) => {
                        console.log('🏛️ Destination city selected:', destination.name);
                      }}
                    />
                    
                    {/* Render Attractions with improved zoom-based filtering */}
                    <AttractionsContainer
                      map={mapRef.current}
                      waypoints={attractions}
                      onAttractionClick={(attraction) => {
                        console.log('🎯 Attraction selected:', attraction.name);
                      }}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </MapInitializer>
    </div>
  );
};

export default GoogleMapsRoute66;
