
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
    
    if (expectedDriveTime <= 5) {
      // Scenic route - more stops
      adjustedMaxStops = Math.min(4, Math.floor(config.maxStops * 1.3));
    } else if (expectedDriveTime > 5 && expectedDriveTime <= 7) {
      // Efficient route - moderate stops
      adjustedMaxStops = 3;
    } else {
      // Warrior route - minimal stops  
      adjustedMaxStops = Math.max(1, Math.floor(config.maxStops * 0.5));
    }
    
    console.log(`🎯 Drive time ${expectedDriveTime.toFixed(1)}h → ${adjustedMaxStops} max stops`);
    
    // Calculate attractions vs other stops
    const attractionCount = Math.round(adjustedMaxStops * config.attractionRatio);
    const remainingStops = adjustedMaxStops - attractionCount;
    
    // Split remaining between waypoints and hidden gems
    const waypointCount = Math.ceil(remainingStops * 0.6);
    const hiddenGemCount = remainingStops - waypointCount;
    
    return {
      attractions: Math.max(1, attractionCount),
      waypoints: waypointCount,
      hiddenGems: hiddenGemCount
    };
  }
}
