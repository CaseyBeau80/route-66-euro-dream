
// mapDataUtils.ts - Handles map data loading
import { createFallbackMapData } from './mapDependencyUtils';

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

    console.log("Attempting to create fallback map data");
    
    // Create fallback map data since external loading often fails
    createFallbackMapData();
    
    // Check if we now have map data after creating fallback
    if (window.jQuery?.fn?.vectorMap?.maps && Object.keys(window.jQuery.fn.vectorMap.maps).length > 0) {
      console.log("Successfully created fallback map data");
      resolve(true);
      return;
    }

    // If still no map data, try loading from external source as last resort
    console.log("Attempting to load map data from external source");
    const script = document.createElement('script');
    script.src = "/jquery.vmap.usa.js"; 
    script.async = true;

    const timeout = setTimeout(() => {
      console.log("Map script load timeout reached");
      createFallbackMapData();
      resolve(true);
    }, 3000);
    
    script.onload = () => {
      clearTimeout(timeout);
      console.log("Map data script loaded successfully");
      
      if (window.jQuery?.fn?.vectorMap?.maps && Object.keys(window.jQuery.fn.vectorMap.maps).length > 0) {
        console.log("Confirmed map data was loaded properly");
        resolve(true);
      } else {
        console.log("Script loaded but map data wasn't properly initialized");
        createFallbackMapData();
        resolve(true);
      }
    };

    script.onerror = () => {
      clearTimeout(timeout);
      console.error("Failed to load map data script");
      createFallbackMapData();
      resolve(true);
    };

    document.head.appendChild(script);
  });
}
