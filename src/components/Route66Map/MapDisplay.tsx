
import { useRef } from "react";
import TownsList from "./TownsList";
import { route66States } from "./mapData";
import { route66Towns } from "@/types/route66";
import GoogleMapsRoute66 from "./GoogleMapsRoute66";

interface MapDisplayProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

const MapDisplay = ({ selectedState, onStateClick }: MapDisplayProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Get towns to show based on selected state
  const getVisibleTowns = () => {
    // Filter towns if state is selected
    if (selectedState) {
      const stateName = route66States.find(s => s.id === selectedState)?.name || '';
      // Filter towns where the name includes the state abbreviation or name
      return route66Towns.filter(town => 
        town.name.includes(stateName) || 
        town.name.endsWith(`, ${selectedState}`)
      );
    }
    return route66Towns;
  };
  
  const visibleTowns = getVisibleTowns();
  const handleClearSelection = () => onStateClick('', '');

  return (
    <div className="relative w-full">
      <div
        ref={mapContainerRef}
        id="route66-map-container"
        className="w-full h-[80vh] md:h-[700px] rounded-xl shadow-lg border border-gray-200 bg-[#f8f8f8]"
      >
        {/* Use the Google Maps component instead of the SVG renderer */}
        <GoogleMapsRoute66 
          selectedState={selectedState}
          onStateClick={onStateClick}
          onClearSelection={handleClearSelection}
        />
      </div>
      
      {/* Towns list positioned at the bottom */}
      <div className="mt-4">
        <TownsList towns={visibleTowns} />
      </div>
    </div>
  );
};

export default MapDisplay;
