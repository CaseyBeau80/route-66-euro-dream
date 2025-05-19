
import { useEffect, useRef } from "react";

const Route66Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Wait for DOM to be ready and jQuery to be available
    if (typeof window === 'undefined' || !window.$ || !mapRef.current) {
      console.error("❌ jQuery not available on window or map element not ready");
      return;
    }
    
    const $ = window.$;
    
    // Check if vectorMap plugin is available
    if (typeof $.fn.vectorMap === 'undefined') {
      console.error("❌ jVectorMap plugin not available");
      return;
    }
    
    // Define Route 66 towns
    const towns = [
      { latLng: [41.8781, -87.6298], name: "Chicago, IL" },
      { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
      { latLng: [34.0522, -118.2437], name: "Los Angeles, CA" },
    ];
    
    // Initialize the map when everything is ready
    try {
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
    
    return () => {
      // Clean up if necessary
      try {
        if ($(mapRef.current).vectorMap) {
          // Some vector map implementations have a destroy method
          // $(mapRef.current).vectorMap('destroy');
        }
      } catch (e) {
        console.error("Error during cleanup:", e);
      }
    };
  }, []);

  return (
    <div className="my-8 px-4">
      <h2 className="text-3xl font-bold text-center text-route66-red mb-6">Explore Route 66</h2>
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
