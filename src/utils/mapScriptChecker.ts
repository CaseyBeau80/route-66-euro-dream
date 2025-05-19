
// mapScriptChecker.ts - Handles checking if required map scripts are loaded

/**
 * Check if jQuery and jVectorMap scripts are loaded
 */
export function checkScriptsLoaded(): boolean {
  if (typeof window === 'undefined') return false;
  
  const jQueryLoaded = typeof window.jQuery !== 'undefined';
  const jVectorMapLoaded = jQueryLoaded && typeof window.jQuery.fn.vectorMap !== 'undefined';
  
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
