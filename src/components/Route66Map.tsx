
import { useRouteMap } from "@/hooks/useRouteMap";
import MapLoading from "./Route66Map/MapLoading";

const Route66Map = () => {
  const { mapRef, isMapInitialized, loadingError, handleRetry } = useRouteMap();

  return (
    <div className="my-8 px-4">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Explore Route 66</h2>
      
      {/* Map container - only shown when initialized */}
      <div
        ref={mapRef}
        className="w-full h-[600px] rounded-xl shadow-lg border border-gray-200"
        style={{
          display: isMapInitialized ? "block" : "none"
        }}
      ></div>
      
      {/* Loading/Error states */}
      {!isMapInitialized && <MapLoading error={loadingError} onRetry={handleRetry} />}
    </div>
  );
};

export default Route66Map;
