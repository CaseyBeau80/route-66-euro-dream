
import { TripStop } from '../data/SupabaseDataService';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { DestinationPriorityService } from './DestinationPriorityService';
import { HeritageScoringService } from './HeritageScoringService';
import { EnhancedTripStyleLogic } from './EnhancedTripStyleLogic';
import { DestinationCityValidator } from './DestinationCityValidator';

export class EnhancedDestinationPriorityService extends DestinationPriorityService {
  /**
   * Enhanced destination selection with heritage-first prioritization
   */
  static selectDestinationWithHeritagePriority(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    tripStyle: 'balanced' | 'destination-focused' = 'destination-focused'
  ): TripStop | null {
    console.log(`🏛️ HERITAGE-FIRST destination selection (${tripStyle} style)`);

    const config = EnhancedTripStyleLogic.getEnhancedStyleConfig(tripStyle);

    // Step 1: Filter for destination cities first
    const destinationCities = availableStops.filter(stop => 
      stop.category === 'destination_city'
    );

    const validatedDestinationCities = DestinationCityValidator.filterValidDestinationCities(destinationCities);

    console.log(`🏙️ Found ${validatedDestinationCities.length} validated destination cities`);

    // Step 2: For destination-focused trips, prioritize heritage cities
    if (tripStyle === 'destination-focused' && validatedDestinationCities.length > 0) {
      const heritageDestination = this.selectByHeritageAndDriveTime(
        currentStop,
        validatedDestinationCities,
        driveTimeTarget,
        config
      );

      if (heritageDestination) {
        const heritageScore = HeritageScoringService.calculateHeritageScore(heritageDestination);
        console.log(`✅ Heritage-first selection: ${heritageDestination.name} (heritage: ${heritageScore.heritageScore}, tier: ${heritageScore.heritageTier})`);
        return heritageDestination;
      }
    }

    // Step 3: Fallback to enhanced filtering with heritage consideration
    const heritageFilteredStops = EnhancedTripStyleLogic.filterStopsWithHeritageAndPopulation(
      availableStops,
      config
    );

    if (heritageFilteredStops.length > 0) {
      const enhancedDestination = this.selectByHeritageAndDriveTime(
        currentStop,
        heritageFilteredStops,
        driveTimeTarget,
        config
      );

      if (enhancedDestination) {
        console.log(`✅ Enhanced heritage selection: ${enhancedDestination.name}`);
        return enhancedDestination;
      }
    }

    // Step 4: Final fallback to parent class logic
    console.warn(`⚠️ Heritage selection failed, using standard priority logic`);
    return super.selectDestinationWithPriority(
      currentStop,
      availableStops,
      driveTimeTarget,
      tripStyle
    );
  }

  /**
   * Select destination by heritage score and drive time compatibility
   */
  private static selectByHeritageAndDriveTime(
    currentStop: TripStop,
    candidateStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    config: any
  ): TripStop | null {
    if (candidateStops.length === 0) return null;

    // Score each candidate by heritage + drive time compatibility
    const scoredCandidates = candidateStops.map(stop => {
      const heritageScore = HeritageScoringService.calculateHeritageScore(stop);
      const driveTimeScore = this.calculateDriveTimeCompatibility(currentStop, stop, driveTimeTarget);
      
      // Combine scores with heritage weight
      const combinedScore = (heritageScore.heritageScore * config.heritageWeight) + 
                           (driveTimeScore * (1 - config.heritageWeight));

      return {
        stop,
        heritageScore: heritageScore.heritageScore,
        heritageTier: heritageScore.heritageTier,
        driveTimeScore,
        combinedScore
      };
    });

    // Sort by combined score (highest first)
    scoredCandidates.sort((a, b) => b.combinedScore - a.combinedScore);

    // Filter out candidates with poor drive time compatibility for strict enforcement
    const viableCandidates = config.style === 'destination-focused' && config.prioritizeHeritageOverDistance
      ? scoredCandidates.filter(candidate => candidate.driveTimeScore > 20) // Allow more flexibility for heritage
      : scoredCandidates.filter(candidate => candidate.driveTimeScore > 50); // Stricter for balanced

    if (viableCandidates.length === 0) {
      console.warn(`⚠️ No viable candidates with acceptable drive times, relaxing constraints`);
      return scoredCandidates[0]?.stop || null;
    }

    // Log top candidates for debugging
    console.log(`🎯 Top heritage-compatible candidates:`);
    viableCandidates.slice(0, 3).forEach((candidate, index) => {
      console.log(`   ${index + 1}. ${candidate.stop.name}: heritage=${candidate.heritageScore} (${candidate.heritageTier}), drive=${candidate.driveTimeScore.toFixed(1)}, combined=${candidate.combinedScore.toFixed(1)}`);
    });

    return viableCandidates[0].stop;
  }

  /**
   * Calculate drive time compatibility score (0-100)
   */
  private static calculateDriveTimeCompatibility(
    currentStop: TripStop,
    candidateStop: TripStop,
    driveTimeTarget: DriveTimeTarget,
    avgSpeedMph: number = 50
  ): number {
    const distance = this.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      candidateStop.latitude, candidateStop.longitude
    );
    
    const driveTimeHours = distance / avgSpeedMph;
    
    // Outside absolute limits = 0 score
    if (driveTimeHours < driveTimeTarget.minHours || driveTimeHours > driveTimeTarget.maxHours) {
      return 0;
    }

    // Calculate compatibility based on proximity to target
    const timeDiff = Math.abs(driveTimeHours - driveTimeTarget.targetHours);
    const tolerance = (driveTimeTarget.maxHours - driveTimeTarget.minHours) / 2;
    
    const compatibilityScore = Math.max(0, 100 - (timeDiff / tolerance) * 100);

    // Bonus for being in optimal range (3-8 hours)
    if (driveTimeHours >= 3 && driveTimeHours <= 8) {
      return Math.min(100, compatibilityScore + 15);
    }

    return compatibilityScore;
  }

  /**
   * Calculate distance between two points (haversine formula)
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3958.8; // Earth's radius in miles
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Get enhanced priority summary with heritage analysis
   */
  static getHeritageEnhancedPrioritySummary(
    selectedDestinations: TripStop[],
    tripStyle: 'balanced' | 'destination-focused'
  ): string {
    if (selectedDestinations.length === 0) {
      return 'No destinations selected';
    }

    const heritageStats = HeritageScoringService.getHeritageStatistics(selectedDestinations);
    const avgHeritage = Math.round(heritageStats.averageHeritageScore);
    
    const heritageLevel = avgHeritage >= 80 ? 'Excellent' : 
                         avgHeritage >= 60 ? 'Good' : 
                         avgHeritage >= 40 ? 'Fair' : 'Basic';

    const topTiers = Object.entries(heritageStats.tierDistribution)
      .filter(([tier, count]) => count > 0 && (tier === 'iconic' || tier === 'major'))
      .map(([tier, count]) => `${count} ${tier}`)
      .join(', ');

    return `Selected ${selectedDestinations.length} destinations with ${tripStyle} style (heritage: ${heritageLevel} - avg ${avgHeritage}/100${topTiers ? `, includes ${topTiers}` : ''})`;
  }
}
