
import React from "react";
import { MapStatesComponent } from "./MapStates";
import { MapCitiesComponent } from "./MapCities";
import { Route66LineComponent } from "./Route66Line";
import MapTitle from "./MapElements/MapTitle";
import Route66Badge from "./MapElements/Route66Badge";
import ClearSelectionButton from "./MapElements/ClearSelectionButton";
import MapBackground from "./MapElements/MapBackground";
import MapSvgContainer from "./MapElements/MapSvgContainer";
import { route66States } from "./mapData";

interface MapRendererReactProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

const majorCities = [
  { x: 195, y: 450, name: "Los Angeles" },
  { x: 270, y: 425, name: "Flagstaff" },
  { x: 380, y: 390, name: "Albuquerque" },
  { x: 450, y: 380, name: "Amarillo" },
  { x: 500, y: 350, name: "Oklahoma City" },
  { x: 580, y: 320, name: "St. Louis" },
  { x: 645, y: 250, name: "Chicago" }
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
      
      <MapBackground>
        <MapSvgContainer>
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
