
import React, { useState } from "react";
import { MapStatesComponent } from "./MapStates";
import { MapCitiesComponent } from "./MapCities";
import { Route66LineComponent } from "./Route66Line";
import MapTitle from "./MapElements/MapTitle";
import Route66Badge from "./MapElements/Route66Badge";
import ClearSelectionButton from "./MapElements/ClearSelectionButton";
import MapBackground from "./MapElements/MapBackground";
import MapSvgContainer from "./MapElements/MapSvgContainer";
import ZoomControls from "./MapElements/ZoomControls";
import { route66States } from "./mapData";

interface MapRendererReactProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

// Major cities along Route 66 with proper coordinates
const majorCities = [
  { x: 147, y: 391, name: "Los Angeles" },
  { x: 212, y: 375, name: "Flagstaff" },
  { x: 290, y: 350, name: "Albuquerque" },
  { x: 362, y: 330, name: "Amarillo" },
  { x: 446, y: 335, name: "Oklahoma City" },
  { x: 506, y: 320, name: "St. Louis" },
  { x: 618, y: 280, name: "Chicago" }
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
  // Zoom state management
  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 4;
  const ZOOM_STEP = 0.5;

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - ZOOM_STEP, MIN_ZOOM));
  };

  return (
    <div className="relative w-full h-full">
      <MapTitle />
      <Route66Badge />
      
      {selectedState && (
        <ClearSelectionButton 
          selectedState={selectedState} 
          onClearSelection={onClearSelection} 
        />
      )}
      
      {/* Add ZoomControls component */}
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentZoom={zoom}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
      />
      
      <MapBackground>
        <MapSvgContainer zoom={zoom} minZoom={MIN_ZOOM} maxZoom={MAX_ZOOM}>
          <MapStatesComponent 
            selectedState={selectedState}
            onStateClick={onStateClick}
          />
          <Route66LineComponent animated={true} />
          <MapCitiesComponent cities={majorCities} />
        </MapSvgContainer>
      </MapBackground>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow-md z-10 flex flex-col gap-2">
        <div className="text-xs font-bold mb-1">Legend</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#5D7B93]"></div>
          <div className="text-xs">Route 66 States</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#d3d3d3]"></div>
          <div className="text-xs">Other States</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#D92121]"></div>
          <div className="text-xs">Route 66</div>
        </div>
      </div>
    </div>
  );
};

export default MapRendererReact;
