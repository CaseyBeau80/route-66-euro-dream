
import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface Route66Town {
  latLng: [number, number]; // Explicitly defining as a tuple with 2 numbers
  name: string;
}

const Route66Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  
  useEffect(() => {
    // Check if scripts are loaded
    const checkScriptsLoaded = () => {
      if (
        typeof window.jQuery === 'undefined' || 
        typeof window.jQuery.fn.vectorMap === 'undefined'
      ) {
        console.log("❌ Required scripts not loaded yet, waiting...");
        return false;
      }
      return true;
    };
    
    // Initialize map function
    const initMap = () => {
      if (!mapRef.current) {
        console.log("❌ Map container not found");
        setTimeout(initMap, 100);
        return;
      }
      
      if (!checkScriptsLoaded()) {
        console.log("❌ Required scripts not ready, retrying in 100ms");
        setTimeout(initMap, 100);
        return;
      }
      
      try {
        const $ = window.jQuery;
        console.log("✅ jQuery and jVectorMap loaded successfully, initializing map");
        
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
        
        // Clear any existing map
        if ($(mapRef.current).data('mapObject')) {
          console.log("Cleaning up existing map");
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
          onRegionOver: function(e, code) {
            console.log("Hovering over:", code);
          },
          onMarkerOver: function(e, code) {
            console.log("Hovering over marker:", route66Towns[code].name);
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
      } catch (error) {
        console.error("❌ Error initializing map:", error);
        setTimeout(initMap, 1000); // Retry after a longer delay if we hit an error
      }
    };
    
    // First check if document is already loaded
    if (document.readyState === 'complete') {
      console.log("Document already loaded, initializing map");
      initMap();
    } else {
      // If not, wait for it to load
      console.log("Waiting for document to load...");
      window.addEventListener('load', () => {
        console.log("Document loaded, initializing map");
        initMap();
      });
    }
    
    // Cleanup function
    return () => {
      if (isMapInitialized && window.jQuery && mapRef.current) {
        try {
          const $ = window.jQuery;
          $(mapRef.current).empty();
          console.log("Map cleaned up");
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }
    };
  }, [isMapInitialized]);

  return (
    <div className="my-8 px-4">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Explore Route 66</h2>
      <div
        ref={mapRef}
        className="w-full h-[600px] rounded-xl shadow-lg border border-gray-200"
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      ></div>
      {!isMapInitialized && (
        <div className="text-center mt-4 text-gray-500">
          Loading map...
        </div>
      )}
    </div>
  );
};

export default Route66Map;
