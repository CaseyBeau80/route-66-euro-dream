
// mapUtils.ts - Main entry point for map utilities
// Re-export all map utilities for backwards compatibility

export { checkScriptsLoaded, createFallbackMapData } from './mapDependencyUtils';
export { initializeJVectorMap, cleanupMap } from './mapInitUtils';
export { ensureMapDataLoaded } from './mapDataUtils';
export { Location, locations } from './mapTypes';
