
import React from "react";
import { MapStatesComponent } from "../MapStates";
import { MapCitiesComponent } from "../MapCities";
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
      <MapStatesComponent 
        selectedState={selectedState}
        onStateClick={onStateClick}
      />
      <Route66LineComponent animated={true} />
      <MapCitiesComponent cities={cities} />
    </>
  );
};

export default MapContent;
