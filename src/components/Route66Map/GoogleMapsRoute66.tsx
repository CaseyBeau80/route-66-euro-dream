
import React, { useState } from 'react';
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
import AttractionsContainer from './components/AttractionsContainer';
import DestinationCitiesContainer from './components/DestinationCitiesContainer';
import RouteDisplayManager from './components/RouteDisplayManager';
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

  console.log('🗺️ Rendering GoogleMapsRoute66 component with enhanced Supabase integration, Hidden Gems, Attractions, and Destination Cities', {
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
      
      <MapInitializer onLoad={mapBounds.handleMapLoad} onClick={handleMapClick}>
        {mapInitialized && mapRef.current && (
          <>
            <MapInitializationService 
              map={mapRef.current} 
              onMapReady={mapEventHandlers.onMapReady}
            />
            
            {/* Add state highlighting as the base layer */}
            <StateHighlighting map={mapRef.current} />
            
            <RouteDisplayManager 
              map={mapRef.current}
              isMapReady={mapEventHandlers.isMapReady}
            />
            
            {mapEventHandlers.isMapReady && (
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
                  waypoints={visibleWaypoints}
                  onDestinationClick={(destination) => {
                    console.log('🏛️ Destination city selected:', destination.name);
                  }}
                />
                
                {/* Render Attractions (regular stops) with hover cards */}
                <AttractionsContainer
                  map={mapRef.current}
                  waypoints={visibleWaypoints}
                  onAttractionClick={(attraction) => {
                    console.log('🎯 Attraction selected:', attraction.name);
                  }}
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
