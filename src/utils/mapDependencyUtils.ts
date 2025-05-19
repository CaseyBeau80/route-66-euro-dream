
// mapDependencyUtils.ts - Handles dependency and script checking for the map

// Check if jQuery and jVectorMap scripts are loaded
export function checkScriptsLoaded(): boolean {
  if (typeof window === 'undefined') return false;
  
  const jQueryLoaded = typeof window.jQuery !== 'undefined';
  const jVectorMapLoaded = jQueryLoaded && typeof window.jQuery.fn.vectorMap !== 'undefined';
  
  // Try to ensure the jvm global variable exists (used internally by jVectorMap)
  if (jQueryLoaded && jVectorMapLoaded) {
    // Some versions of jVectorMap use a global jvm variable
    if (typeof (window as any).jvm === 'undefined') {
      console.log("jvm global variable not found, attempting to create it");
      try {
        // Try to create jvm namespace if it doesn't exist
        (window as any).jvm = (window as any).jvm || {};
        // Some basic properties that might be expected
        (window as any).jvm.Map = (window as any).jvm.Map || function() { 
          console.log("Mock jvm.Map constructor called");
          return {}; 
        };
      } catch (e) {
        console.error("Failed to create jvm namespace:", e);
      }
    }
    
    // Force create the maps object if it doesn't exist
    if (!window.jQuery.fn.vectorMap.maps || Object.keys(window.jQuery.fn.vectorMap.maps).length === 0) {
      console.log("Creating vectorMap.maps object as it doesn't exist");
      window.jQuery.fn.vectorMap.maps = window.jQuery.fn.vectorMap.maps || {};
      
      // Force define the US map if needed - even a minimalist version
      if (!window.jQuery.fn.vectorMap.maps['usa'] && !window.jQuery.fn.vectorMap.maps['us_aea_en']) {
        console.log("Creating minimal USA map definition");
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
      }
    }
  }
  
  // More flexible check for map data - accept any map data that might be available
  const mapDataLoaded = jVectorMapLoaded && 
                       window.jQuery.fn.vectorMap.maps && 
                       Object.keys(window.jQuery.fn.vectorMap.maps).length > 0;
  
  console.log('Checking dependencies:', {
    jQuery: jQueryLoaded ? '✅' : '❌',
    jVectorMap: jVectorMapLoaded ? '✅' : '❌',
    jvm: typeof (window as any).jvm !== 'undefined' ? '✅' : '❌',
    mapData: mapDataLoaded ? '✅' : '❌',
    availableMaps: jVectorMapLoaded ? Object.keys(window.jQuery.fn.vectorMap.maps || {}) : [],
    mapDetailsExample: mapDataLoaded && Object.keys(window.jQuery.fn.vectorMap.maps)[0] ? 
      `First map has ${Object.keys(window.jQuery.fn.vectorMap.maps[Object.keys(window.jQuery.fn.vectorMap.maps)[0]].paths || {}).length} paths` : 'No map data'
  });
  
  return jQueryLoaded && jVectorMapLoaded && mapDataLoaded;
}

// Create a fallback map data structure
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
    
    // Also try to ensure the jvm global variable exists
    if (typeof (window as any).jvm === 'undefined') {
      (window as any).jvm = {};
      console.log("Created missing jvm global object");
    }
  }
}
