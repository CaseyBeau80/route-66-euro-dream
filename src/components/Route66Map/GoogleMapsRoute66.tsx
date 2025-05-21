
import React, { useCallback, useEffect, useState } from 'react';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useTownFiltering } from './hooks/useTownFiltering';
import MapInitializer from './components/MapInitializer';
import MapOverlays from './components/MapOverlays';
import Route66Path from './components/Route66Path';
import TownMarkers from './components/TownMarkers';
import Route66Badge from './MapElements/Route66Badge';
import ClearSelectionButton from './MapElements/ClearSelectionButton';
import ZoomControls from './MapElements/ZoomControls';
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
    route66Path,
    mapRef,
    handleMarkerClick,
    handleMapClick,
    handleZoomIn,
    handleZoomOut,
    setCurrentZoom,
    setIsDragging
  } = useGoogleMaps();

  // Use our town filtering hook - will now filter to only Route 66 states
  const { visibleTowns } = useTownFiltering({ selectedState });
  
  // State to track whether the map has been initialized
  const [mapInitialized, setMapInitialized] = useState(false);
  // State to track the stylized mode
  const [nostalgicMode] = useState(true);

  // Effect to set mapInitialized when the map reference is available
  useEffect(() => {
    if (mapRef.current && !mapInitialized) {
      setMapInitialized(true);
    }
  }, [mapRef.current, mapInitialized]);

  // Add vintage font for nostalgic styling
  useEffect(() => {
    // Load Route 66 themed font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Racing+Sans+One&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      // Clean up font link when component unmounts
      document.head.removeChild(link);
    };
  }, []);

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
    
    // Set initial bounds with padding to focus on Route 66 corridor
    const bounds = new google.maps.LatLngBounds();
    
    // Add all Route 66 towns to bounds
    route66Path.forEach(point => {
      bounds.extend(point);
    });
    
    // Apply padding to the bounds
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    
    // Ensure we don't zoom in too much on initial load
    const listener = google.maps.event.addListener(map, "idle", () => {
      // Force a specific zoom level to see more of the route
      if (map.getZoom() > 5) {
        map.setZoom(5);
      }
      google.maps.event.removeListener(listener);
    });
    
    // Set the map as initialized
    setMapInitialized(true);
  }, [route66Path, setCurrentZoom, setIsDragging]);

  // Show error if Maps failed to load
  if (loadError) {
    return <MapLoadError error="Failed to load Google Maps API." />;
  }

  // Show loading indicator while Maps is loading
  if (!isLoaded) {
    return <MapLoadingIndicator />;
  }

  return (
    <div className={`relative w-full h-full ${nostalgicMode ? 'font-route66' : ''}`}>
      {/* Custom styled header for nostalgic look */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-route66-gradient pb-8 pointer-events-none">
        <h2 className="text-3xl font-bold text-center text-white drop-shadow-md pt-2">
          Historic Route 66
        </h2>
      </div>
      
      {/* Route 66 Shield Badge - with nostalgic styling */}
      <div className="absolute top-4 left-4 z-10">
        <Route66Badge />
      </div>
      
      {/* Clear Selection Button - with nostalgic styling */}
      {selectedState && (
        <ClearSelectionButton 
          selectedState={selectedState} 
          onClearSelection={onClearSelection} 
        />
      )}

      {/* Custom Zoom Controls - with nostalgic styling */}
      <ZoomControls 
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentZoom={currentZoom}
        minZoom={4}
        maxZoom={15}
      />
      
      {/* Map Interaction Hints */}
      <MapInteractionHints isDragging={isDragging} />
      
      {/* Google Map Component */}
      <MapInitializer onLoad={onMapLoad} onClick={handleMapClick}>
        {/* Map overlays added separately - this adds nostalgic illustrations */}
        {mapInitialized && mapRef.current && (
          <MapOverlays map={mapRef.current} />
        )}
        
        {/* Draw Route 66 line - thicker styling */}
        <Route66Path path={route66Path} />
        
        {/* Draw markers for each town - with nostalgic styling */}
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
