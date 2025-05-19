
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

    console.log("Attempting to load map data dynamically");

    // Create a script element to load the map data
    const script = document.createElement('script');
    script.src = "/jquery.vmap.usa.js"; // This is in the public folder
    script.async = true;

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

    script.onerror = () => {
      clearTimeout(timeout);
      console.error("Failed to load map data script");
      createFallbackMapData();
      resolve(true);
    };

    document.head.appendChild(script);
  });
}
