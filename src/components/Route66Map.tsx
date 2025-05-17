
import { useEffect } from "react";
import $ from "jquery";
import "jvectormap-next";
import "jvectormap-next/jquery-jvectormap.css";

const Route66Map = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ($("#map").children().length === 0) {
        // Check if map container exists and is empty
        try {
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
            // Add markers for major Route 66 cities
            markers: [
              { latLng: [41.8781, -87.6298], name: "Chicago" },         // Chicago, IL
              { latLng: [38.6270, -90.1994], name: "St. Louis" },       // St. Louis, MO
              { latLng: [35.4676, -97.5164], name: "Oklahoma City" },   // Oklahoma City, OK
              { latLng: [35.0844, -106.6504], name: "Albuquerque" },    // Albuquerque, NM
              { latLng: [35.1983, -111.6513], name: "Flagstaff" },      // Flagstaff, AZ
              { latLng: [34.0522, -118.2437], name: "Los Angeles" }     // Los Angeles, CA
            ],
            markerStyle: {
              initial: {
                fill: '#ff6666',
                stroke: '#383f47',
                "fill-opacity": 1,
                "stroke-width": 1,
                "stroke-opacity": 1,
                r: 5
              },
              hover: {
                fill: '#ff3333',
                stroke: '#383f47',
                "stroke-width": 2,
              }
            },
            onRegionTipShow: function(e, el, code) {
              // Custom tooltip for regions
              el.html(el.html());
            },
            onMarkerTipShow: function(e, el, code) {
              // Custom tooltip for markers
              el.html('<div class="map-tooltip">' + 
                     '<div class="tooltip-title">' + $(e.target).attr('data-index') + '</div>' +
                     '</div>');
            }
          });
        } catch (error) {
          console.error("Error initializing map:", error);
        }
      }
    }
  }, []);

  return (
    <section id="map-section" className="py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-route66 text-route66-red text-center mb-8">Explore Route 66</h2>
        <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
          The historic Route 66 stretches from Chicago to Santa Monica, spanning 8 states and over 2,400 miles of American history.
        </p>
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div id="map" style={{ width: "100%", height: "500px", borderRadius: "8px" }}></div>
          <div className="map-legend mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-route66-red inline-block mr-1"></span>
              <span>Major Cities</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#cccccc] inline-block mr-1"></span>
              <span>States</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Route66Map;
