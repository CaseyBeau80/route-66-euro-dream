
import { TripStop } from '../data/SupabaseDataService';
import { PopulationScoringService } from './PopulationScoringService';

export interface TripStyleConfig {
  style: 'balanced' | 'destination-focused';
  maxDailyDriveHours: number;
  preferDestinationCities: boolean;
  allowFlexibleStops: boolean;
  balancePriority: 'distance' | 'attractions' | 'heritage';
  enforcementLevel: 'strict' | 'moderate' | 'flexible';
  populationWeight: number; // NEW: Weight for population scoring
  populationThreshold: number; // NEW: Minimum population threshold
}

export class TripStyleLogic {
  /**
   * Get configuration based on trip style with population considerations
   */
  static getStyleConfig(style: 'balanced' | 'destination-focused'): TripStyleConfig {
    switch (style) {
      case 'balanced':
        return {
          style: 'balanced',
          maxDailyDriveHours: 6,
          preferDestinationCities: false,
          allowFlexibleStops: true,
          balancePriority: 'distance',
          enforcementLevel: 'strict',
          populationWeight: 0.3, // 30% weight for population
          populationThreshold: 1000 // Minimum 1k population
        };
      
      case 'destination-focused':
        return {
          style: 'destination-focused',
          maxDailyDriveHours: 10,
          preferDestinationCities: true,
          allowFlexibleStops: false,
          balancePriority: 'heritage',
          enforcementLevel: 'strict',
          populationWeight: 0.4, // 40% weight for population - higher for destination-focused
          populationThreshold: 5000 // Minimum 5k population for destination cities
        };
      
      default:
        return this.getStyleConfig('balanced');
    }
  }

  /**
   * Filter stops based on trip style preferences with population considerations
   */
  static filterStopsByStyle(
    stops: TripStop[], 
    config: TripStyleConfig
  ): TripStop[] {
    console.log(`🎯 Filtering ${stops.length} stops with ${config.style} style (pop weight: ${config.populationWeight})`);
    
    // Apply population threshold filtering
    const populationFiltered = PopulationScoringService.filterByPopulationThreshold(
      stops,
      config.style,
      config.enforcementLevel === 'strict'
    );
    
    console.log(`📊 Population filter: ${stops.length} → ${populationFiltered.length} stops (min: ${config.populationThreshold})`);
    
    // Apply existing style-based filtering
    if (config.preferDestinationCities) {
      // For destination-focused, prioritize heritage cities with good population
      const destinationCities = populationFiltered.filter(stop => 
        stop.category === 'destination_city'
      );
      
      // Sort by population-enhanced score
      const sortedCities = destinationCities.sort((a, b) => 
        PopulationScoringService.compareByPopulationScore(a, b, 50, 50, config.populationWeight)
      );
      
      // Add other stops only if we need more options
      if (sortedCities.length < 3) {
        const otherStops = populationFiltered.filter(stop => 
          stop.category !== 'destination_city'
        ).slice(0, 5);
        return [...sortedCities, ...otherStops];
      }
      
      return sortedCities;
    }
    
    // For balanced, use all stops but sort by population-enhanced scoring
    return populationFiltered.sort((a, b) => 
      PopulationScoringService.compareByPopulationScore(a, b, 50, 50, config.populationWeight)
    );
  }

  /**
   * Calculate style-specific metrics with enhanced population validation
   */
  static calculateStyleMetrics(
    totalDistance: number,
    totalDays: number,
    config: TripStyleConfig
  ): {
    dailyDistanceTarget: number;
    dailyDriveTimeTarget: number;
    isWithinLimits: boolean;
    recommendation?: string;
    requiresRebalancing: boolean;
    populationGuidance?: string; // NEW: Population-based guidance
  } {
    const dailyDistanceTarget = totalDistance / totalDays;
    const dailyDriveTimeTarget = dailyDistanceTarget / 50; // Assume 50 mph average
    
    const isWithinLimits = dailyDriveTimeTarget <= config.maxDailyDriveHours;
    const requiresRebalancing = dailyDriveTimeTarget > config.maxDailyDriveHours;
    
    let recommendation: string | undefined;
    let populationGuidance: string | undefined;
    
    if (!isWithinLimits) {
      const minDaysNeeded = Math.ceil(totalDistance / (config.maxDailyDriveHours * 50));
      recommendation = `Consider ${minDaysNeeded}+ days for a comfortable ${config.style} trip (current avg: ${dailyDriveTimeTarget.toFixed(1)}h/day, limit: ${config.maxDailyDriveHours}h/day)`;
    }
    
    // Add population guidance
    if (config.style === 'destination-focused') {
      populationGuidance = `Prioritizing cities with ${config.populationThreshold.toLocaleString()}+ population for authentic heritage destinations`;
    } else {
      populationGuidance = `Balancing population centers (${config.populationThreshold.toLocaleString()}+ residents) with smaller Route 66 communities`;
    }
    
    return {
      dailyDistanceTarget,
      dailyDriveTimeTarget,
      isWithinLimits,
      recommendation,
      requiresRebalancing,
      populationGuidance
    };
  }

  /**
   * Get enforcement strictness based on trip style
   */
  static shouldEnforceStrictDriveLimits(config: TripStyleConfig): boolean {
    return config.enforcementLevel === 'strict';
  }

  /**
   * Calculate population-enhanced destination score
   */
  static calculateDestinationScore(
    stop: TripStop,
    config: TripStyleConfig,
    baseScore: number = 50
  ): number {
    return PopulationScoringService.calculateWeightedScore(
      stop,
      baseScore,
      config.populationWeight
    );
  }

  /**
   * Get population statistics for trip style analysis
   */
  static analyzePopulationDistribution(
    selectedStops: TripStop[],
    config: TripStyleConfig
  ): {
    statistics: ReturnType<typeof PopulationScoringService.getPopulationStatistics>;
    styleCompliance: {
      meetsThreshold: boolean;
      averageAboveThreshold: boolean;
      recommendedAdjustments?: string[];
    };
  } {
    const statistics = PopulationScoringService.getPopulationStatistics(selectedStops);
    
    const meetsThreshold = selectedStops.every(stop => 
      (stop.population || 0) >= config.populationThreshold
    );
    
    const averageAboveThreshold = statistics.average >= config.populationThreshold;
    
    const recommendedAdjustments: string[] = [];
    
    if (!meetsThreshold) {
      recommendedAdjustments.push(`Some destinations below ${config.populationThreshold.toLocaleString()} population threshold`);
    }
    
    if (!averageAboveThreshold) {
      recommendedAdjustments.push(`Average population (${Math.round(statistics.average).toLocaleString()}) below threshold`);
    }
    
    if (statistics.tierDistribution.minor > (selectedStops.length / 2)) {
      recommendedAdjustments.push('Consider more medium/major cities for better trip balance');
    }
    
    return {
      statistics,
      styleCompliance: {
        meetsThreshold,
        averageAboveThreshold,
        recommendedAdjustments: recommendedAdjustments.length > 0 ? recommendedAdjustments : undefined
      }
    };
  }
}
