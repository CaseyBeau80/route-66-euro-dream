
import { useState, useEffect } from "react";
import MapDisplay from "./MapDisplay";
import { route66Towns } from "@/types/route66";
import { toast } from "@/components/ui/use-toast";
import MapLoading from "./MapLoading";
import RouteInfo from "./RouteInfo";

/**
 * Main Route 66 Map component
 * Uses Google Maps implementation only (no SVG overlay)
 */
const Route66Map = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    // Short delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      try {
        setLoaded(true);
        console.log("🗺️ Route66Map: Using Google Maps implementation only");
      } catch (err) {
        console.error("Error rendering map:", err);
        setError("Unable to load the Route 66 map. Please try refreshing the page.");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []); 

  const handleRetry = () => {
    setError(null);
    setLoaded(false);
    
    setTimeout(() => {
      try {
        setLoaded(true);
      } catch (err) {
        console.error("Error on retry:", err);
        setError("Unable to load the Route 66 map. Please try refreshing the page.");
      }
    }, 300);
  };

  const handleStateClick = (stateId: string, stateName: string) => {
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
    setSelectedState(null);
    console.log("🗺️ Route66Map: Selection cleared");
  };

  return (
    <div className="my-8 px-2 sm:px-4 w-full">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Historic Highway Map</h2>
      
      {/* Map container */}
      <div className="relative bg-white p-2 sm:p-5 rounded-lg shadow w-full">
        {/* Map display - Google Maps only */}
        {loaded ? (
          <MapDisplay 
            selectedState={selectedState} 
            onStateClick={handleStateClick} 
          />
        ) : (
          <MapLoading error={error} onRetry={handleRetry} />
        )}
        
        {/* Clear selection button overlay for Google Maps */}
        {selectedState && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleClearSelection}
              className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>
      
      {/* Route information and legend */}
      <RouteInfo selectedState={selectedState} />
    </div>
  );
};

export default Route66Map;
