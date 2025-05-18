// Route66Map.tsx — Rebuilt and patched version using jvectormap-next
import { useEffect } from "react";

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

const Route66Map = () => {
  useEffect(() => {
    const loadScript = (src: string, id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        await loadScript("https://code.jquery.com/jquery-3.6.0.min.js", "jquery");

        // Ensure jQuery is globally defined
        window.jQuery = window.$ = window.jQuery || window.$;
        if (!window.$) throw new Error("jQuery not available");

        await loadScript("https://unpkg.com/jvectormap-next@1.0.1/jquery-jvectormap.min.js", "jvectormap");
        await loadScript("https://caseybeau80.github.io/route66-map-files/jquery-jvectormap-us-aea-en.js", "us-map");

        const $ = window.$;

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
      } catch (error) {
        console.error("❌ Error loading map scripts:", error);
      }
    };

    loadScripts();
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
