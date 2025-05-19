
// mapUtils.ts - Main entry point for map utilities
// Re-export all map utilities for backwards compatibility

export { checkScriptsLoaded, createFallbackMapData } from './mapDependencyUtils';
export { initializeJVectorMap, cleanupMap } from './mapInitUtils';
export { ensureMapDataLoaded } from './mapDataUtils';
export { route66Towns } from './mapTypes';
export type { Location } from './mapTypes'; 
export { createFallbackMapDisplay } from './mapFallbackRenderer';
export { initializeVectorMap, findBestAvailableMap } from './vectorMapInitializer';
export { ensureJvmObjectExists } from './jvmObjectHandler';
