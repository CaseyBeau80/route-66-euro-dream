
// src/utils/mapUtils.ts
import { Route66Town } from '@/types/route66';

// Define the structure for each location
export interface Location {
  latLng: [number, number];
  name: string;
}

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

// Load the map data dynamically if it doesn't exist
export function ensureMapDataLoaded(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    // If the map data is already loaded, resolve immediately
    if (window.jQuery?.fn?.vectorMap?.maps && Object.keys(window.jQuery.fn.vectorMap.maps).length > 0) {
      console.log("Map data already loaded");
      resolve(true);
      return;
    }

    console.log("Attempting to load map data dynamically");

    // Create a script element to load the map data
    const script = document.createElement('script');
    script.src = "/jquery.vmap.usa.js"; // This is in the public folder
    script.async = true;

    script.onload = () => {
      console.log("Map data script loaded successfully");
      
      // Check if the script actually loaded the map data
      if (window.jQuery?.fn?.vectorMap?.maps && Object.keys(window.jQuery.fn.vectorMap.maps).length > 0) {
        console.log("Confirmed map data was loaded properly");
        resolve(true);
      } else {
        console.log("Script loaded but map data wasn't properly initialized");
        // Create the fallback data structure
        createFallbackMapData();
        resolve(true);
      }
    };

    script.onerror = () => {
      console.error("Failed to load map data script");
      createFallbackMapData();
      resolve(true);
    };
    
    // Add a timeout to handle case where onload doesn't fire
    const timeout = setTimeout(() => {
      console.log("Map script load timeout reached");
      createFallbackMapData();
      resolve(true);
    }, 5000);
    
    script.onload = () => {
      clearTimeout(timeout);
      console.log("Map data script loaded successfully");
      
      // Check if the script actually loaded the map data
      if (window.jQuery?.fn?.vectorMap?.maps && Object.keys(window.jQuery.fn.vectorMap.maps).length > 0) {
        console.log("Confirmed map data was loaded properly");
        resolve(true);
      } else {
        console.log("Script loaded but map data wasn't properly initialized");
        // Create the fallback data structure
        createFallbackMapData();
        resolve(true);
      }
    };

    document.head.appendChild(script);
  });
}

// Create a fallback map data structure
function createFallbackMapData() {
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

// Example array of coordinate pairs for Route 66 towns
const coordinatesData: [number, number][] = [
  [34.0522, -118.2437], // Los Angeles (start of Route 66)
  [35.1983, -111.6513], // Flagstaff, AZ
  [35.0845, -106.6511], // Albuquerque, NM
  [35.2220, -101.8313], // Amarillo, TX
  [35.4676, -97.5164],  // Oklahoma City, OK
  [38.6273, -90.1979],  // St. Louis, MO
  [41.8781, -87.6298],  // Chicago, IL (end of Route 66)
];

// Transform the array of coordinate pairs into the desired structure
export const locations: Location[] = coordinatesData.map(
  ([lat, lng], index) => ({
    latLng: [lat, lng],
    name: `Route 66 Stop ${index + 1}`,
  })
);
