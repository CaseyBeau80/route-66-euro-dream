
import React, { useCallback, useEffect, useState } from 'react';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useTownFiltering } from './hooks/useTownFiltering';
import MapInitializer from './components/MapInitializer';
import TownMarkers from './components/TownMarkers';
import ClearSelectionButton from './MapElements/ClearSelectionButton';
import MapInteractionHints from './components/MapInteractionHints';
import MapLoadError from './components/MapLoadError';
import MapLoadingIndicator from './components/MapLoading';
import MapInitializationService from './services/MapInitializationService';
import HybridRouteService from './components/directions/HybridRouteService';
import SupabaseRoute66 from './components/SupabaseRoute66';

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
  const [isMapReady, setIsMapReady] = useState(false);
  const [routeDisplayMode, setRouteDisplayMode] = useState<'supabase' | 'hybrid'>('supabase');

  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log('🚀 GoogleMapsRoute66: Map loading callback triggered');
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
    
    // Set initial view optimized for Route 66
    console.log('🎯 Setting initial map view for Route 66');
    map.setZoom(5);
    map.setCenter({ lat: 35.5, lng: -97.5 }); // Centered on Route 66 corridor
    
    setMapInitialized(true);
    console.log('✅ Route 66 map loaded and ready for enhanced Supabase rendering');
  }, [setCurrentZoom, setIsDragging]);

  const onMapReady = useCallback((readyMap: google.maps.Map) => {
    console.log('🎉 GoogleMapsRoute66: Map is fully ready for enhanced Route 66 rendering');
    setIsMapReady(true);
  }, []);

  const handleSupabaseRouteFailure = useCallback(() => {
    console.log('⚠️ Supabase route failed, falling back to hybrid route system');
    setRouteDisplayMode('hybrid');
  }, []);

  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    return <MapLoadError error="Failed to load Google Maps API." />;
  }

  if (!isLoaded) {
    console.log('⏳ Google Maps API still loading...');
    return <MapLoadingIndicator />;
  }

  console.log('🗺️ Rendering GoogleMapsRoute66 component with enhanced Supabase integration', {
    isLoaded,
    mapInitialized,
    isMapReady,
    routeDisplayMode,
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
            <MapInitializationService 
              map={mapRef.current} 
              onMapReady={onMapReady}
            />
            
            {isMapReady && (
              <>
                {routeDisplayMode === 'supabase' ? (
                  <SupabaseRoute66 
                    map={mapRef.current}
                    onRouteError={handleSupabaseRouteFailure}
                  />
                ) : (
                  <HybridRouteService 
                    map={mapRef.current}
                    directionsService={new google.maps.DirectionsService()}
                    onRouteCalculated={(success) => {
                      console.log(`🛣️ Hybrid route calculation completed: ${success ? 'success' : 'failed'}`);
                    }}
                  />
                )}
              </>
            )}
            
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
