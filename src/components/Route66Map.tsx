
import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Route66Town {
  latLng: [number, number]; // Explicitly defining as a tuple with 2 numbers
  name: string;
}

const Route66Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const checkScriptsLoaded = (): boolean => {
    return (
      typeof window !== "undefined" &&
      window.jQuery &&
      window.jQuery.fn &&
      window.jQuery.fn.vectorMap
    );
  };
  
  const initializeMap = () => {
    if (!mapRef.current) {
      console.log("❌ Map container not found");
      return false;
    }
    
    if (!checkScriptsLoaded()) {
      console.log(`❌ Required scripts not ready (attempt ${retryCount + 1})`);
      if (retryCount > 20) {
        setLoadingError("Failed to load map scripts. Please try refreshing the page.");
        return false;
      }
      setRetryCount(prev => prev + 1);
      return false;
    }
    
    try {
      const $ = window.jQuery;
      console.log("✅ jQuery and jVectorMap loaded successfully");
      
      // Define Route 66 towns with properly typed coordinates
      const route66Towns: Route66Town[] = [
        { latLng: [41.8781, -87.6298], name: "Chicago, IL" },
        { latLng: [41.1399, -89.3636], name: "La Salle, IL" },
        { latLng: [39.8317, -89.6501], name: "Springfield, IL" },
        { latLng: [38.6272, -90.1978], name: "St. Louis, MO" },
        { latLng: [37.2090, -93.2923], name: "Springfield, MO" },
        { latLng: [36.9948, -94.7404], name: "Joplin, MO" },
        { latLng: [36.1540, -95.9928], name: "Tulsa, OK" },
        { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
        { latLng: [35.2226, -101.8313], name: "Amarillo, TX" },
        { latLng: [35.0844, -106.6504], name: "Albuquerque, NM" },
        { latLng: [35.1983, -111.6513], name: "Flagstaff, AZ" },
        { latLng: [35.1983, -114.0530], name: "Kingman, AZ" },
        { latLng: [34.8409, -117.0064], name: "Barstow, CA" },
        { latLng: [34.0522, -118.2437], name: "Los Angeles, CA" },
      ];
      
      // Clean up any existing map instance
      if ($(mapRef.current).data('mapObject')) {
        try {
          $(mapRef.current).empty();
        } catch (e) {
          console.error("Error cleaning existing map:", e);
        }
      }
      
      // Initialize the map
      $(mapRef.current).vectorMap({
        map: "us_aea_en",
        backgroundColor: "transparent",
        regionStyle: {
          initial: { fill: "#dddddd" },
          hover: { fill: "#ff6666" },
          selected: { fill: "#ff0000" }
        },
        markers: route66Towns,
        markerStyle: {
          initial: {
            fill: "#ff6666",
            stroke: "#ffffff",
            r: 6
          },
          hover: {
            fill: "#ff0000",
            stroke: "#ffffff",
            r: 8
          },
        },
        onRegionClick: function(e, code) {
          toast({
            title: "State Selected",
            description: `You clicked on ${code.toUpperCase()}`,
          });
        },
        onMarkerClick: function(e, code) {
          toast({
            title: "Town Selected",
            description: `You clicked on ${route66Towns[code].name}`,
          });
        }
      });
      
      setIsMapInitialized(true);
      console.log("✅ Map initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Error initializing map:", error);
      setLoadingError("Error initializing map. Please try refreshing the page.");
      return false;
    }
  };
  
  useEffect(() => {
    const attemptMapInitialization = () => {
      if (initializeMap()) {
        return;
      }
      
      // Retry with exponential backoff
      const timeoutId = setTimeout(() => {
        if (retryCount < 20) {
          attemptMapInitialization();
        }
      }, Math.min(100 * Math.pow(1.5, retryCount), 2000));
      
      return () => clearTimeout(timeoutId);
    };
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'complete') {
      attemptMapInitialization();
    } else {
      const handleLoad = () => attemptMapInitialization();
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isMapInitialized && window.jQuery && mapRef.current) {
        try {
          const $ = window.jQuery;
          $(mapRef.current).empty();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }
    };
  }, [isMapInitialized]);

  const handleRetry = () => {
    setLoadingError(null);
    setRetryCount(0);
  };

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
      
      {/* Loading state */}
      {!isMapInitialized && !loadingError && (
        <div className="w-full h-[600px] rounded-xl relative">
          <Skeleton className="w-full h-full rounded-xl" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-2">Loading map...</p>
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {loadingError && (
        <div className="w-full h-[600px] rounded-xl border border-red-300 bg-red-50 flex flex-col items-center justify-center">
          <p className="text-red-600 text-lg mb-4">{loadingError}</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      )}
    </div>
  );
};

export default Route66Map;
