
import React, { useCallback, useEffect, useState } from 'react';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useTownFiltering } from './hooks/useTownFiltering';
import MapInitializer from './components/MapInitializer';
import MapOverlays from './components/MapOverlays';
import TownMarkers from './components/TownMarkers';
import ClearSelectionButton from './MapElements/ClearSelectionButton';
import MapInteractionHints from './components/MapInteractionHints';
import MapLoadError from './components/MapLoadError';
import MapLoadingIndicator from './components/MapLoading';

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

  // Use our town filtering hook
  const { visibleTowns } = useTownFiltering({ selectedState });
  
  // State to track whether the map has been initialized
  const [mapInitialized, setMapInitialized] = useState(false);

  // Effect to set mapInitialized when the map reference is available
  useEffect(() => {
    if (mapRef.current && !mapInitialized) {
      setMapInitialized(true);
      console.log('🗺️ Google Maps Route 66 component initialized');
    }
  }, [mapRef.current, mapInitialized]);

  // Map load handler
  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log('🚀 Map loading callback triggered');
    mapRef.current = map;
    
    // Listen for zoom changes
    map.addListener("zoom_changed", () => {
      if (mapRef.current) {
        setCurrentZoom(mapRef.current.getZoom() || 5);
      }
    });
    
    // Listen for drag events to show visual feedback
    map.addListener("dragstart", () => {
      setIsDragging(true);
    });
    
    map.addListener("dragend", () => {
      setTimeout(() => setIsDragging(false), 200);
    });
    
    // Set initial view to show Route 66 corridor
    console.log('🎯 Setting initial map view for Route 66');
    map.setZoom(4);
    map.setCenter({ lat: 36.0, lng: -95.0 }); // Center on Route 66 corridor
    
    // Set the map as initialized
    setMapInitialized(true);
    console.log('✅ Route 66 map loaded and ready for overlays');
  }, [setCurrentZoom, setIsDragging]);

  // Show error if Maps failed to load
  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    return <MapLoadError error="Failed to load Google Maps API." />;
  }

  // Show loading indicator while Maps is loading
  if (!isLoaded) {
    console.log('⏳ Google Maps API still loading...');
    return <MapLoadingIndicator />;
  }

  console.log('🗺️ Rendering GoogleMapsRoute66 component', {
    isLoaded,
    mapInitialized,
    selectedState,
    visibleTowns: visibleTowns.length
  });

  return (
    <div className="relative w-full h-full">
      {/* Clear Selection Button */}
      {selectedState && (
        <ClearSelectionButton 
          selectedState={selectedState} 
          onClearSelection={onClearSelection} 
        />
      )}
      
      {/* Map Interaction Hints */}
      <MapInteractionHints isDragging={isDragging} />
      
      {/* Google Map Component */}
      <MapInitializer onLoad={onMapLoad} onClick={handleMapClick}>
        {/* Route 66 static polyline overlay and reference markers */}
        {mapInitialized && mapRef.current && (
          <>
            <MapOverlays map={mapRef.current} useEnhancedStatic={false} />
            
            {/* Draw markers for each town */}
            <TownMarkers 
              towns={visibleTowns} 
              activeMarker={activeMarker}
              onMarkerClick={handleMarkerClick}
            />
          </>
        )}
      </MapInitializer>
    </div>
  );
};

export default GoogleMapsRoute66;
