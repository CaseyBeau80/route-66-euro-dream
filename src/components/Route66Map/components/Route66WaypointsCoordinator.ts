
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
