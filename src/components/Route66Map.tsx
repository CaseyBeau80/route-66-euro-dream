
import { useRouteMap } from "@/hooks/useRouteMap";
import MapLoading from "./Route66Map/MapLoading";
import { useEffect, useState } from "react";

const Route66Map = () => {
  const { mapRef, isMapInitialized, loadingError, handleRetry } = useRouteMap();
  const [loaded, setLoaded] = useState(false);

  // Set loaded after a short delay to ensure rendering has completed
  useEffect(() => {
    if (isMapInitialized) {
      // Mark as loaded immediately to show the map
      setLoaded(true);
    }
  }, [isMapInitialized]);

  return (
    <div className="my-8 px-4">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Explore Route 66</h2>
      
      {/* Map container */}
      <div className="relative">
        {/* Always show the map container, but handle visibility with CSS */}
        <div
          ref={mapRef}
          className="w-full h-[600px] rounded-xl shadow-lg border border-gray-200"
          style={{
            display: loaded ? "block" : "none"
          }}
        ></div>
        
        {/* Loading/Error states */}
        {!loaded && <MapLoading error={loadingError} onRetry={handleRetry} />}
      </div>
      
      <div className="text-center mt-4 text-gray-600">
        <p>Interactive map showing major stops along historic Route 66</p>
      </div>
    </div>
  );
};

export default Route66Map;
