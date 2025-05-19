
// vectorMapInitializer.ts - Handles jVectorMap initialization

import { Location } from './mapTypes';
import { checkScriptsLoaded } from './mapDependencyUtils';
import { createMockJvmMap, createFallbackMapDisplay } from './mapFallbackRenderer';

/**
 * Configure and initialize the jVectorMap with provided locations
 */
export function initializeVectorMap(mapContainer: HTMLDivElement, locations: Location[], mapName: string): boolean {
  try {
    // Ensure jvm.Map constructor exists
    if (typeof window.jvm === 'undefined' || typeof window.jvm.Map !== 'function') {
      console.log('Creating jvm.Map constructor');
      createMockJvmMap();
    }
    
    // Initialize the vector map with parameters
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
    
    console.log('✅ Vector map initialized successfully');
    return true;
  } catch (error) {
    console.error('Vector map initialization failed:', error);
    return false;
  }
}

/**
 * Find the best available map to use
 */
export function findBestAvailableMap(): string {
  if (!window.jQuery?.fn?.vectorMap?.maps) {
    return '';
  }
  
  const availableMaps = Object.keys(window.jQuery.fn.vectorMap.maps);
  if (availableMaps.length === 0) {
    return '';
  }
  
  // Prefer 'us_aea_en' or 'usa' maps, but fall back to any available map
  return availableMaps.find(name => name === 'us_aea_en') || 
         availableMaps.find(name => name === 'usa') || 
         availableMaps[0];
}
