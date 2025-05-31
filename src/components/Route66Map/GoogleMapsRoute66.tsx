
import React, { useState } from 'react';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useTownFiltering } from './hooks/useTownFiltering';
import MapInitializer from './components/MapInitializer';
import ClearSelectionButton from './MapElements/ClearSelectionButton';
import MapInteractionHints from './components/MapInteractionHints';
import MapLoadError from './components/MapLoadError';
import MapLoadingIndicator from './components/MapLoading';
import MapInitializationService from './services/MapInitializationService';
import StateHighlighting from './components/StateHighlighting';
import HiddenGemsContainer from './components/HiddenGemsContainer';
import AttractionsContainer from './components/AttractionsContainer';
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

  const { visibleTowns } = useTownFiltering({ selectedState });
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

  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    return <MapLoadError error="Failed to load Google Maps API." />;
  }

  if (!isLoaded) {
    console.log('⏳ Google Maps API still loading...');
    return <MapLoadingIndicator />;
  }

  console.log('🗺️ Rendering GoogleMapsRoute66 component with enhanced Supabase integration, Hidden Gems, and Attractions', {
    isLoaded,
    mapInitialized,
    isMapReady: mapEventHandlers.isMapReady,
    selectedState,
    visibleTowns: visibleTowns.length
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
                
                {/* Render Attractions (regular stops) with hover cards */}
                <AttractionsContainer
                  map={mapRef.current}
                  waypoints={visibleTowns}
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
