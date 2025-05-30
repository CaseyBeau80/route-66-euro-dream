
import { DetailedWaypointData } from './types/DetailedWaypointData';
import { illinoisWaypoints } from './waypoints/IllinoisWaypoints';
import { missouriWaypoints } from './waypoints/MissouriWaypoints';
import { oklahomaWaypoints } from './waypoints/OklahomaWaypoints';
import { texasWaypoints } from './waypoints/TexasWaypoints';
import { newMexicoWaypoints } from './waypoints/NewMexicoWaypoints';
import { arizonaWaypoints } from './waypoints/ArizonaWaypoints';
import { californiaWaypoints } from './waypoints/CaliforniaWaypoints';

// Enhanced Route 66 waypoints with extensive detailed points along the historic route
// These follow the actual roads and highways that made up Route 66 with much higher precision
export const detailedRoute66Waypoints: DetailedWaypointData[] = [
  ...illinoisWaypoints,
  ...missouriWaypoints,
  ...oklahomaWaypoints,
  ...texasWaypoints,
  ...newMexicoWaypoints,
  ...arizonaWaypoints,
  ...californiaWaypoints,
];

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
