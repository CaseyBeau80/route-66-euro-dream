
import React from "react";
import { MapStatesComponent } from "../MapStates";
import { MapCityLabels, MapCityMarkers } from "../MapCities";
import { Route66LineComponent } from "../Route66Line";

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
      {/* Render states first */}
      <MapStatesComponent 
        selectedState={selectedState}
        onStateClick={onStateClick}
      />
      
      {/* Render city labels second */}
      <MapCityLabels cities={cities} />
      
      {/* Render route line third */}
      <Route66LineComponent animated={true} />
      
      {/* Render city markers last */}
      <MapCityMarkers cities={cities} />
    </>
  );
};

export default MapContent;
