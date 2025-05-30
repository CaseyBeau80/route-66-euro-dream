
// Historic Route 66 waypoints - DEPRECATED
// Use ComprehensiveRoute66Waypoints.ts instead for accurate highway-following coordinates

// Re-export the comprehensive waypoints for backwards compatibility
export { comprehensiveRoute66Waypoints as historicRoute66Waypoints } from './waypoints/ComprehensiveRoute66Waypoints';
export { validateComprehensiveWaypoints as validateRoute66Waypoints } from './waypoints/ComprehensiveRoute66Waypoints';

// Add the missing function that other components are trying to import
export const getHistoricRoute66Segments = () => {
  // Return basic segments for backwards compatibility
  return [
    { start: 0, end: 10, highway: "I-55", description: "Illinois segment" },
    { start: 10, end: 20, highway: "I-44", description: "Missouri segment" },
    { start: 20, end: 30, highway: "I-44", description: "Oklahoma segment" },
    { start: 30, end: 40, highway: "I-40", description: "Texas segment" },
    { start: 40, end: 50, highway: "I-40", description: "New Mexico segment" },
    { start: 50, end: 60, highway: "I-40/Historic US-66", description: "Arizona segment" },
    { start: 60, end: 70, highway: "I-40/Historic US-66", description: "California segment" }
  ];
};
