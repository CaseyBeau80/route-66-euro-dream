
import { useEffect, useRef } from "react";

const Route66Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Make sure the DOM is fully loaded before trying to initialize the map
    const initMap = () => {
      if (!mapRef.current || !window.jQuery) {
        console.log("❌ DOM element or jQuery not ready, waiting...");
        setTimeout(initMap, 100);
        return;
      }
      
      const $ = window.jQuery;
      
      // Check if the vectorMap plugin is properly loaded
      if (typeof $.fn.vectorMap === 'undefined') {
        console.log("❌ jVectorMap plugin not available yet, waiting...");
        setTimeout(initMap, 100);
        return;
      }
      
      try {
        console.log("✅ jVectorMap plugin found, initializing map");
        
        // Define Route 66 towns
        const towns = [
          { latLng: [41.8781, -87.6298], name: "Chicago, IL" },
          { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
          { latLng: [34.0522, -118.2437], name: "Los Angeles, CA" },
        ];
        
        // Initialize the map
        $(mapRef.current).vectorMap({
          map: "us_aea_en",
          backgroundColor: "transparent",
          regionStyle: {
            initial: { fill: "#cccccc" },
            hover: { fill: "#ff6666" },
          },
          markers: towns,
          markerStyle: {
            initial: {
              fill: "#ff6666",
              stroke: "#ffffff",
            },
            hover: {
              fill: "#ff0000",
            },
          },
        });
        
        console.log("✅ Map initialized successfully");
      } catch (error) {
        console.error("❌ Error initializing map:", error);
      }
    };
    
    // Start the initialization with a delay to ensure everything is loaded
    setTimeout(initMap, 500);
    
    return () => {
      // Clean up if needed
      const $ = window.jQuery;
      if ($ && mapRef.current && $.fn.vectorMap) {
        try {
          // Some implementations might have a destroy method
          // $(mapRef.current).vectorMap('destroy');
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }
    };
  }, []);

  return (
    <div className="my-8 px-4">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Explore Route 66</h2>
      <div
        ref={mapRef}
        id="map"
        style={{
          width: "100%",
          height: "600px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      ></div>
    </div>
  );
};

export default Route66Map;
