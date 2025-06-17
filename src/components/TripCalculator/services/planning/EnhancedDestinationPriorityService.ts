import { TripStop } from '../../types/TripStop';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { DestinationPriorityService } from './DestinationPriorityService';
import { HeritageScoringService } from './HeritageScoringService';
import { EnhancedTripStyleLogic } from './EnhancedTripStyleLogic';
import { DestinationCityValidator } from './DestinationCityValidator';
import { HeritageFirstSelectionService, HeritageSelectionResult } from './HeritageFirstSelectionService';

export class EnhancedDestinationPriorityService extends DestinationPriorityService {
  /**
   * Enhanced destination selection with heritage-first prioritization and smart fallbacks
   */
  static selectDestinationWithHeritagePriority(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    tripStyle: 'balanced' | 'destination-focused' = 'destination-focused'
  ): TripStop | null {
    console.log(`🏛️ HERITAGE-FIRST destination selection (${tripStyle} style)`);

    const config = EnhancedTripStyleLogic.getEnhancedStyleConfig(tripStyle);

    // Use the new heritage-first selection service
    const heritageResult: HeritageSelectionResult = HeritageFirstSelectionService.selectDestinationWithHeritagePriority(
      currentStop,
      availableStops,
      driveTimeTarget,
      {
        maxDriveTimeHours: config.maxDailyDriveHours,
        allowFlexibleDriveTime: config.prioritizeHeritageOverDistance,
        flexibilityBufferHours: tripStyle === 'destination-focused' ? 3 : 1,
        minimumHeritageScore: tripStyle === 'destination-focused' ? 70 : 50,
        preferredHeritageTiers: tripStyle === 'destination-focused' ? 
          ['iconic', 'major', 'significant'] : 
          ['iconic', 'major', 'significant', 'notable']
      }
    );

    // Log selection details and warnings
    if (heritageResult.warnings.length > 0) {
      console.warn(`⚠️ Heritage selection warnings:`, heritageResult.warnings);
    }

    if (heritageResult.selectedDestination) {
      const reasonMap = {
        'heritage-priority': '🏛️ Heritage Priority',
        'population-fallback': '📊 Population Fallback',
        'distance-fallback': '📏 Distance Fallback',
        'no-valid-options': '❌ No Options'
      };

      const reason = reasonMap[heritageResult.selectionReason];
      const compromise = heritageResult.isCompromise ? ' (compromise)' : '';
      
      console.log(`✅ ${reason}: ${heritageResult.selectedDestination.name}${compromise}`);
      
      if (heritageResult.heritageScore && heritageResult.heritageTier) {
        console.log(`   Heritage: ${heritageResult.heritageScore}/100 (${heritageResult.heritageTier})`);
      }

      return heritageResult.selectedDestination;
    }

    // Final fallback to parent class logic if all else fails
    console.warn(`⚠️ Heritage-first selection completely failed, using standard priority logic`);
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
    // Use the parent class's calculateDistance method instead of our own
    const distance = super['calculateDistance'](
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

  /**
   * Get enhanced summary with heritage analysis and warnings
   */
  static getHeritageEnhancedPrioritySummaryWithWarnings(
    selectedDestinations: TripStop[],
    tripStyle: 'balanced' | 'destination-focused',
    selectionWarnings: string[] = []
  ): { summary: string; warnings: string[] } {
    const baseSummary = this.getHeritageEnhancedPrioritySummary(selectedDestinations, tripStyle);
    
    let enhancedSummary = baseSummary;
    const warnings: string[] = [...selectionWarnings];

    // Add heritage quality assessment
    if (selectedDestinations.length > 0) {
      const heritageStats = HeritageScoringService.getHeritageStatistics(selectedDestinations);
      
      if (heritageStats.averageHeritageScore < 60 && tripStyle === 'destination-focused') {
        warnings.push('Trip includes fewer heritage cities than optimal for destination-focused style');
      }

      const iconicCount = heritageStats.tierDistribution.iconic || 0;
      const majorCount = heritageStats.tierDistribution.major || 0;
      
      if (iconicCount === 0 && tripStyle === 'destination-focused') {
        warnings.push('No iconic heritage cities included - consider extending trip length');
      }

      if (iconicCount + majorCount < Math.ceil(selectedDestinations.length * 0.5) && tripStyle === 'destination-focused') {
        warnings.push('Less than 50% of destinations are major heritage cities');
      }
    }

    return {
      summary: enhancedSummary,
      warnings
    };
  }
}
