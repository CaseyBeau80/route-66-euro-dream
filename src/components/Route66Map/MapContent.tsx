
import React from "react";
import { MapStatesComponent } from "./MapStates";
import { MapCityLabels, MapCityMarkers } from "./MapCities";
import { Route66LineComponent } from "./Route66Line";

interface MapContentProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  cities: Array<{ x: number; y: number; name: string }>;
}

const MapContent = ({ 
  selectedState, 
  onStateClick,
  cities
}: MapContentProps) => {
  return (
    <>
      {/* Render states first (as the base layer) with their own transformation */}
      <g transform="scale(1.05)">
        <MapStatesComponent 
          selectedState={selectedState}
          onStateClick={onStateClick}
        />
      </g>
      
      {/* Render route line and cities with reduced scale but with minimal y-translation */}
      <g transform="scale(0.85) translate(10, 20)">
        {/* Render route line */}
        <Route66LineComponent animated={true} cities={cities} />
        
        {/* Render city markers and labels last (on top of everything) */}
        <MapCityMarkers cities={cities} />
        <MapCityLabels cities={cities} />
      </g>
    </>
  );
};

export default MapContent;
