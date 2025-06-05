
import { StopCurationConfig, TargetNumbers } from './StopCurationConfig';

export class TargetNumberCalculator {
  /**
   * Calculate target numbers for each stop category
   */
  static calculateTargetNumbers(
    config: StopCurationConfig,
    expectedDriveTime: number
  ): TargetNumbers {
    // Adjust based on drive time - longer drives get fewer stops
    let adjustedMaxStops = config.maxStops;
    if (expectedDriveTime > 6) {
      adjustedMaxStops = Math.max(2, Math.floor(config.maxStops * 0.7));
    } else if (expectedDriveTime < 3) {
      adjustedMaxStops = Math.min(6, Math.floor(config.maxStops * 1.2));
    }
    
    // Calculate attractions vs other stops
    const attractionCount = Math.round(adjustedMaxStops * config.attractionRatio);
    const remainingStops = adjustedMaxStops - attractionCount;
    
    // Split remaining between waypoints and hidden gems
    const waypointCount = Math.ceil(remainingStops * 0.6);
    const hiddenGemCount = remainingStops - waypointCount;
    
    return {
      attractions: attractionCount,
      waypoints: waypointCount,
      hiddenGems: hiddenGemCount
    };
  }
}
