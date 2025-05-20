
import React, { useState, useEffect } from "react";
import Route66Badge from "./MapElements/Route66Badge";
import ClearSelectionButton from "./MapElements/ClearSelectionButton";
import MapBackground from "./MapElements/MapBackground";
import MapSvgContainer from "./MapElements/MapSvgContainer";
import ZoomControls from "./MapElements/ZoomControls";
import InteractionIndicators from "./MapElements/InteractionIndicators";
import MapContent from "./MapElements/MapContent";
import { useZoomControls } from "./hooks/useZoomControls";

interface MapRendererReactProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

// Cities along Route 66 with completely revised coordinates to match the map projection
const majorCities = [
  // Illinois
  { x: 615, y: 240, name: "Chicago" },
  { x: 600, y: 255, name: "Joliet" },
  { x: 590, y: 275, name: "Springfield, IL" },
  
  // Missouri
  { x: 565, y: 305, name: "St. Louis" },
  { x: 535, y: 325, name: "Springfield, MO" },
  { x: 515, y: 334, name: "Joplin" },
  
  // Kansas (small segment)
  { x: 505, y: 334, name: "Galena, KS" },
  
  // Oklahoma
  { x: 475, y: 348, name: "Tulsa" },
  { x: 445, y: 358, name: "Oklahoma City" },
  
  // Texas
  { x: 390, y: 380, name: "Amarillo" },
  
  // New Mexico - Completely revised coordinates
  { x: 350, y: 385, name: "Tucumcari" },
  { x: 325, y: 380, name: "Santa Fe" },
  { x: 310, y: 390, name: "Albuquerque" },
  { x: 280, y: 395, name: "Gallup" },
  
  // Arizona - Completely revised coordinates
  { x: 255, y: 390, name: "Winslow" },
  { x: 230, y: 385, name: "Flagstaff" },
  { x: 195, y: 385, name: "Kingman" },
  
  // California - Completely revised coordinates
  { x: 175, y: 395, name: "Needles" },
  { x: 160, y: 410, name: "Barstow" },
  { x: 150, y: 420, name: "San Bernardino" },
  { x: 140, y: 425, name: "Los Angeles" },
  { x: 137, y: 430, name: "Santa Monica" }
];

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
  const MAX_ZOOM = 5; // Increased max zoom for better detail on mobile
  const ZOOM_STEP = 0.5;
  
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
    zoomStep: ZOOM_STEP
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

  return (
    <div className="relative w-full h-full">
      {/* Route 66 Shield Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Route66Badge />
      </div>
      
      {selectedState && (
        <ClearSelectionButton 
          selectedState={selectedState} 
          onClearSelection={onClearSelection} 
        />
      )}
      
      {/* Enhanced ZoomControls component */}
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentZoom={zoom}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
      />
      
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
