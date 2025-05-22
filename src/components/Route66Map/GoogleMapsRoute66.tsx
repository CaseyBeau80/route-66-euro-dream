
import React, { useCallback, useEffect, useState } from 'react';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useTownFiltering } from './hooks/useTownFiltering';
import MapInitializer from './components/MapInitializer';
import MapOverlays from './components/MapOverlays';
import TownMarkers from './components/TownMarkers';
import Route66Badge from './MapElements/Route66Badge';
import ClearSelectionButton from './MapElements/ClearSelectionButton';
import MapInteractionHints from './components/MapInteractionHints';
import MapLoadError from './components/MapLoadError';
import MapLoadingIndicator from './components/MapLoading';
import { route66StateIds, mapOptions } from './config/MapConfig';

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
    
    // Set initial bounds focusing on Route 66 corridor
    const bounds = new google.maps.LatLngBounds();
    
    // Add all towns to bounds to ensure they're visible
    visibleTowns.forEach(town => {
      bounds.extend({lat: town.latLng[0], lng: town.latLng[1]});
    });
    
    // Apply padding to the bounds to show more context
    map.fitBounds(bounds, { top: 80, right: 80, bottom: 80, left: 80 });
    
    // Ensure we don't zoom in too much on initial load
    const listener = google.maps.event.addListener(map, "idle", () => {
      // Force a lower zoom level to see more of the route
      if (map.getZoom() > 6) {
        map.setZoom(6);
      }
      google.maps.event.removeListener(listener);
    });
    
    // Set the map as initialized
    setMapInitialized(true);
  }, [visibleTowns, setCurrentZoom, setIsDragging]);

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
      {/* Route 66 Shield Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Route66Badge />
      </div>
      
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
        {/* Map overlays added separately */}
        {mapInitialized && mapRef.current && (
          <MapOverlays map={mapRef.current} />
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
