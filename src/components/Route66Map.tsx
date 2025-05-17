import { useEffect, useRef } from "react";
import $ from "jquery";

// Import jVectorMap core and styling
import "jvectormap-next";
import "jvectormap-next/jquery-jvectormap.css";

const Route66Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      if ($ && typeof $.fn.vectorMap === "function") {
        $(mapRef.current).empty(); // clear previous instance

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
      } else {
        console.warn("jVectorMap not available, will try loading script");
        loadMapScript();
      }
    };

    const loadMapScript = () => {
      if (!document.getElementById("us-map-script")) {
        const script = document.createElement("script");
        script.id = "us-map-script";
        script.src = "https://cdn.jsdelivr.net/npm/jvectormap@2.0.5/jquery-jvectormap-us-aea-en.js";
        script.onload = () => {
          console.log("Map script loaded");
          initMap();
        };
        script.onerror = () => {
          console.error("Failed to load jvectormap-content map script.");
        };
        document.body.appendChild(script);
      }
    };

    if (typeof $.fn.vectorMap === "function") {
      initMap();
    } else {
      loadMapScript();
    }

    return () => {
      try {
        const mapInstance = $("#map").data("mapObject");
        if (mapInstance && typeof mapInstance.remove === "function") {
          mapInstance.remove();
        }
      } catch (e) {
        console.warn("Cleanup failed:", e);
      }
    };
  }, []);

  return (
    <div className="my-8 px-4">
      <h2 className="text-3xl font-bold text-center text-route66-red mb-6">
        Explore Route 66
      </h2>
      <div
        id="map"
        ref={mapRef}
        style={{
          width: "100%",
          height: "600px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}
      />
    </div>
  );
};

export default Route66Map;
