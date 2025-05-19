
import { useEffect } from "react";

const Route66Map = () => {
  useEffect(() => {
    // Access jQuery safely with proper type checking
    const $ = window.$;

    if (!$ || !$("#map").vectorMap) {
      console.error("❌ jVectorMap not available on window.$");
      return;
    }

    const towns = [
      { latLng: [41.8781, -87.6298], name: "Chicago, IL" },
      { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
      { latLng: [34.0522, -118.2437], name: "Los Angeles, CA" },
    ];

    $("#map").vectorMap({
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
