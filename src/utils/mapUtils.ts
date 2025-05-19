
// src/utils/mapUtils.ts
import { Location } from '@/types/route66';

// Check if jQuery and jVectorMap scripts are loaded
export function checkScriptsLoaded(): boolean {
  if (typeof window === 'undefined') return false;
  
  const jQueryLoaded = typeof window.jQuery !== 'undefined';
  const jVectorMapLoaded = jQueryLoaded && typeof window.jQuery.fn.vectorMap !== 'undefined';
  
  if (jQueryLoaded && jVectorMapLoaded) {
    console.log('✅ jQuery and jVectorMap loaded successfully');
    return true;
  }
  
  console.log('❌ Scripts not loaded:', { 
    jQuery: jQueryLoaded ? '✅' : '❌', 
    jVectorMap: jVectorMapLoaded ? '✅' : '❌' 
  });
  
  return false;
}

// Initialize jVectorMap with specified locations
export function initializeJVectorMap(mapContainer: HTMLDivElement, locations: Location[]): boolean {
  try {
    if (!window.jQuery || !window.jQuery.fn || !window.jQuery.fn.vectorMap) {
      console.error('❌ jQuery or jVectorMap not loaded');
      return false;
    }
    
    // Access the map data
    if (!window.jQuery.fn.vectorMap.maps || !window.jQuery.fn.vectorMap.maps.us_aea_en) {
      console.error('❌ US map data not loaded');
      return false;
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
      onRegionClick: function(element, code, region) {
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
      window.jQuery(mapContainer).empty();
    }
  } catch (error) {
    console.error('Error cleaning up map:', error);
  }
}

// Define the structure for each location
export interface Location {
  latLng: [number, number];
  name: string;
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
