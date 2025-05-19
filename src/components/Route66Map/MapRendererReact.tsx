
import React from "react";
import MapStates from "./MapStates";
import MapCities from "./MapCities";
import Route66Line from "./Route66Line";
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
      
      <ClearSelectionButton 
        selectedState={selectedState} 
        onClearSelection={onClearSelection} 
      />
      
      <MapBackground>
        <MapSvgContainer>
          <MapStates 
            selectedState={selectedState}
            onStateClick={onStateClick}
          />
          <Route66Line animated={true} />
          <MapCities cities={majorCities} />
        </MapSvgContainer>
      </MapBackground>
    </div>
  );
};

export default MapRendererReact;
