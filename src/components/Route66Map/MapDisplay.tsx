
import { useRef } from "react";
import TownsList from "./TownsList";
import { route66Towns } from "@/types/route66";
import GoogleMapsRoute66 from "./GoogleMapsRoute66";
import { getVisibleTowns } from "./utils/townUtils";

interface MapDisplayProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

const MapDisplay = ({ selectedState, onStateClick }: MapDisplayProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Get towns to show based on selected state
  const visibleTowns = getVisibleTowns(selectedState);
  const handleClearSelection = () => onStateClick('', '');

  return (
    <div className="relative w-full">
      <div
        ref={mapContainerRef}
        id="route66-map-container"
        className="w-full h-[80vh] md:h-[700px] rounded-xl shadow-lg border border-gray-200 bg-[#f8f8f8]"
      >
        {/* Use the Google Maps component with restricted bounds */}
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
