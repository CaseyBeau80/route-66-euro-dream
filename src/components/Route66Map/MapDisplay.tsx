
import { useEffect, useRef } from "react";
import TownsList from "./TownsList";
import { route66States } from "./mapData";
import { route66Towns } from "@/types/route66";
import MapRenderer from "./MapRenderer";
import MapRendererReact from "./MapRendererReact";

interface MapDisplayProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

const MapDisplay = ({ selectedState, onStateClick }: MapDisplayProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Ensure the map container has the proper height before rendering
    if (mapContainerRef.current) {
      mapContainerRef.current.style.height = '500px';
    }
    
    const mapRenderer = MapRenderer({
      selectedState,
      onStateClick,
      onClearSelection: () => onStateClick('', ''),
      mapContainerRef
    });
    
    mapRenderer.renderRouteMap();
  }, [selectedState, onStateClick]);
  
  const getVisibleTowns = () => {
    // Filter towns if state is selected
    if (selectedState) {
      const stateName = route66States.find(s => s.id === selectedState)?.name || '';
      // Filter towns where the name includes the state abbreviation or name
      return route66Towns.filter(town => town.name.includes(stateName) || town.name.endsWith(`, ${selectedState}`));
    }
    return route66Towns;
  };

  // Get towns to show based on selected state
  const visibleTowns = getVisibleTowns();

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        id="route66-map-container"
        className="w-full h-[500px] rounded-xl shadow-lg border border-gray-200 bg-[#f8f8f8]"
      >
        {/* React-based renderer (future implementation) */}
        {/* <MapRendererReact 
          selectedState={selectedState}
          onStateClick={onStateClick}
          onClearSelection={() => onStateClick('', '')}
        /> */}
      </div>
      
      {/* Towns list positioned at the bottom */}
      <div className="mt-4">
        <TownsList towns={visibleTowns} />
      </div>
    </div>
  );
};

export default MapDisplay;
