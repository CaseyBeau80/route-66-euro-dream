import { useEffect } from "react";
import $ from "jquery";
import "jvectormap-next";
import "jvectormap-content/maps/us-aea-en";


const Route66Map = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Prevent multiple maps being initialized
      if ($("#map").children().length === 0) {
        $("#map").vectorMap({
          map: "us_aea_en",
          backgroundColor: "transparent",
          regionStyle: {
            initial: {
              fill: "#cccccc"
            },
            hover: {
              fill: "#ff6600"
            }
          },
        });
      }
    }
  }, []);

  return (
    <div className="my-8 px-4">
      <div id="map" style={{ width: "100%", height: "600px", borderRadius: "12px" }}></div>
    </div>
  );
};

export default Route66Map;
