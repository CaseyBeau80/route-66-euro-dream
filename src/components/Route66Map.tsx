
import { useEffect, useRef } from "react";
import $ from "jquery";

// Import jVectorMap
import "jvectormap-next";
import "jvectormap-next/jquery-jvectormap.css";

const Route66Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the map container exists
    if (!mapRef.current) return;

    // Function to initialize the map
    const initMap = () => {
      try {
        // Make sure jQuery and the map container are available
        if ($ && $("#map").length > 0) {
          // Check if vectorMap function exists on jQuery
          if (typeof $.fn.vectorMap === "function") {
            // Initialize the map
            $("#map").vectorMap({
              map: "us_aea_en",
              backgroundColor: "transparent",
              regionStyle: {
                initial: {
                  fill: "#cccccc",
                },
                hover: {
                  fill: "#ff6666",
                },
              },
              // Add markers for key Route 66 cities
              markers: [
                { latLng: [35.0844, -106.6504], name: "Albuquerque, NM" },
                { latLng: [35.2220, -101.8313], name: "Amarillo, TX" },
                { latLng: [35.0478, -89.9767], name: "Memphis, TN" },
                { latLng: [34.0522, -118.2437], name: "Los Angeles, CA" },
                { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
                { latLng: [38.6270, -90.1994], name: "St. Louis, MO" },
                { latLng: [35.1983, -111.6513], name: "Flagstaff, AZ" },
                { latLng: [41.8781, -87.6298], name: "Chicago, IL" }
              ],
              markerStyle: {
                initial: {
                  fill: '#ff6666',
                  stroke: '#383f47',
                  "fill-opacity": 0.9,
                  "stroke-width": 1,
                  "stroke-opacity": 0.8,
                  r: 5
                },
                hover: {
                  fill: '#ff4444',
                  stroke: '#383f47',
                  "stroke-width": 2
                }
              },
              onMarkerTipShow: function(event, label, index) {
                label.html(
                  '<div class="map-tooltip"><b>' + 
                  $(this)[0].markers[index].name + 
                  '</b></div>'
                );
              }
            });
            console.log("Map initialized successfully");
          } else {
            console.error("vectorMap function is not available on jQuery");
            loadMapScript();
          }
        } else {
          console.error("Map container or jQuery not found");
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        loadMapScript();
      }
    };

    // Function to load the map script if not already loaded
    const loadMapScript = () => {
      if (!document.getElementById("us-map-script")) {
        const script = document.createElement("script");
        script.id = "us-map-script";
        script.src = "https://cdn.jsdelivr.net/npm/jvectormap@2.0.5/jquery-jvectormap-us-aea-en.js";
        script.onload = () => {
          console.log("Map script loaded");
          initMap();
        };
        script.onerror = (e) => {
          console.error("Error loading map script:", e);
        };
        document.body.appendChild(script);
      }
    };

    // First check if the plugin is already loaded
    if (typeof $.fn.vectorMap === "function") {
      initMap();
    } else {
      loadMapScript();
    }

    // Cleanup function
    return () => {
      if (typeof $.fn.vectorMap === "function" && $("#map").length > 0) {
        try {
          // Try to destroy the map if it exists
          const mapInstance = $("#map").data("mapObject");
          if (mapInstance && typeof mapInstance.remove === "function") {
            mapInstance.remove();
          }
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
      }
    };
  }, []);
  
  // Define the tooltip styles using a separate style object instead of JSX style tag
  const tooltipStyle = `
    .map-tooltip {
      padding: 5px 10px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    }
  `;

  return (
    <div className="my-8 px-4">
      <h2 className="text-3xl font-bold text-center text-route66-red mb-6">Explore Route 66</h2>
      <div
        id="map"
        ref={mapRef}
        className="rounded-lg shadow-lg"
        style={{
          width: "100%",
          height: "600px",
        }}
      ></div>
      <style>{tooltipStyle}</style>
    </div>
  );
};

export default Route66Map;
