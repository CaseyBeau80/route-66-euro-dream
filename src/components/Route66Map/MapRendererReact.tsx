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

// Cities along Route 66 with properly aligned coordinates to match the map projection
const majorCities = [
  // Illinois
  { x: 593, y: 242, name: "Chicago" },
  { x: 588, y: 255, name: "Joliet" },
  { x: 570, y: 275, name: "Springfield, IL" },
  
  // Missouri
  { x: 550, y: 295, name: "St. Louis" },
  { x: 520, y: 320, name: "Springfield, MO" },
  { x: 500, y: 330, name: "Joplin" },
  
  // Kansas
  { x: 495, y: 330, name: "Galena, KS" },
  
  // Oklahoma
  { x: 470, y: 340, name: "Tulsa" },
  { x: 445, y: 355, name: "Oklahoma City" },
  
  // Texas
  { x: 390, y: 375, name: "Amarillo" },
  
  // New Mexico - Refined coordinates
  { x: 330, y: 380, name: "Tucumcari" },
  { x: 305, y: 370, name: "Santa Fe" },
  { x: 300, y: 380, name: "Albuquerque" },
  { x: 265, y: 385, name: "Gallup" },
  
  // Arizona - Refined coordinates
  { x: 240, y: 385, name: "Winslow" },
  { x: 225, y: 385, name: "Flagstaff" },
  { x: 195, y: 395, name: "Kingman" },
  
  // California - Refined coordinates
  { x: 180, y: 400, name: "Needles" },
  { x: 160, y: 415, name: "Barstow" },
  { x: 150, y: 420, name: "San Bernardino" },
  { x: 140, y: 430, name: "Los Angeles" },
  { x: 135, y: 435, name: "Santa Monica" }
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
