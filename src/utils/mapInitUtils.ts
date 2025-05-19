
// mapInitUtils.ts - Handles map initialization and management
import { Location } from './mapTypes';
import { checkScriptsLoaded } from './mapDependencyUtils';
import { createFallbackMapDisplay } from './mapFallbackRenderer';
import { initializeVectorMap, findBestAvailableMap } from './vectorMapInitializer';

// Initialize jVectorMap with specified locations
export function initializeJVectorMap(mapContainer: HTMLDivElement, locations: Location[]): boolean {
  try {
    if (!checkScriptsLoaded()) {
      console.error('❌ jQuery, jVectorMap, or map data not loaded');
      return false;
    }
    
    console.log('✅ All dependencies loaded, initializing map');
    
    // Get the best available map
    const mapName = findBestAvailableMap();
    if (!mapName) {
      console.error('❌ No map data found despite checking');
      return false;
    }
    
    console.log(`Using map: ${mapName}`);
    
    try {
      // Try to initialize with the standard approach
      const success = initializeVectorMap(mapContainer, locations, mapName);
      
      if (success) {
        console.log('✅ Map initialized successfully');
        return true;
      }
    } catch (error) {
      console.error('Initial vectorMap initialization failed:', error);
      
      // Try alternative approach with fallback implementation
      try {
        console.log('Using fallback map implementation');
        createFallbackMapDisplay(mapContainer, locations);
        console.log('Fallback map display created successfully');
        return true;
      } catch (fallbackError) {
        console.error('Fallback initialization also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    return false;
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
