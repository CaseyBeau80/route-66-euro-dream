
import { TripStop } from '../data/SupabaseDataService';
import { TripStyleLogic, TripStyleConfig } from './TripStyleLogic';
import { HeritageScoringService } from './HeritageScoringService';
import { PopulationScoringService } from './PopulationScoringService';

export interface EnhancedTripStyleConfig extends TripStyleConfig {
  heritageWeight: number;
  heritageMinimumTier: 'iconic' | 'major' | 'significant' | 'notable' | 'standard';
  prioritizeHeritageOverDistance: boolean;
  enforceHeritageSequence: boolean;
  populationWeight: number;
  populationThreshold: number;
  enforcementLevel: 'strict' | 'moderate' | 'flexible';
}

export class EnhancedTripStyleLogic extends TripStyleLogic {
  /**
   * Get enhanced configuration with heritage prioritization
   */
  static getEnhancedStyleConfig(style: 'balanced' | 'destination-focused'): EnhancedTripStyleConfig {
    const baseConfig = super.getStyleConfig(style);
    
    switch (style) {
      case 'destination-focused':
        return {
          ...baseConfig,
          heritageWeight: 0.6, // 60% weight for heritage
          heritageMinimumTier: 'significant', // Only significant+ heritage cities
          prioritizeHeritageOverDistance: true,
          enforceHeritageSequence: true,
          populationWeight: 0.2, // Reduce population weight in favor of heritage
          populationThreshold: 1000, // Lower population threshold for heritage focus
          enforcementLevel: 'strict'
        };
      
      case 'balanced':
        return {
          ...baseConfig,
          heritageWeight: 0.3, // 30% weight for heritage
          heritageMinimumTier: 'notable', // Include notable+ heritage cities
          prioritizeHeritageOverDistance: false,
          enforceHeritageSequence: false,
          populationWeight: 0.3, // Keep balanced population consideration
          populationThreshold: 1000,
          enforcementLevel: 'moderate'
        };
      
      default:
        return this.getEnhancedStyleConfig('balanced');
    }
  }

  /**
   * Enhanced filtering with heritage and population considerations
   */
  static filterStopsWithHeritageAndPopulation(
    stops: TripStop[],
    config: EnhancedTripStyleConfig
  ): TripStop[] {
    console.log(`🏛️ Enhanced filtering: ${stops.length} stops with heritage focus (${config.style})`);

    // Step 1: Apply heritage tier filtering for destination-focused trips
    let filteredStops = stops;
    
    if (config.style === 'destination-focused') {
      const heritageFiltered = HeritageScoringService.filterByHeritageTier(
        stops,
        config.heritageMinimumTier
      );
      
      console.log(`🏛️ Heritage filter: ${stops.length} → ${heritageFiltered.length} stops (min tier: ${config.heritageMinimumTier})`);
      
      // If heritage filtering is too restrictive, fall back to population filtering
      if (heritageFiltered.length >= 3) {
        filteredStops = heritageFiltered;
      } else {
        console.warn(`⚠️ Heritage filtering too restrictive (${heritageFiltered.length} cities), using population filter`);
        filteredStops = PopulationScoringService.filterByPopulationThreshold(
          stops,
          config.style,
          config.enforcementLevel === 'strict'
        );
      }
    } else {
      // For balanced trips, use population filtering first
      filteredStops = PopulationScoringService.filterByPopulationThreshold(
        stops,
        config.style,
        config.enforcementLevel === 'strict'
      );
    }

    // Step 2: Sort by heritage-enhanced scoring
    const scoredStops = filteredStops.map(stop => ({
      stop,
      heritageScore: HeritageScoringService.calculateHeritageScore(stop),
      combinedScore: this.calculateCombinedScore(stop, config)
    }));

    // Sort by combined score (heritage + population + other factors)
    scoredStops.sort((a, b) => b.combinedScore - a.combinedScore);

    // Log top candidates
    console.log(`🎯 Top heritage-enhanced candidates:`);
    scoredStops.slice(0, 5).forEach((candidate, index) => {
      const { stop, heritageScore, combinedScore } = candidate;
      const popScore = PopulationScoringService.calculatePopulationScore(stop);
      console.log(`   ${index + 1}. ${stop.name}: heritage=${heritageScore.heritageScore} (${heritageScore.heritageTier}), pop=${popScore.rawPopulation.toLocaleString()}, combined=${combinedScore.toFixed(1)}`);
    });

    return scoredStops.map(scored => scored.stop);
  }

  /**
   * Calculate combined heritage + population + distance score
   */
  private static calculateCombinedScore(
    stop: TripStop,
    config: EnhancedTripStyleConfig,
    baseScore: number = 50
  ): number {
    // Heritage component
    const heritageScore = HeritageScoringService.calculateHeritageScore(stop);
    const heritageComponent = heritageScore.heritageScore * config.heritageWeight;

    // Population component  
    const popScore = PopulationScoringService.calculatePopulationScore(stop);
    const populationComponent = popScore.normalizedScore * popScore.weight * config.populationWeight;

    // Base score component (distance, etc.)
    const baseComponent = baseScore * (1 - config.heritageWeight - config.populationWeight);

    // Heritage tier bonus for destination-focused trips
    const heritageTierBonus = config.style === 'destination-focused' ? this.getHeritageTierBonus(heritageScore.heritageTier) : 0;

    const totalScore = heritageComponent + populationComponent + baseComponent + heritageTierBonus;

    return Math.max(0, totalScore);
  }

  /**
   * Get bonus points for heritage tier in destination-focused trips
   */
  private static getHeritageTierBonus(tier: string): number {
    const bonuses = {
      'iconic': 25,
      'major': 15,
      'significant': 10,
      'notable': 5,
      'standard': 0
    };
    return bonuses[tier as keyof typeof bonuses] || 0;
  }

  /**
   * Enhanced style metrics with heritage analysis
   */
  static calculateEnhancedStyleMetrics(
    totalDistance: number,
    totalDays: number,
    selectedStops: TripStop[],
    config: EnhancedTripStyleConfig
  ): {
    dailyDistanceTarget: number;
    dailyDriveTimeTarget: number;
    isWithinLimits: boolean;
    recommendation?: string;
    requiresRebalancing: boolean;
    heritageAnalysis: {
      averageHeritageScore: number;
      tierDistribution: Record<string, number>;
      heritageCompliance: string;
      topHeritageCities: string[];
    };
    populationGuidance?: string;
  } {
    const baseMetrics = super.calculateStyleMetrics(totalDistance, totalDays, config);
    
    // Add heritage analysis
    const heritageStats = HeritageScoringService.getHeritageStatistics(selectedStops);
    
    let heritageCompliance = 'Poor';
    if (heritageStats.averageHeritageScore >= 80) {
      heritageCompliance = 'Excellent';
    } else if (heritageStats.averageHeritageScore >= 60) {
      heritageCompliance = 'Good';
    } else if (heritageStats.averageHeritageScore >= 40) {
      heritageCompliance = 'Fair';
    }

    return {
      ...baseMetrics,
      heritageAnalysis: {
        averageHeritageScore: heritageStats.averageHeritageScore,
        tierDistribution: heritageStats.tierDistribution,
        heritageCompliance,
        topHeritageCities: heritageStats.topHeritageCities.map(city => city.city)
      }
    };
  }

  /**
   * Enhanced destination selection with heritage prioritization
   */
  static selectDestinationWithHeritagePriority(
    currentStop: TripStop,
    availableStops: TripStop[],
    targetDistance: number,
    config: EnhancedTripStyleConfig
  ): TripStop | null {
    if (availableStops.length === 0) return null;

    console.log(`🏛️ Heritage-priority selection from ${availableStops.length} candidates`);

    // Filter by heritage and population
    const qualifiedStops = this.filterStopsWithHeritageAndPopulation(availableStops, config);

    if (qualifiedStops.length === 0) {
      console.warn(`⚠️ No qualified heritage stops found, using fallback selection`);
      return availableStops[0]; // Fallback to first available
    }

    // Select best destination based on combined scoring
    let bestDestination: TripStop | null = null;
    let bestScore = -1;

    for (const candidate of qualifiedStops.slice(0, 10)) { // Consider top 10 candidates
      const distance = this.calculateDistance(currentStop, candidate);
      
      // Distance score (proximity to target)
      const distanceScore = Math.max(0, 100 - Math.abs(distance - targetDistance) / targetDistance * 100);
      
      // Combined heritage + population score
      const combinedScore = this.calculateCombinedScore(candidate, config, distanceScore);

      if (combinedScore > bestScore) {
        bestScore = combinedScore;
        bestDestination = candidate;
      }
    }

    if (bestDestination) {
      const heritageScore = HeritageScoringService.calculateHeritageScore(bestDestination);
      console.log(`✅ Heritage-priority selection: ${bestDestination.name} (heritage: ${heritageScore.heritageScore}, tier: ${heritageScore.heritageTier})`);
    }

    return bestDestination;
  }

  /**
   * Simple distance calculation helper
   */
  private static calculateDistance(stop1: TripStop, stop2: TripStop): number {
    const R = 3958.8; // Earth's radius in miles
    const φ1 = stop1.latitude * Math.PI / 180;
    const φ2 = stop2.latitude * Math.PI / 180;
    const Δφ = (stop2.latitude - stop1.latitude) * Math.PI / 180;
    const Δλ = (stop2.longitude - stop1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
