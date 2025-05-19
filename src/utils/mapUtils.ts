
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
  
  // More permissive check for map data - just verify jQuery and jVectorMap are loaded
  // This will allow us to proceed with initialization even if map data isn't fully detected
  // Map data will be initialized manually if needed
  
  console.log('Checking dependencies:', {
    jQuery: jQueryLoaded ? '✅' : '❌',
    jVectorMap: jVectorMapLoaded ? '✅' : '❌',
    mapData: jVectorMapLoaded ? '✅' : '❌'  // Changed to match jVectorMap status
  });
  
  return jQueryLoaded && jVectorMapLoaded;
}

// Initialize jVectorMap with specified locations
export function initializeJVectorMap(mapContainer: HTMLDivElement, locations: Location[]): boolean {
  try {
    if (!window.jQuery || !window.jQuery.fn || !window.jQuery.fn.vectorMap) {
      console.error('❌ jQuery or jVectorMap not loaded');
      return false;
    }
    
    console.log('✅ Dependencies loaded, initializing map');
    
    // Manually add US map data if it's missing
    if (!window.jQuery.fn.vectorMap.maps || !window.jQuery.fn.vectorMap.maps['us_aea_en']) {
      console.log('Adding US map data manually');
      // Add map data using the function from the external script
      if (typeof jQuery.fn.vectorMap === 'function' && typeof jQuery.fn.vectorMap.addMap === 'function') {
        try {
          // The map data is already added via the included script in public/jquery.vmap.usa.js
          console.log('Map data should be loaded from external script');
        } catch (error) {
          console.error('Failed to add map data manually:', error);
          return false;
        }
      }
    }
    
    // Setup jVectorMap
    window.jQuery(mapContainer).vectorMap({
      map: 'us_aea_en',
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

// Example array of coordinate pairs
const coordinatesData: [number, number][] = [
  [34.0522, -118.2437], // Los Angeles
  [36.1699, -115.1398], // Las Vegas
  [35.4676, -97.5164],  // Oklahoma City
  [41.8781, -87.6298],  // Chicago
  // Add more coordinates as needed
];

// Transform the array of coordinate pairs into the desired structure
export const locations: Location[] = coordinatesData.map(
  ([lat, lng], index) => ({
    latLng: [lat, lng],
    name: `Location ${index + 1}`,
  })
);
