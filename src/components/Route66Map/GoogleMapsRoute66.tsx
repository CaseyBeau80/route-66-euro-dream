
import React, { useCallback, useEffect, useState } from 'react';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useTownFiltering } from './hooks/useTownFiltering';
import MapInitializer from './components/MapInitializer';
import TownMarkers from './components/TownMarkers';
import ClearSelectionButton from './MapElements/ClearSelectionButton';
import MapInteractionHints from './components/MapInteractionHints';
import MapLoadError from './components/MapLoadError';
import MapLoadingIndicator from './components/MapLoading';
import SimpleRoute66Service from './components/SimpleRoute66Service';

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

  useEffect(() => {
    if (mapRef.current && !mapInitialized) {
      setMapInitialized(true);
      console.log('🗺️ Google Maps Route 66 component initialized');
    }
  }, [mapRef.current, mapInitialized]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log('🚀 Map loading callback triggered');
    mapRef.current = map;
    
    // Listen for zoom changes
    map.addListener("zoom_changed", () => {
      if (mapRef.current) {
        setCurrentZoom(mapRef.current.getZoom() || 5);
      }
    });
    
    // Listen for drag events
    map.addListener("dragstart", () => {
      setIsDragging(true);
    });
    
    map.addListener("dragend", () => {
      setTimeout(() => setIsDragging(false), 200);
    });
    
    // Set initial view - the SimpleRoute66Service will adjust bounds
    console.log('🎯 Setting initial map view');
    map.setZoom(4);
    map.setCenter({ lat: 36.0, lng: -95.0 });
    
    setMapInitialized(true);
    console.log('✅ Route 66 map loaded and ready');
  }, [setCurrentZoom, setIsDragging]);

  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    return <MapLoadError error="Failed to load Google Maps API." />;
  }

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
      {selectedState && (
        <ClearSelectionButton 
          selectedState={selectedState} 
          onClearSelection={onClearSelection} 
        />
      )}
      
      <MapInteractionHints isDragging={isDragging} />
      
      <MapInitializer onLoad={onMapLoad} onClick={handleMapClick}>
        {mapInitialized && mapRef.current && (
          <>
            <SimpleRoute66Service map={mapRef.current} />
            
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
