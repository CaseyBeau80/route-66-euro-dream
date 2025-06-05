
import { StopCurationConfig, TargetNumbers } from './StopCurationConfig';

export class TargetNumberCalculator {
  /**
   * Calculate target numbers for each category based on config and drive time
   */
  static calculateTargetNumbers(
    config: StopCurationConfig,
    expectedDriveTime: number
  ): TargetNumbers {
    // Adjust max stops based on drive time (longer drives = more stops)
    let adjustedMaxStops = config.maxStops;
    if (expectedDriveTime > 6) {
      adjustedMaxStops = Math.min(6, config.maxStops + 1);
    } else if (expectedDriveTime < 3) {
      adjustedMaxStops = Math.max(2, config.maxStops - 1);
    }

    const attractionCount = Math.ceil(adjustedMaxStops * config.attractionRatio);
    const waypointCount = Math.floor(adjustedMaxStops * (1 - config.attractionRatio));
    const hiddenGemCount = Math.max(1, Math.floor(adjustedMaxStops * 0.25)); // At least 1 hidden gem if possible

    // Ensure we don't exceed max stops
    const totalTarget = attractionCount + waypointCount + hiddenGemCount;
    if (totalTarget > adjustedMaxStops) {
      return {
        attractions: Math.max(1, attractionCount - 1),
        waypoints: Math.max(1, waypointCount),
        hiddenGems: Math.max(0, hiddenGemCount - 1)
      };
    }

    return {
      attractions: attractionCount,
      waypoints: waypointCount,
      hiddenGems: hiddenGemCount
    };
  }
}
