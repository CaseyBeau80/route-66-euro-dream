
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
        
        // Create a simple fallback display
        const fallbackHtml = `<div class="mock-map" style="width:100%;height:100%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;">
          <div style="text-align:center">
            <p>Route 66 Map</p>
            <p style="font-size:12px">(Fallback rendering)</p>
          </div>
        </div>`;
        
        // Handle both DOM elements and jQuery objects
        if (params.container instanceof Element) {
          // Direct DOM element
          params.container.innerHTML = fallbackHtml;
        } else if (window.jQuery && params.container instanceof window.jQuery) {
          // jQuery object
          params.container.html(fallbackHtml);
        } else {
          console.error("Container is neither a DOM element nor a jQuery object", params.container);
        }
        
        // Add markers if they exist in params
        if (params.markers && params.markers.length) {
          // Create marker elements
          const markersEl = document.createElement('div');
          markersEl.style.position = 'absolute';
          markersEl.style.top = '10px';
          markersEl.style.left = '10px';
          markersEl.style.background = 'white';
          markersEl.style.padding = '10px';
          markersEl.style.borderRadius = '5px';
          markersEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          markersEl.innerHTML = '<h4 style="margin:0 0 8px 0">Route 66 Stops</h4>';
          
          // Add each marker to the element
          params.markers.forEach((marker: any, index: number) => {
            const markerItem = document.createElement('div');
            markerItem.style.margin = '4px 0';
            markerItem.style.fontSize = '12px';
            markerItem.innerHTML = `<span style="display:inline-block;width:8px;height:8px;background:#e74c3c;border-radius:50%;margin-right:6px;"></span> ${marker.name}`;
            markersEl.appendChild(markerItem);
          });
          
          // Append markers to container (handle both DOM and jQuery)
          if (params.container instanceof Element) {
            const mockMap = params.container.querySelector('.mock-map');
            if (mockMap) mockMap.appendChild(markersEl);
          } else if (window.jQuery && params.container instanceof window.jQuery) {
            params.container.find('.mock-map').append(markersEl);
          }
        }
        
        return this;
      };
      
      // Add required prototype methods
      (window as any).jvm.Map.prototype = {
        setBackgroundColor: function() { return this; },
        setSize: function() { return this; },
        setFocus: function() { return this; },
        remove: function() { 
          if (this.container instanceof Element) {
            this.container.innerHTML = '';
          } else if (window.jQuery && this.container instanceof window.jQuery) {
            this.container.empty();
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
