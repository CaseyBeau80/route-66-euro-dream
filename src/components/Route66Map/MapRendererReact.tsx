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
  
  // New Mexico - Adjusted coordinates
  { x: 350, y: 390, name: "Tucumcari" },
  { x: 320, y: 380, name: "Santa Fe" },
  { x: 310, y: 390, name: "Albuquerque" },
  { x: 280, y: 395, name: "Gallup" },
  
  // Arizona - Adjusted coordinates
  { x: 255, y: 395, name: "Winslow" },
  { x: 235, y: 400, name: "Flagstaff" },
  { x: 215, y: 405, name: "Kingman" },
  
  // California - Adjusted coordinates
  { x: 190, y: 410, name: "Needles" },
  { x: 170, y: 420, name: "Barstow" },
  { x: 155, y: 425, name: "San Bernardino" },
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
