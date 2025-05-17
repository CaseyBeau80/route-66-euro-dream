import { useEffect } from "react";

// Ensure jQuery types are declared globally
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
        await loadScript("https://code.jquery.com/jquery-3.6.0.min.js", "jquery-core");
        await loadScript("https://cdn.jsdelivr.net/gh/bjornd/jvectormap@2.0.5/jquery-jvectormap.min.js", "jvectormap-core");
        await loadScript("https://caseybeau80.github.io/route66-map-files/jquery-jvectormap-us-aea-en.js", "us-map-script");

        console.log("✅ All scripts loaded");

        window.$("#map").vectorMap({
          map: "us_aea_en",
          backgroundColor: "transparent",
          regionStyle: {
            initial: { fill: "#cccccc" },
            hover: { fill: "#ff6666" },
          },
          markers: [
            { latLng: [38.6270, -90.1994], name: "St. Louis, MO" },
            { latLng: [38.0620, -91.4035], name: "Cuba, MO" },
            { latLng: [37.9485, -91.7715], name: "Rolla, MO" },
            { latLng: [37.6806, -92.6638], name: "Lebanon, MO" },
            { latLng: [37.2089, -93.2923], name: "Springfield, MO" },
            { latLng: [37.1906, -93.6488], name: "Halltown, MO" },
            { latLng: [37.1917, -93.8450], name: "Paris Springs, MO" },
            { latLng: [37.1919, -94.0114], name: "Spencer, MO" },
            { latLng: [37.1764, -94.3108], name: "Carthage, MO" },
            { latLng: [37.1287, -94.4766], name: "Brooklyn Heights, MO" },
            { latLng: [37.1462, -94.4633], name: "Webb City, MO" },
            { latLng: [37.0842, -94.5133], name: "Joplin, MO" }
          ],
          markerStyle: {
            initial: {
              fill: "#ff6666",
              stroke: "#ffffff",
              r: 6
            },
            hover: {
              fill: "#ff0000"
            }
          },
          series: {
            markers: [{
              attribute: 'r',
              scale: [4, 6],
              values: [1, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2] // Optionally adjust marker sizes
            }]
          },
          lines: [
            {
              points: [
                [38.6270, -90.1994], [38.0620, -91.4035], [37.9485, -91.7715],
                [37.6806, -92.6638], [37.2089, -93.2923], [37.1906, -93.6488],
                [37.1917, -93.8450], [37.1919, -94.0114], [37.1764, -94.3108],
                [37.1287, -94.4766], [37.1462, -94.4633], [37.0842, -94.5133]
              ],
              stroke: "#ff0000",
              strokeWidth: 2,
              fill: "none"
            }
          ]
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
