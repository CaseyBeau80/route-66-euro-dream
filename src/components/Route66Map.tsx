import { useEffect, useRef } from "react";
import $ from "jquery";

import "jvectormap-next";
import "jvectormap-next/jquery-jvectormap.css";

// ✅ Move this helper down here, just after imports
const loadScript = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(`Failed to load script: ${src}`);
    document.body.appendChild(script);
  });



const Route66Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
 useEffect(() => {
  if (!mapRef.current) return;

  const initMap = () => {
    if (!$.fn.vectorMap) {
      console.error("jVectorMap not available on jQuery.");
      return;
    }

    $(mapRef.current).empty();

    $(mapRef.current).vectorMap({
      map: "us_aea_en",
      backgroundColor: "#f8f4e9",
      regionStyle: {
        initial: {
          fill: "#cccccc",
          "fill-opacity": 0.8,
          stroke: "#ffffff",
          "stroke-width": 1,
          "stroke-opacity": 1,
        },
        hover: {
          fill: "#ff6666",
          "fill-opacity": 0.8,
        },
      },
      markers: [
        { latLng: [41.8781, -87.6298], name: "Chicago, IL" },
        { latLng: [38.6270, -90.1994], name: "St. Louis, MO" },
        { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
        { latLng: [35.0844, -106.6504], name: "Albuquerque, NM" },
        { latLng: [35.1983, -111.6513], name: "Flagstaff, AZ" },
        { latLng: [34.0522, -118.2437], name: "Los Angeles, CA" },
      ],
      markerStyle: {
        initial: {
          fill: "#ff6666",
          stroke: "#ffffff",
          "fill-opacity": 0.8,
          "stroke-width": 1,
          "stroke-opacity": 0.8,
          r: 6,
        },
        hover: {
          fill: "#ff0000",
          stroke: "#ffffff",
          "fill-opacity": 1,
          "stroke-width": 1,
          "stroke-opacity": 1,
          r: 8,
        },
      },
    });
  };

  // ✅ Only one .then and one .catch
  loadScript("https://cdn.jsdelivr.net/npm/jvectormap@2.0.5/jquery-jvectormap-us-aea-en.js")
    .then(initMap)
    .catch((err) => console.error("Failed to load map script:", err));
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
