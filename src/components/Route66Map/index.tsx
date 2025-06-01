
import { useState, useEffect } from "react";
import MapDisplay from "./MapDisplay";
import { route66Towns } from "@/types/route66";
import { toast } from "@/components/ui/use-toast";
import MapLoading from "./MapLoading";
import RouteInfo from "./RouteInfo";

/**
 * Main Route 66 Map component
 * Uses Google Maps implementation with SINGLE route rendering only
 */
const Route66Map = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    console.log("🗺️ Route66Map: Initializing component with SINGLE route system");
    
    // Short delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      try {
        setLoaded(true);
        console.log("🗺️ Route66Map: Component loaded successfully with SINGLE route system");
      } catch (err) {
        console.error("Error rendering map:", err);
        setError("Unable to load the Route 66 map. Please try refreshing the page.");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []); 

  const handleRetry = () => {
    console.log("🔄 Route66Map: Retrying map load with SINGLE route system");
    setError(null);
    setLoaded(false);
    
    setTimeout(() => {
      try {
        setLoaded(true);
        console.log("🗺️ Route66Map: Retry successful with SINGLE route system");
      } catch (err) {
        console.error("Error on retry:", err);
        setError("Unable to load the Route 66 map. Please try refreshing the page.");
      }
    }, 300);
  };

  const handleStateClick = (stateId: string, stateName: string) => {
    console.log(`🎯 Route66Map: State clicked - ${stateName} (${stateId})`);
    setSelectedState(stateId || null);
    
    if (stateId && stateName) {
      // Get towns in the selected state
      const townsInState = route66Towns.filter(town => town.name.includes(stateName));
      
      toast({
        title: `${stateName} Stops`,
        description: `${townsInState.length} historic stops in ${stateName}: ${townsInState.map(town => town.name.split(',')[0]).join(', ')}`,
        duration: 5000,
      });
    }
  };

  const handleClearSelection = () => {
    console.log("🗺️ Route66Map: Clearing state selection");
    setSelectedState(null);
  };

  console.log("🗺️ Route66Map: Rendering with SINGLE route system", { loaded, error, selectedState });

  return (
    <div className="w-full">
      {/* Map container without white background and padding */}
      <div className="relative w-full">
        {/* Show loading or error state */}
        {!loaded && (
          <MapLoading error={error} onRetry={handleRetry} />
        )}
        
        {/* Show map when loaded with increased height and no white container */}
        {loaded && (
          <div className="h-[800px] rounded-lg overflow-hidden shadow-lg">
            <MapDisplay 
              selectedState={selectedState} 
              onStateClick={handleStateClick}
              onClearSelection={handleClearSelection}
            />
          </div>
        )}
      </div>
      
      {/* Route information and legend */}
      <RouteInfo selectedState={selectedState} />
    </div>
  );
};

export default Route66Map;
