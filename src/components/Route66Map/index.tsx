
import { useState, useEffect } from "react";
import MapDisplay from "./MapDisplay";
import { route66Towns } from "@/types/route66";
import { toast } from "@/components/ui/use-toast";
import MapLoading from "./MapLoading";

const Route66Map = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    // Short delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      try {
        setLoaded(true);
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
        title: `Route 66 through ${stateName}`,
        description: `${townsInState.length} stops in ${stateName}: ${townsInState.map(town => town.name.split(',')[0]).join(', ')}`,
        duration: 5000,
      });
    }
  };

  return (
    <div className="my-8 px-4">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Historic Route 66</h2>
      
      {/* Map container */}
      <div className="relative bg-white p-5 rounded-lg shadow">
        {/* Map display */}
        {loaded ? (
          <MapDisplay 
            selectedState={selectedState} 
            onStateClick={handleStateClick} 
          />
        ) : (
          <MapLoading error={error} onRetry={handleRetry} />
        )}
      </div>
    </div>
  );
};

export default Route66Map;
