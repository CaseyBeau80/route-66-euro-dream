
// mapUtils.ts - Main entry point for map utilities
// Re-export all map utilities for backwards compatibility

export { checkScriptsLoaded, createFallbackMapData } from './mapDependencyUtils';
export { initializeJVectorMap, cleanupMap } from './mapInitUtils';
export { ensureMapDataLoaded } from './mapDataUtils';
export type { Location } from './mapTypes'; // Changed to 'export type'
export { locations } from './mapTypes';
