
import { TripStyleLogic } from './TripStyleLogic';

export class EnhancedTripStyleLogic {
  /**
   * Enhanced trip style configuration - FIXED: Only destination-focused
   */
  static getEnhancedConfig(tripStyle: 'destination-focused') {
    const baseConfig = TripStyleLogic.getStyleConfig(tripStyle);
    
    return {
      ...baseConfig,
      enhanced: true,
      driveTimeOptimization: 'aggressive',
      destinationPriority: 'maximum'
    };
  }

  /**
   * Validate trip style parameters
   */
  static validateStyle(tripStyle: 'destination-focused'): boolean {
    return tripStyle === 'destination-focused';
  }
}
