
import { TripStyleLogic } from './TripStyleLogic';
import { TripStop } from '../../types/TripStop';

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
      destinationPriority: 'maximum',
      heritageWeight: 0.7,
      prioritizeHeritageOverDistance: true,
      style: tripStyle
    };
  }

  /**
   * Get enhanced style configuration (alias for getEnhancedConfig)
   */
  static getEnhancedStyleConfig(tripStyle: 'destination-focused') {
    return this.getEnhancedConfig(tripStyle);
  }

  /**
   * Filter stops with heritage and population criteria
   */
  static filterStopsWithHeritageAndPopulation(
    stops: TripStop[],
    config: any
  ): TripStop[] {
    return stops.filter(stop => {
      // Heritage criteria
      const hasHeritageValue = stop.heritage_score && stop.heritage_score > 50;
      
      // Population criteria for destination cities
      const isDestinationCity = stop.category === 'destination_city';
      const hasPopulation = stop.population && stop.population > 10000;
      
      // Allow destination cities with heritage or population
      if (isDestinationCity && (hasHeritageValue || hasPopulation)) {
        return true;
      }
      
      // Allow other stops with high heritage value
      if (hasHeritageValue) {
        return true;
      }
      
      return false;
    });
  }

  /**
   * Validate trip style parameters
   */
  static validateStyle(tripStyle: 'destination-focused'): boolean {
    return tripStyle === 'destination-focused';
  }
}
