
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
        
        // Store the container - could be DOM element or jQuery object
        this.container = params.container;
        
        // Add necessary methods
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
        
        // Handle the container properly based on its type
        try {
          if (window.jQuery && params.container instanceof window.jQuery) {
            // It's a jQuery object
            params.container.html(fallbackHtml);
            
            // Add markers if they exist in params
            if (params.markers && params.markers.length) {
              // Create marker container
              const markerList = document.createElement('div');
              markerList.style.position = 'absolute';
              markerList.style.top = '10px';
              markerList.style.left = '10px';
              markerList.style.background = 'white';
              markerList.style.padding = '10px';
              markerList.style.borderRadius = '5px';
              markerList.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              markerList.innerHTML = '<h4 style="margin:0 0 8px 0">Route 66 Stops</h4>';
              
              // Add each marker
              params.markers.forEach((marker: any) => {
                const markerItem = document.createElement('div');
                markerItem.style.margin = '4px 0';
                markerItem.style.fontSize = '12px';
                const dot = document.createElement('span');
                dot.style.display = 'inline-block';
                dot.style.width = '8px';
                dot.style.height = '8px';
                dot.style.background = '#e74c3c';
                dot.style.borderRadius = '50%';
                dot.style.marginRight = '6px';
                markerItem.appendChild(dot);
                markerItem.appendChild(document.createTextNode(String(marker.name || '')));
                markerList.appendChild(markerItem);
              });
              
              params.container.find('.mock-map').append(markerList);
            }
          } else if (params.container instanceof Element) {
            // It's a DOM element
            params.container.innerHTML = fallbackHtml;
            
            // Add markers if they exist
            if (params.markers && params.markers.length) {
              // Create marker container
              const markerList = document.createElement('div');
              markerList.style.position = 'absolute';
              markerList.style.top = '10px';
              markerList.style.left = '10px';
              markerList.style.background = 'white';
              markerList.style.padding = '10px';
              markerList.style.borderRadius = '5px';
              markerList.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              markerList.innerHTML = '<h4 style="margin:0 0 8px 0">Route 66 Stops</h4>';
              
              // Add each marker
              params.markers.forEach((marker: any) => {
                const markerItem = document.createElement('div');
                markerItem.style.margin = '4px 0';
                markerItem.style.fontSize = '12px';
              const dot = document.createElement('span');
              dot.style.display = 'inline-block';
              dot.style.width = '8px';
              dot.style.height = '8px';
              dot.style.background = '#e74c3c';
              dot.style.borderRadius = '50%';
              dot.style.marginRight = '6px';
              markerItem.appendChild(dot);
              markerItem.appendChild(document.createTextNode(String(marker.name || '')));
                markerList.appendChild(markerItem);
              });
              
              const mockMap = params.container.querySelector('.mock-map');
              if (mockMap) mockMap.appendChild(markerList);
            }
          } else {
            console.error("Container is neither a DOM element nor a jQuery object:", params.container);
          }
        } catch (e) {
          console.error("Error creating fallback map display:", e);
        }
        
        return this;
      };
      
      // Add required prototype methods
      (window as any).jvm.Map.prototype = {
        setBackgroundColor: function() { return this; },
        setSize: function() { return this; },
        setFocus: function() { return this; },
        remove: function() { 
          try {
            if (this.container instanceof Element) {
              this.container.innerHTML = '';
            } else if (window.jQuery && this.container instanceof window.jQuery) {
              this.container.empty();
            }
          } catch (e) {
            console.error("Error removing map:", e);
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
