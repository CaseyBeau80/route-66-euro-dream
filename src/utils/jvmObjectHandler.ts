
// jvmObjectHandler.ts - Handles the creation and management of the jvm global object

/**
 * Create the jvm global object with required methods if it doesn't exist
 */
export function ensureJvmObjectExists(): void {
  if (typeof window === 'undefined') return;
  
  // Create jvm namespace with complete structure if it doesn't exist
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
      
      console.log("Created missing jvm global object with Map constructor");
    } catch (e) {
      console.error("Failed to create jvm namespace:", e);
    }
  }
}
