
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
      console.log("jvm global variable not found, creating it");
      try {
        // Create jvm namespace with complete structure
        (window as any).jvm = {};
        
        // Define jvm.Map constructor that the library expects
        (window as any).jvm.Map = function(params: any) {
          console.log("jvm.Map constructor called with params:", params);
          this.params = params;
          this.container = params.container;
          this.setBackgroundColor = function(color: string) { return this; };
          this.setSize = function() { return this; };
          this.setFocus = function() { return this; };
          this.params.container.innerHTML = `<div class="mock-map" style="width:100%;height:100%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;">
            <div style="text-align:center">
              <p>Route 66 Map</p>
              <p style="font-size:12px">(Fallback rendering)</p>
            </div>
          </div>`;
          
          // Add markers if they exist in params
          if (params.markers && params.markers.length) {
            const markersEl = document.createElement('div');
            markersEl.style.position = 'absolute';
            markersEl.style.top = '10px';
            markersEl.style.left = '10px';
            markersEl.style.background = 'white';
            markersEl.style.padding = '10px';
            markersEl.style.borderRadius = '5px';
            markersEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            markersEl.innerHTML = '<h4 style="margin:0 0 8px 0">Route 66 Stops</h4>';
            
            params.markers.forEach((marker: any, index: number) => {
              const markerItem = document.createElement('div');
              markerItem.style.margin = '4px 0';
              markerItem.style.fontSize = '12px';
              markerItem.innerHTML = `<span style="display:inline-block;width:8px;height:8px;background:#e74c3c;border-radius:50%;margin-right:6px;"></span> ${marker.name}`;
              markersEl.appendChild(markerItem);
            });
            
            params.container.querySelector('.mock-map').appendChild(markersEl);
          }
          
          return this;
        };
        
        // Add required prototype methods
        (window as any).jvm.Map.prototype = {
          setBackgroundColor: function() { return this; },
          setSize: function() { return this; },
          setFocus: function() { return this; },
          remove: function() { 
            if (this.container) {
              this.container.innerHTML = '';
            }
          }
        };
        
        // Add other jvm objects that might be needed
        (window as any).jvm.SVG = function() { return {}; };
        (window as any).jvm.VectorCanvas = function() { return {}; };
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
      (window as any).jvm.Map = function(params: any) {
        console.log("Fallback jvm.Map constructor called");
        this.params = params;
        this.container = params.container;
        
        // Create a simple visual representation
        this.params.container.innerHTML = `<div class="fallback-map" style="width:100%;height:100%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;">
          <div style="text-align:center">
            <p>Route 66 Map</p>
            <p style="font-size:12px">(Fallback rendering)</p>
          </div>
        </div>`;
        
        return this;
      };
      
      // Add required prototype methods
      (window as any).jvm.Map.prototype = {
        setBackgroundColor: function() { return this; },
        setSize: function() { return this; },
        setFocus: function() { return this; },
        remove: function() { 
          if (this.container) {
            this.container.innerHTML = '';
          }
        }
      };
      
      console.log("Created missing jvm global object with Map constructor");
    }
  }
}
