
// mapFallbackData.ts - Handles fallback map data creation

/**
 * Create a fallback map data structure when proper map data isn't available
 */
export function createFallbackMapData() {
  if (window.jQuery?.fn?.vectorMap) {
    console.log("Creating fallback minimal map data");
    window.jQuery.fn.vectorMap.maps = window.jQuery.fn.vectorMap.maps || {};
    window.jQuery.fn.vectorMap.maps['usa'] = {
      width: 959,
      height: 593,
      paths: {
        "ca": { path: "m35.06,153.94c-0.1,4.04 0.4,8.21...", name: "California" },
        "il": { path: "m569.75,200.44c-0.29,2.58 4.2,1.83...", name: "Illinois" },
        "mo": { path: "m490.44,245.63c-2.39,-0.46 -0.19,4.05...", name: "Missouri" },
        "az": { path: "m173.19,314.66c-2.49,-0.06 -3.05,4.43 -6.38,2.94...", name: "Arizona" },
        "nm": { path: "m242.72,428.78c4.82,0.63 9.65,1.25 14.47,1.88...", name: "New Mexico" },
        "tx": { path: "m359.47,330.97c2.34,-0.11 -0.86,-1.81 0,0z...", name: "Texas" },
        "ok": { path: "m363.31,330.03c17.51,1.12 35.04,1.73 52.56,2.47...", name: "Oklahoma" }
      }
    };
    
    console.log("Fallback USA map created with Route 66 states");
  }
}
