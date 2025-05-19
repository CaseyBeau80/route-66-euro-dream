
// mapFallbackRenderer.ts - Handles fallback map rendering when jVectorMap fails

import { Location } from './mapTypes';

/**
 * Creates a basic fallback map display when the vector map fails to load
 */
export function createFallbackMapDisplay(container: HTMLDivElement, locations: Location[]): void {
  try {
    // Create a container div with styling
    const fallbackContainer = document.createElement('div');
    fallbackContainer.className = 'route66-fallback-map';
    fallbackContainer.style.width = '100%';
    fallbackContainer.style.height = '100%';
    fallbackContainer.style.background = '#f4f4f4';
    fallbackContainer.style.borderRadius = '8px';
    fallbackContainer.style.overflow = 'hidden';
    fallbackContainer.style.position = 'relative';
    fallbackContainer.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.1)';
    
    // Add a header
    const header = document.createElement('div');
    header.style.background = '#e74c3c';
    header.style.color = 'white';
    header.style.padding = '15px';
    header.style.textAlign = 'center';
    header.style.fontWeight = 'bold';
    header.style.fontSize = '20px';
    header.textContent = 'Route 66 Journey Map';
    fallbackContainer.appendChild(header);
    
    // Add a styled container for markers
    const markersContainer = document.createElement('div');
    markersContainer.style.padding = '20px';
    markersContainer.style.display = 'flex';
    markersContainer.style.flexDirection = 'column';
    markersContainer.style.gap = '15px';
    
    // Add the stops to the container
    locations.forEach((location, index) => {
      const marker = document.createElement('div');
      marker.style.display = 'flex';
      marker.style.alignItems = 'center';
      marker.style.padding = '12px';
      marker.style.background = 'white';
      marker.style.borderRadius = '6px';
      marker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      
      // Create marker icon
      const icon = document.createElement('div');
      icon.style.width = '30px';
      icon.style.height = '30px';
      icon.style.borderRadius = '50%';
      icon.style.background = '#e74c3c';
      icon.style.color = 'white';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      icon.style.marginRight = '12px';
      icon.style.fontWeight = 'bold';
      icon.textContent = (index + 1).toString();
      
      // Create marker text
      const text = document.createElement('div');
      text.textContent = location.name;
      text.style.fontSize = '16px';
      
      marker.appendChild(icon);
      marker.appendChild(text);
      markersContainer.appendChild(marker);
    });
    
    fallbackContainer.appendChild(markersContainer);
    
    // Clear and add the fallback container to the map container
    container.innerHTML = '';
    container.appendChild(fallbackContainer);
    
    console.log('Fallback map display created successfully');
  } catch (error) {
    console.error('Error creating fallback map display:', error);
  }
}

/**
 * Creates a mock jvm.Map implementation that uses our fallback renderer
 */
export function createMockJvmMap(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Create jvm namespace with complete structure if it doesn't exist
    (window as any).jvm = (window as any).jvm || {};
      
    // Define jvm.Map constructor that the library expects
    (window as any).jvm.Map = function(params: any) {
      console.log("jvm.Map constructor called with params:", params);
      this.params = params;
      
      try {
        // Create a simple visual representation
        const mapDiv = document.createElement('div');
        mapDiv.className = 'fallback-vector-map';
        mapDiv.style.width = '100%';
        mapDiv.style.height = '100%';
        mapDiv.style.background = params.backgroundColor || '#f7f7f7';
        mapDiv.style.position = 'relative';
        mapDiv.style.overflow = 'hidden';
        mapDiv.style.borderRadius = '4px';
        
        // Add a header
        const header = document.createElement('div');
        header.style.padding = '15px';
        header.style.textAlign = 'center';
        header.style.borderBottom = '1px solid #ddd';
        header.innerHTML = '<h3 style="margin:0;color:#555">Route 66 Journey</h3>';
        mapDiv.appendChild(header);
        
        // Container for markers
        const markersContainer = document.createElement('div');
        markersContainer.style.padding = '15px';
        
        // Add markers if they exist
        if (params.markers && params.markers.length) {
          const markersList = document.createElement('div');
          markersList.innerHTML = '<h4 style="margin:0 0 10px 0;color:#444">Famous Stops:</h4>';
          
          params.markers.forEach((marker: any, index: number) => {
            const markerItem = document.createElement('div');
            markerItem.style.margin = '8px 0';
            markerItem.style.padding = '8px';
            markerItem.style.borderRadius = '4px';
            markerItem.style.background = '#fff';
            markerItem.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            
            const dot = document.createElement('span');
            dot.style.display = 'inline-block';
            dot.style.width = '10px';
            dot.style.height = '10px';
            dot.style.background = '#e74c3c';
            dot.style.borderRadius = '50%';
            dot.style.marginRight = '8px';
            
            markerItem.appendChild(dot);
            markerItem.appendChild(document.createTextNode(marker.name || `Location ${index + 1}`));
            markersList.appendChild(markerItem);
          });
          
          markersContainer.appendChild(markersList);
        }
        
        mapDiv.appendChild(markersContainer);
        
        // Handle the container properly based on its type
        if (window.jQuery && params.container instanceof window.jQuery) {
          params.container.empty().append(mapDiv);
        } else if (params.container instanceof Element) {
          params.container.innerHTML = '';
          params.container.appendChild(mapDiv);
        } else {
          console.error("Container is neither a DOM element nor a jQuery object:", params.container);
        }
      } catch (e) {
        console.error("Error creating mock map:", e);
      }
      
      return this;
    };
    
    // Add required prototype methods
    (window as any).jvm.Map.prototype = {
      setBackgroundColor: function(color: string) { return this; },
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
    
    console.log("Created mock jvm.Map constructor");
  } catch (error) {
    console.error("Error creating mock jvm.Map:", error);
  }
}
