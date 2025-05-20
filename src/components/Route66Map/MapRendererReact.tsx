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

// Cities along Route 66 with coordinates precisely aligned with the corrected route path
// Path follows from Chicago (east) to Santa Monica (west)
const majorCities = [
  // Illinois
  { x: 618, y: 205, name: "Chicago" },
  { x: 610, y: 218, name: "Joliet" },
  { x: 605, y: 230, name: "Springfield, IL" },
  
  // Missouri
  { x: 588, y: 248, name: "St. Louis" },
  { x: 560, y: 275, name: "Springfield, MO" },
  { x: 545, y: 290, name: "Joplin" },
  
  // Kansas (small segment)
  { x: 525, y: 300, name: "Galena, KS" },
  
  // Oklahoma
  { x: 495, y: 310, name: "Tulsa" },
  { x: 465, y: 320, name: "Oklahoma City" },
  
  // Texas
  { x: 395, y: 330, name: "Amarillo" },
  
  // New Mexico
  { x: 365, y: 333, name: "Tucumcari" },
  { x: 350, y: 335, name: "Santa Fe" },
  { x: 320, y: 338, name: "Albuquerque" },
  { x: 290, y: 342, name: "Gallup" },
  
  // Arizona
  { x: 260, y: 346, name: "Winslow" },
  { x: 230, y: 350, name: "Flagstaff" },
  { x: 190, y: 354, name: "Kingman" },
  
  // California
  { x: 170, y: 359, name: "Needles" },
  { x: 150, y: 364, name: "Barstow" },
  { x: 140, y: 368, name: "San Bernardino" },
  { x: 125, y: 382, name: "Los Angeles" },
  { x: 120, y: 410, name: "Santa Monica" }
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
