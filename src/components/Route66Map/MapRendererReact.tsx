
import React, { useState, useEffect, useCallback } from "react";
import ClearSelectionButton from "./MapElements/ClearSelectionButton";
import MapBackground from "./MapElements/MapBackground";
import MapSvgContainer from "./MapElements/MapSvgContainer";
import InteractionIndicators from "./MapElements/InteractionIndicators";
import MapContent from "./MapElements/MapContent";
import { useZoomControls } from "./hooks/useZoomControls";
import { route66Towns } from "@/types/route66"; 
import { transformTownsToSvgPoints } from "@/utils/mapProjection";

interface MapRendererReactProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

/**
 * React-based implementation of the MapRenderer
 * This can replace the DOM-manipulation based MapRenderer in the future
 */
const MapRendererReact = ({
  selectedState,
  onStateClick,
  onClearSelection
}: MapRendererReactProps) => {
  // Zoom configuration
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 5;
  const ZOOM_STEP = 0.5;
  const INITIAL_ZOOM = 1;
  
  // Transform the lat/lng coordinates to SVG coordinates
  const majorCities = transformTownsToSvgPoints(route66Towns);
  
  // State to track zoom start for center capture
  const [zoomStartCallback, setZoomStartCallback] = useState<(() => void) | null>(null);
  
  const handleZoomStart = useCallback(() => {
    if (zoomStartCallback) {
      zoomStartCallback();
    }
  }, [zoomStartCallback]);
  
  const { 
    zoom, 
    isPinching, 
    zoomActivity, 
    handleZoomIn, 
    handleZoomOut, 
    handleZoomChange 
  } = useZoomControls({
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    zoomStep: ZOOM_STEP,
    initialZoom: INITIAL_ZOOM,
    onZoomStart: handleZoomStart
  });
  
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Reset the drag indicator after a delay
  useEffect(() => {
    if (isDragging) {
      const timer = setTimeout(() => {
        setIsDragging(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isDragging]);

  // Detect drag events
  const handleDragStart = () => {
    setIsDragging(true);
  };

  console.log('🗺️ MapRendererReact: Rendering SVG-based map WITHOUT Route66Badge to prevent floating shield');

  return (
    <div className="relative w-full h-full">
      {/* REMOVED: Route 66 Shield Badge - this was causing the floating shield near Nevada */}
      
      {selectedState && (
        <ClearSelectionButton 
          selectedState={selectedState} 
          onClearSelection={onClearSelection} 
        />
      )}
      
      {/* NO ZOOM CONTROLS HERE - Google Maps handles all zoom functionality */}
      
      <InteractionIndicators 
        isPinching={isPinching}
        zoomActivity={zoomActivity}
        isDragging={isDragging}
        zoom={zoom}
      />
      
      <MapBackground>
        <MapSvgContainer 
          zoom={zoom} 
          minZoom={MIN_ZOOM} 
          maxZoom={MAX_ZOOM}
          onZoomChange={handleZoomChange}
          onDragStart={handleDragStart}
          onZoomStartCallback={setZoomStartCallback}
        >
          <MapContent 
            selectedState={selectedState}
            onStateClick={onStateClick}
            cities={majorCities}
          />
        </MapSvgContainer>
      </MapBackground>
    </div>
  );
};

export default MapRendererReact;
