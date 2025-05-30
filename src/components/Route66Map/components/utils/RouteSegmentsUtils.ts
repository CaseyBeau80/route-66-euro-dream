
import { detailedRoute66Waypoints } from '../Route66WaypointsCoordinator';

// Create smaller segments for better road following with the expanded data
export const getRoute66Segments = (): Array<{start: number, end: number, maxWaypoints: number}> => {
  const segments = [];
  const totalWaypoints = detailedRoute66Waypoints.length;
  const segmentSize = 23; // Maximum waypoints per segment (Google's limit is 25, leaving room for start/end)
  
  for (let i = 0; i < totalWaypoints; i += segmentSize) {
    const end = Math.min(i + segmentSize, totalWaypoints);
    segments.push({
      start: i,
      end: end,
      maxWaypoints: end - i
    });
  }
  
  return segments;
};
