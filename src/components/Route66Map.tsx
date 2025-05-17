import { useEffect } from "react";
import $ from "jquery";
import "jvectormap-next";
import "jvectormap-next/jquery-jvectormap.css";

const Route66Map = () => {
  useEffect(() => {
    if (!document.getElementById("us-map-script")) {
      const script = document.createElement("script");
      script.id = "us-map-script";
      script.src = "https://cdn.jsdelivr.net/npm/jvectormap@2.0.5/jquery-jvectormap-us-aea-en.js";
      script.onload = () => {
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
          });
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="my-8 px-4">
      <div id="map" style={{ width: "100%", height: "600px", borderRadius: "12px" }}></div>
    </div>
  );
};

export default Route66Map;
