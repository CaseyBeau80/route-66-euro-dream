
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
  
  // More permissive check for map data
  const mapDataLoaded = jVectorMapLoaded && 
                         window.jQuery.fn.vectorMap.maps && 
                         (typeof window.jQuery.fn.vectorMap.maps['us_aea_en'] !== 'undefined' || 
                          typeof window.jQuery.fn.vectorMap.maps['usa'] !== 'undefined');
  
  console.log('Checking dependencies:', {
    jQuery: jQueryLoaded ? '✅' : '❌',
    jVectorMap: jVectorMapLoaded ? '✅' : '❌',
    mapData: mapDataLoaded ? '✅' : '❌'
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
    
    // Determine which map to use based on what's available
    const mapName = window.jQuery.fn.vectorMap.maps['us_aea_en'] ? 'us_aea_en' : 'usa';
    
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
