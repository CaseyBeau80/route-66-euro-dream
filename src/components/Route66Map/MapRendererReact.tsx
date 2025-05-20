
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

// Cities along Route 66 with meticulously adjusted coordinates to match the route path
const majorCities = [
  // Illinois
  { x: 612, y: 230, name: "Chicago" },
  { x: 602, y: 245, name: "Joliet" },
  { x: 587, y: 265, name: "Springfield, IL" },
  
  // Missouri
  { x: 562, y: 295, name: "St. Louis" },
  { x: 532, y: 315, name: "Springfield, MO" },
  { x: 502, y: 324, name: "Joplin" },
  
  // Kansas (small segment)
  { x: 492, y: 330, name: "Galena, KS" },
  
  // Oklahoma
  { x: 472, y: 338, name: "Tulsa" },
  { x: 427, y: 355, name: "Oklahoma City" },
  
  // Texas
  { x: 367, y: 370, name: "Amarillo" },
  
  // New Mexico - Refined coordinates
  { x: 337, y: 380, name: "Tucumcari" },
  { x: 307, y: 385, name: "Santa Fe" },
  { x: 277, y: 385, name: "Albuquerque" },
  { x: 252, y: 385, name: "Gallup" },
  
  // Arizona - Refined coordinates
  { x: 227, y: 385, name: "Winslow" },
  { x: 202, y: 390, name: "Flagstaff" },
  { x: 172, y: 400, name: "Kingman" },
  
  // California - Refined coordinates
  { x: 157, y: 410, name: "Needles" },
  { x: 147, y: 420, name: "Barstow" },
  { x: 140, y: 427, name: "San Bernardino" },
  { x: 137, y: 430, name: "Los Angeles" },
  { x: 134, y: 435, name: "Santa Monica" }
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
