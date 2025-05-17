
import { useEffect, useRef } from "react";
import $ from "jquery";

// Explicitly import jQuery first, then the vector map
// Need to ensure the plugin is properly loaded before use
import "jvectormap-next";
import "jvectormap-next/jquery-jvectormap.css";

const Route66Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Make sure both jQuery and the map container are available
    if (!mapRef.current || typeof $ !== "function" || !$.fn.vectorMap) {
      console.error("Map dependencies not loaded:", { 
        jQueryAvailable: typeof $ === "function",
        vectorMapAvailable: $ && $.fn && typeof $.fn.vectorMap === "function",
        containerExists: !!mapRef.current
      });
      return;
    }
    
    try {
      // Clear any existing maps first to prevent duplicates
      $(mapRef.current).empty();
      
      // Initialize the map with proper error handling
      $(mapRef.current).vectorMap({
        map: "us_aea_en",
        backgroundColor: "#f8f4e9", // Cream color to match site theme
        regionStyle: {
          initial: {
            fill: "#cccccc",
            "fill-opacity": 0.8,
            stroke: "#ffffff",
            "stroke-width": 1,
            "stroke-opacity": 1
          },
          hover: {
            fill: "#ff6666",
            "fill-opacity": 0.8
          }
        },
        // Route 66 major cities as markers
        markers: [
          { latLng: [41.8781, -87.6298], name: "Chicago, IL" },
          { latLng: [38.6270, -90.1994], name: "St. Louis, MO" },
          { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
          { latLng: [35.0844, -106.6504], name: "Albuquerque, NM" },
          { latLng: [35.1983, -111.6513], name: "Flagstaff, AZ" },
          { latLng: [34.0522, -118.2437], name: "Los Angeles, CA" }
        ],
        markerStyle: {
          initial: {
            fill: "#ff6666",
            stroke: "#ffffff",
            "fill-opacity": 0.8,
            "stroke-width": 1,
            "stroke-opacity": 0.8,
            r: 6
          },
          hover: {
            fill: "#ff0000",
            stroke: "#ffffff",
            "fill-opacity": 1,
            "stroke-width": 1,
            "stroke-opacity": 1,
            r: 8
          }
        }
      });
    } catch (error) {
      console.error("Error initializing vector map:", error);
    }
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
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" 
        }}
      ></div>
    </div>
  );
};

export default Route66Map;
