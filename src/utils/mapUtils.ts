
import { toast } from "@/components/ui/use-toast";
import { Route66Town } from "@/types/route66";

/**
 * Check if all necessary map scripts are loaded
 */
export const checkScriptsLoaded = (): boolean => {
  return (
    typeof window !== "undefined" &&
    window.jQuery &&
    window.jQuery.fn &&
    window.jQuery.fn.vectorMap &&
    typeof window.jQuery.fn.vectorMap === 'function'
  );
};

/**
 * Initialize the Route 66 map
 */
export const initializeJVectorMap = (
  mapElement: HTMLDivElement,
  route66Towns: Route66Town[]
): boolean => {
  try {
    const $ = window.jQuery;
    console.log("✅ jQuery and jVectorMap loaded successfully");
    
    // Check if map file is loaded correctly
    if (!window.jQuery.fn.vectorMap.maps['us_aea_en']) {
      console.error("❌ US map data not loaded correctly");
      return false;
    }
    
    // Clean up any existing map instance
    if ($(mapElement).data('mapObject')) {
      try {
        $(mapElement).empty();
      } catch (e) {
        console.error("Error cleaning existing map:", e);
      }
    }
    
    // Initialize the map
    $(mapElement).vectorMap({
      map: "us_aea_en",
      backgroundColor: "transparent",
      regionStyle: {
        initial: { fill: "#dddddd" },
        hover: { fill: "#ff6666" },
        selected: { fill: "#ff0000" }
      },
      markers: route66Towns.map(town => town.latLng),
      markerStyle: {
        initial: {
          fill: "#ff6666",
          stroke: "#ffffff",
          r: 6
        },
        hover: {
          fill: "#ff0000",
          stroke: "#ffffff",
          r: 8
        },
      },
      onRegionClick: function(e, code) {
        toast({
          title: "State Selected",
          description: `You clicked on ${code.toUpperCase()}`,
        });
      },
      onMarkerClick: function(e, code) {
        const index = parseInt(code);
        if (!isNaN(index) && index >= 0 && index < route66Towns.length) {
          toast({
            title: "Town Selected",
            description: `You clicked on ${route66Towns[index].name}`,
          });
        }
      }
    });
    
    return true;
  } catch (error) {
    console.error("❌ Error initializing map:", error);
    return false;
  }
};

/**
 * Clean up the map instance
 */
export const cleanupMap = (mapElement: HTMLDivElement): void => {
  if (window.jQuery && mapElement) {
    try {
      const $ = window.jQuery;
      $(mapElement).empty();
    } catch (e) {
      console.error("Error during cleanup:", e);
    }
  }
};
