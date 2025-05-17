
import { useEffect, useRef } from "react";
import $ from "jquery";

// Import jVectorMap
import "jvectormap-next";
import "jvectormap-next/jquery-jvectormap.css";

const Route66Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a static map image as fallback
    const createStaticMap = () => {
      if (!mapRef.current) return;
      
      const container = mapRef.current;
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg p-8">
          <img 
            src="/lovable-uploads/423a5daa-de49-4355-b472-e3c4bfd86639.png" 
            alt="Route 66 Map" 
            class="max-w-full max-h-[500px] rounded-lg shadow-md"
          />
          <p class="mt-4 text-center text-gray-600">
            Explore the historic Route 66 from Chicago to Los Angeles!
          </p>
        </div>
      `;
    };

    // Try to initialize the interactive map
    const initializeMap = () => {
      if (!mapRef.current) return;
      
      try {
        console.log("Initializing map with jQuery...");
        
        if (!window.jQuery || !window.jQuery.fn.vectorMap) {
          console.error("jQuery or vectorMap not available, using static map instead");
          createStaticMap();
          return;
        }

        // Clear the container first
        $(mapRef.current).empty();
        
        // Initialize the map
        $(mapRef.current).vectorMap({
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
          onMarkerTipShow: function(event: any, label: any, index: number) {
            label.html(
              '<div class="map-tooltip"><b>' + 
              $(this).vectorMap('get', 'markers')[index].name + 
              '</b></div>'
            );
          }
        });
        
        console.log("Map initialized successfully");
      } catch (error) {
        console.error("Error initializing map:", error);
        createStaticMap();
      }
    };

    // Use the static map (fallback) since jVectorMap is having issues
    createStaticMap();

    // Cleanup function
    return () => {
      if (mapRef.current && window.jQuery) {
        try {
          const $map = $(mapRef.current);
          if ($map.data('mapObject')) {
            $map.vectorMap('get', 'mapObject').remove();
          }
        } catch (error) {
          console.error("Error during map cleanup:", error);
        }
      }
    };
  }, []);
  
  // Define the tooltip styles
  const tooltipStyle = `
    .map-tooltip {
      padding: 5px 10px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    }
  `;

  return (
    <div className="my-8 px-4" id="map">
      <h2 className="text-3xl font-bold text-center text-route66-red mb-6">Explore Route 66</h2>
      <div
        ref={mapRef}
        className="rounded-lg shadow-lg"
        style={{
          width: "100%",
          height: "600px",
          position: "relative"
        }}
      ></div>
      <style>{tooltipStyle}</style>
    </div>
  );
};

export default Route66Map;
