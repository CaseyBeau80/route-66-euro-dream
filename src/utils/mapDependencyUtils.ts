
// mapDependencyUtils.ts - Handles dependency and script checking for the map
// Re-exports functionality from more focused modules

import { checkScriptsLoaded as checkScripts } from './mapScriptChecker';
import { createFallbackMapData } from './mapFallbackData';
import { ensureJvmObjectExists } from './jvmObjectHandler';

// Check if scripts are loaded and ensure jvm exists if needed
export function checkScriptsLoaded(): boolean {
  const scriptsLoaded = checkScripts();
  
  // If jQuery and jVectorMap are loaded but jvm is missing, create it
  if (scriptsLoaded && typeof window !== 'undefined' && 
      typeof window.jQuery !== 'undefined' && 
      typeof (window as any).jvm === 'undefined') {
    ensureJvmObjectExists();
  }
  
  return scriptsLoaded;
}

// Re-export createFallbackMapData
export { createFallbackMapData };
