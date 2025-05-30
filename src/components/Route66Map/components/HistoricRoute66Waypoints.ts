
// Historic Route 66 waypoints - DEPRECATED
// Use ComprehensiveRoute66Waypoints.ts instead for accurate highway-following coordinates

console.warn('⚠️ HistoricRoute66Waypoints.ts is deprecated. Use ComprehensiveRoute66Waypoints.ts for accurate highway routing.');

// Re-export the comprehensive waypoints for backwards compatibility
export { comprehensiveRoute66Waypoints as historicRoute66Waypoints } from './waypoints/ComprehensiveRoute66Waypoints';
export { validateComprehensiveWaypoints as validateRoute66Waypoints } from './waypoints/ComprehensiveRoute66Waypoints';
