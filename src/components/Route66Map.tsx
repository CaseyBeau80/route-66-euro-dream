import { useEffect } from "react";
import $ from "jquery";

// Core jVectorMap library
import "jvectormap-next";
import "jvectormap-next/jquery-jvectormap.css";

const Route66Map = () => {
  useEffect(() => {
  if (!document.getElementById("us-map-script")) {
    const script = document.createElement("script");
    script.id = "us-map-script";
    script.src = "https://cdn.jsdelivr.net/npm/jvectormap@2.0.5/tests/assets/jquery-jvectormap-us-aea-en.js";

    script.onload = () => {
      console.log("✅ Map script loaded");

      if ($("#map").children().length === 0) {
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
          markers: [
            { latLng: [41.8781, -87.6298], name: "Chicago, IL" },
            { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
            { latLng: [34.0522, -118.2437], name: "Los Angeles, CA" },
          ],
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
      }
    };

    script.onerror = () => {
      console.error("❌ Failed to load jvectormap map script.");
    };

    document.body.appendChild(script);
  }
}, []);

  return (
    <div className="my-8 px-4">
      <h2 className="text-3xl font-bold text-center text-route66-red mb-6">Explore Route 66</h2>
      <div
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
