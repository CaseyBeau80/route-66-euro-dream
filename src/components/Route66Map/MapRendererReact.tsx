
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

// Cities along Route 66 with adjusted coordinates to match the state paths
const majorCities = [
  // Illinois
  { x: 612, y: 170, name: "Chicago" },
  { x: 602, y: 185, name: "Joliet" },
  { x: 587, y: 205, name: "Springfield, IL" },
  
  // Missouri
  { x: 562, y: 235, name: "St. Louis" },
  { x: 532, y: 255, name: "Springfield, MO" },
  { x: 502, y: 264, name: "Joplin" },
  
  // Kansas (small segment)
  { x: 492, y: 270, name: "Galena, KS" },
  
  // Oklahoma
  { x: 472, y: 278, name: "Tulsa" },
  { x: 427, y: 295, name: "Oklahoma City" },
  
  // Texas
  { x: 367, y: 310, name: "Amarillo" },
  
  // New Mexico - Adjusted coordinates
  { x: 320, y: 320, name: "Tucumcari" },
  { x: 290, y: 325, name: "Santa Fe" },
  { x: 260, y: 325, name: "Albuquerque" },
  { x: 235, y: 325, name: "Gallup" },
  
  // Arizona - Adjusted coordinates
  { x: 210, y: 325, name: "Winslow" },
  { x: 185, y: 330, name: "Flagstaff" },
  { x: 155, y: 340, name: "Kingman" },
  
  // California - Adjusted coordinates
  { x: 140, y: 350, name: "Needles" },
  { x: 130, y: 360, name: "Barstow" },
  { x: 123, y: 367, name: "San Bernardino" },
  { x: 120, y: 370, name: "Los Angeles" },
  { x: 117, y: 375, name: "Santa Monica" }
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
