
// mapInitUtils.ts - Handles map initialization and management
import { Location } from './mapTypes';
import { checkScriptsLoaded, createFallbackMapData } from './mapDependencyUtils';

// Initialize jVectorMap with specified locations
export function initializeJVectorMap(mapContainer: HTMLDivElement, locations: Location[]): boolean {
  try {
    if (!checkScriptsLoaded()) {
      console.error('❌ jQuery, jVectorMap, or map data not loaded');
      return false;
    }
    
    console.log('✅ All dependencies loaded, initializing map');
    
    // Get the first available map
    const availableMaps = Object.keys(window.jQuery.fn.vectorMap.maps);
    if (availableMaps.length === 0) {
      console.error('❌ No map data found despite checking');
      return false;
    }
    
    // Prefer 'us_aea_en' or 'usa' maps, but fall back to any available map
    let mapName = availableMaps.find(name => name === 'us_aea_en') || 
                  availableMaps.find(name => name === 'usa') || 
                  availableMaps[0];
    
    console.log(`Using map: ${mapName}`);
    
    try {
      // Ensure jvm.Map constructor exists - use type-safe check
      if (typeof window.jvm === 'undefined' || typeof window.jvm.Map !== 'function') {
        console.log('Creating jvm.Map constructor');
        (window as any).jvm = (window as any).jvm || {};
        (window as any).jvm.Map = function(params: any) {
          console.log("jvm.Map constructor called with params:", params);
          this.params = params;
          this.container = params.container;
          
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
              markerItem.appendChild(document.createTextNode(marker.name));
              markersList.appendChild(markerItem);
            });
            
            markersContainer.appendChild(markersList);
          }
          
          mapDiv.appendChild(markersContainer);
          
          // Clear and append to container
          params.container.innerHTML = '';
          params.container.appendChild(mapDiv);
          
          return this;
        };
        
        // Add required prototype methods
        (window as any).jvm.Map.prototype = {
          setBackgroundColor: function(color: string) { return this; },
          setSize: function() { return this; },
          setFocus: function() { return this; },
          remove: function() { 
            if (this.container) {
              this.container.innerHTML = '';
            }
          }
        };
      }
      
      // Try to initialize with the standard approach
      window.jQuery(mapContainer).vectorMap({
        map: mapName,
        backgroundColor: '#f7f7f7',
        borderColor: '#818181',
        borderOpacity: 0.25,
        borderWidth: 1,
        color: '#f4f3f0',
        enableZoom: true,
        hoverColor: '#c9dfaf',
        hoverOpacity: null,
        normalizeFunction: 'linear',
        scaleColors: ['#b6d6ff', '#005ace'],
        selectedColor: '#c9dfaf',
        selectedRegions: [],
        showTooltip: true,
        onRegionClick: function(event: Event, code: string, region: string) {
          console.log('Region clicked:', region);
        },
        markerStyle: {
          initial: {
            fill: '#e74c3c',
            stroke: '#383f47',
            'fill-opacity': 0.9,
            'stroke-width': 1,
            'stroke-opacity': 0.8,
            r: 6
          },
          hover: {
            fill: '#c0392b',
            stroke: '#383f47',
            'stroke-width': 2
          }
        },
        markers: locations.map(location => ({
          latLng: location.latLng,
          name: location.name
        }))
      });
      
      console.log('✅ Map initialized successfully');
      return true;
    } catch (error) {
      console.error('Initial vectorMap initialization failed:', error);
      
      // Try alternative approach with our fallback implementation
      try {
        console.log('Using fallback map implementation');
        
        // Clear the container
        window.jQuery(mapContainer).empty();
        
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
        
        // Add the fallback container to the map container
        mapContainer.innerHTML = '';
        mapContainer.appendChild(fallbackContainer);
        
        console.log('Fallback map display created successfully');
        return true;
      } catch (fallbackError) {
        console.error('Fallback initialization also failed:', fallbackError);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error('❌ Error initializing map:', error);
    throw error;
  }
}

// Clean up map resources
export function cleanupMap(mapContainer: HTMLDivElement): void {
  try {
    if (window.jQuery) {
      console.log('Cleaning up map resources');
      window.jQuery(mapContainer).empty();
    }
  } catch (error) {
    console.error('Error cleaning up map:', error);
  }
}
