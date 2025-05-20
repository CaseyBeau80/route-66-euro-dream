
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
    <g transform="scale(1.08)"> {/* Fine-tuned scale for better alignment */}
      {/* Render states first (as the base layer) */}
      <MapStatesComponent 
        selectedState={selectedState}
        onStateClick={onStateClick}
      />
      
      {/* Render route line second */}
      <Route66LineComponent animated={true} cities={cities} />
      
      {/* Render city markers and labels last (on top of everything) */}
      <MapCityMarkers cities={cities} />
      <MapCityLabels cities={cities} />
    </g>
  );
};

export default MapContent;
