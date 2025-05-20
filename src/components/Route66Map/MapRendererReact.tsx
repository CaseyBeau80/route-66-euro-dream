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

// Cities along Route 66 with completely redone coordinates to match the map projection
const majorCities = [
  // Illinois
  { x: 615, y: 240, name: "Chicago" },
  { x: 610, y: 250, name: "Joliet" },
  { x: 600, y: 270, name: "Springfield, IL" },
  
  // Missouri
  { x: 570, y: 300, name: "St. Louis" },
  { x: 540, y: 320, name: "Springfield, MO" },
  { x: 520, y: 330, name: "Joplin" },
  
  // Kansas
  { x: 510, y: 334, name: "Galena, KS" },
  
  // Oklahoma
  { x: 480, y: 346, name: "Tulsa" },
  { x: 450, y: 358, name: "Oklahoma City" },
  
  // Texas
  { x: 390, y: 380, name: "Amarillo" },
  
  // New Mexico - Completely reimagined based on proper state geography
  { x: 370, y: 392, name: "Tucumcari" },
  { x: 340, y: 385, name: "Santa Fe" },
  { x: 330, y: 392, name: "Albuquerque" },
  { x: 300, y: 398, name: "Gallup" },
  
  // Arizona - Completely reimagined based on proper state geography
  { x: 270, y: 392, name: "Winslow" },
  { x: 240, y: 386, name: "Flagstaff" },
  { x: 180, y: 387, name: "Kingman" },
  
  // California - Completely reimagined based on proper state geography
  { x: 165, y: 400, name: "Needles" },
  { x: 150, y: 415, name: "Barstow" },
  { x: 145, y: 420, name: "San Bernardino" },
  { x: 137, y: 430, name: "Los Angeles" },
  { x: 130, y: 435, name: "Santa Monica" }
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
