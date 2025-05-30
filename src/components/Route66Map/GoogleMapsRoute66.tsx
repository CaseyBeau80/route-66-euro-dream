
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
import { mapOptions, center } from './config/MapConfig';

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
    
    // Initial setup - determine what to show
    if (selectedState) {
      // If a state is selected, focus on that state
      const stateTowns = visibleTowns.filter(town => 
        town.name.toLowerCase().includes(selectedState.toLowerCase())
      );
      
      if (stateTowns.length > 0) {
        const stateBounds = new google.maps.LatLngBounds();
        stateTowns.forEach(town => {
          stateBounds.extend({lat: town.latLng[0], lng: town.latLng[1]});
        });
        map.fitBounds(stateBounds, { top: 50, right: 50, bottom: 50, left: 50 });
      }
    } else {
      // No state selected, show the whole route with a focus on the central section
      // This gives a view similar to the reference image focusing on OK/MO/IL
      map.setZoom(5);
      map.setCenter({lat: 37.0, lng: -94.0}); // Center on Oklahoma/Missouri area
    }
    
    // Set the map as initialized
    setMapInitialized(true);
    console.log('🎯 Route 66 map loaded and ready for GeoJSON overlay');
  }, [visibleTowns, selectedState, setCurrentZoom, setIsDragging]);

  // Show error if Maps failed to load
  if (loadError) {
    return <MapLoadError error="Failed to load Google Maps API." />;
  }

  // Show loading indicator while Maps is loading
  if (!isLoaded) {
    return <MapLoadingIndicator />;
  }

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
        {/* Route 66 GeoJSON overlay and reference markers */}
        {mapInitialized && mapRef.current && (
          <MapOverlays map={mapRef.current} useEnhancedStatic={false} />
        )}
        
        {/* Draw markers for each town */}
        <TownMarkers 
          towns={visibleTowns} 
          activeMarker={activeMarker}
          onMarkerClick={handleMarkerClick}
        />
      </MapInitializer>
    </div>
  );
};

export default GoogleMapsRoute66;
