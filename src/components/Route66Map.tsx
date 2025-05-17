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
        // Load jQuery first
        await loadScript("https://code.jquery.com/jquery-3.6.0.min.js", "jquery");
        window.$ = window.jQuery = window.$ || (window as any).jQuery;

        // Load jVectorMap after jQuery is available
        await loadScript("https://cdn.jsdelivr.net/npm/jvectormap-next@1.0.1/jquery-jvectormap.js", "jvectormap");
        await loadScript("https://caseybeau80.github.io/route66-map-files/jquery-jvectormap-us-aea-en.js", "us-map");

        console.log("✅ All scripts loaded");

        const $ = window.$;

        const towns = [
          { latLng: [41.8781, -87.6298], name: "Chicago, IL" },
          { latLng: [39.7817, -89.6501], name: "Springfield, IL" },
          { latLng: [37.0842, -94.5133], name: "Joplin, MO" },
          { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
          { latLng: [35.2226, -101.8313], name: "Amarillo, TX" },
          { latLng: [35.1983, -111.6513], name: "Flagstaff, AZ" },
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
  setTimeout(() => {
  const mapObj = $("#map").vectorMap("get", "mapObject");

  const pathCoords = towns.map((town) =>
    mapObj.latLngToPoint(town.latLng[0], town.latLng[1])
  );

  const svg = mapObj.container.find("svg");
  const linePath = pathCoords.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  if (!svg.find("path.route66").length) {
    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl.setAttribute("d", linePath);
    pathEl.setAttribute("stroke", "#ff0000");
    pathEl.setAttribute("stroke-width", "2");
    pathEl.setAttribute("fill", "none");
    pathEl.setAttribute("class", "route66");
    svg[0].appendChild(pathEl);
  }
}, 300); // delay ensures map is ready


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
