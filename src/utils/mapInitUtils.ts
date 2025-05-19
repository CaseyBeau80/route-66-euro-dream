
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
    } catch (error) {
      console.error('Initial vectorMap initialization failed:', error);
      
      // Try alternative approach if jvm is not defined
      if (error instanceof Error && (error.message.includes('jvm is not defined') || error.message.includes('Cannot read properties of undefined'))) {
        console.log('Attempting fallback initialization approach...');
        
        // Try to manually trigger map rendering
        const $ = window.jQuery;
        try {
          // Create a simpler map with fewer options that might fail
          $(mapContainer).empty();
          $(mapContainer).vectorMap({
            map: mapName,
            backgroundColor: '#f7f7f7',
            markers: locations.map(location => ({
              latLng: location.latLng,
              name: location.name
            }))
          });
          
          console.log('Fallback map initialization succeeded');
          return true;
        } catch (fallbackError) {
          console.error('Fallback initialization also failed:', fallbackError);
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }
    
    console.log('✅ Map initialized successfully');
    return true;
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
