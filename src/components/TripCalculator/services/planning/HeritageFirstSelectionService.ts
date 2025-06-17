import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { HeritageScoringService } from './HeritageScoringService';
import { PopulationScoringService } from './PopulationScoringService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface HeritageSelectionResult {
  selectedDestination: TripStop | null;
  selectionReason: 'heritage-priority' | 'population-fallback' | 'distance-fallback' | 'no-valid-options';
  heritageScore?: number;
  heritageTier?: string;
  warnings: string[];
  isCompromise: boolean;
}

export interface HeritageSelectionConfig {
  maxDriveTimeHours: number;
  heritageWeight: 0.7; // High weight for heritage in destination-focused trips
  allowFlexibleDriveTime: boolean;
  flexibilityBufferHours: number;
  minimumHeritageScore: number;
  preferredHeritageTiers: string[];
}

export class HeritageFirstSelectionService {
  private static readonly DEFAULT_CONFIG: HeritageSelectionConfig = {
    maxDriveTimeHours: 10,
    heritageWeight: 0.7,
    allowFlexibleDriveTime: true,
    flexibilityBufferHours: 2,
    minimumHeritageScore: 60,
    preferredHeritageTiers: ['iconic', 'major', 'significant']
  };

  /**
   * Heritage-first destination selection with smart fallbacks
   */
  static selectDestinationWithHeritagePriority(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    config: Partial<HeritageSelectionConfig> = {}
  ): HeritageSelectionResult {
    const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
    const warnings: string[] = [];

    console.log(`🏛️ HERITAGE-FIRST SELECTION: ${availableStops.length} candidates, target ${driveTimeTarget.targetHours}h`);

    // Step 1: Try heritage-priority selection within drive time limits
    const heritageResult = this.attemptHeritagePrioritySelection(
      currentStop,
      availableStops,
      driveTimeTarget,
      fullConfig
    );

    if (heritageResult.selectedDestination) {
      console.log(`✅ HERITAGE SUCCESS: ${heritageResult.selectedDestination.name} (${heritageResult.heritageTier})`);
      return heritageResult;
    }

    warnings.push('No heritage cities found within optimal drive time');

    // Step 2: Try heritage selection with flexible drive time
    if (fullConfig.allowFlexibleDriveTime) {
      const flexibleTarget: DriveTimeTarget = {
        ...driveTimeTarget,
        maxHours: driveTimeTarget.maxHours + fullConfig.flexibilityBufferHours
      };

      const flexibleResult = this.attemptHeritagePrioritySelection(
        currentStop,
        availableStops,
        flexibleTarget,
        fullConfig
      );

      if (flexibleResult.selectedDestination) {
        warnings.push(`Extended drive time to ${flexibleTarget.maxHours}h for heritage city`);
        console.log(`✅ HERITAGE FLEXIBLE: ${flexibleResult.selectedDestination.name} (extended drive time)`);
        return {
          ...flexibleResult,
          warnings,
          isCompromise: true
        };
      }
    }

    // Step 3: Population-based fallback
    console.log('🔄 Heritage selection failed, trying population fallback...');
    const populationResult = this.attemptPopulationFallback(
      currentStop,
      availableStops,
      driveTimeTarget,
      fullConfig
    );

    if (populationResult.selectedDestination) {
      warnings.push('Selected major population center due to no heritage cities available');
      console.log(`✅ POPULATION FALLBACK: ${populationResult.selectedDestination.name}`);
      return {
        ...populationResult,
        warnings,
        isCompromise: true
      };
    }

    // Step 4: Distance-based final fallback
    console.log('🔄 Population fallback failed, trying distance fallback...');
    const distanceResult = this.attemptDistanceFallback(
      currentStop,
      availableStops,
      driveTimeTarget
    );

    if (distanceResult.selectedDestination) {
      warnings.push('Selected closest available destination due to no other suitable options');
      console.log(`✅ DISTANCE FALLBACK: ${distanceResult.selectedDestination.name}`);
      return {
        ...distanceResult,
        warnings,
        isCompromise: true
      };
    }

    // No valid options found
    warnings.push('No valid destinations found within any criteria');
    console.log('❌ NO VALID OPTIONS FOUND');
    return {
      selectedDestination: null,
      selectionReason: 'no-valid-options',
      warnings,
      isCompromise: true
    };
  }

  /**
   * Attempt heritage-priority selection
   */
  private static attemptHeritagePrioritySelection(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    config: HeritageSelectionConfig
  ): HeritageSelectionResult {
    // Filter to heritage cities first
    const heritageCandidates = availableStops.filter(stop => {
      const heritageScore = HeritageScoringService.calculateHeritageScore(stop);
      return heritageScore.heritageScore >= config.minimumHeritageScore &&
             config.preferredHeritageTiers.includes(heritageScore.heritageTier);
    });

    console.log(`🏛️ Found ${heritageCandidates.length} heritage candidates (min score: ${config.minimumHeritageScore})`);

    if (heritageCandidates.length === 0) {
      return {
        selectedDestination: null,
        selectionReason: 'heritage-priority',
        warnings: [],
        isCompromise: false
      };
    }

    // Score and select best heritage destination
    let bestDestination: TripStop | null = null;
    let bestScore = -1;

    for (const candidate of heritageCandidates) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        candidate.latitude, candidate.longitude
      );
      
      const driveTimeHours = distance / 50; // Assume 50 mph

      // Skip if outside drive time limits
      if (driveTimeHours < driveTimeTarget.minHours || driveTimeHours > driveTimeTarget.maxHours) {
        continue;
      }

      // Calculate heritage-weighted score
      const heritageScore = HeritageScoringService.calculateHeritageScore(candidate);
      const driveTimeScore = this.calculateDriveTimeScore(driveTimeHours, driveTimeTarget);
      
      const combinedScore = (heritageScore.heritageScore * config.heritageWeight) + 
                           (driveTimeScore * (1 - config.heritageWeight));

      console.log(`🏛️ ${candidate.name}: heritage=${heritageScore.heritageScore} (${heritageScore.heritageTier}), drive=${driveTimeHours.toFixed(1)}h, score=${combinedScore.toFixed(1)}`);

      if (combinedScore > bestScore) {
        bestScore = combinedScore;
        bestDestination = candidate;
      }
    }

    if (bestDestination) {
      const heritageScore = HeritageScoringService.calculateHeritageScore(bestDestination);
      return {
        selectedDestination: bestDestination,
        selectionReason: 'heritage-priority',
        heritageScore: heritageScore.heritageScore,
        heritageTier: heritageScore.heritageTier,
        warnings: [],
        isCompromise: false
      };
    }

    return {
      selectedDestination: null,
      selectionReason: 'heritage-priority',
      warnings: [],
      isCompromise: false
    };
  }

  /**
   * Population-based fallback selection
   */
  private static attemptPopulationFallback(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    config: HeritageSelectionConfig
  ): HeritageSelectionResult {
    const populationCandidates = PopulationScoringService.filterByPopulationThreshold(
      availableStops,
      'destination-focused',
      true
    );

    console.log(`📊 Found ${populationCandidates.length} population candidates`);

    if (populationCandidates.length === 0) {
      return {
        selectedDestination: null,
        selectionReason: 'population-fallback',
        warnings: [],
        isCompromise: false
      };
    }

    // Select best by population and drive time
    let bestDestination: TripStop | null = null;
    let bestScore = -1;

    for (const candidate of populationCandidates) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        candidate.latitude, candidate.longitude
      );
      
      const driveTimeHours = distance / 50;

      if (driveTimeHours < driveTimeTarget.minHours || driveTimeHours > driveTimeTarget.maxHours) {
        continue;
      }

      const populationScore = PopulationScoringService.calculatePopulationScore(candidate);
      const driveTimeScore = this.calculateDriveTimeScore(driveTimeHours, driveTimeTarget);
      
      const combinedScore = (populationScore.normalizedScore * 0.6) + (driveTimeScore * 0.4);

      if (combinedScore > bestScore) {
        bestScore = combinedScore;
        bestDestination = candidate;
      }
    }

    return {
      selectedDestination: bestDestination,
      selectionReason: 'population-fallback',
      warnings: [],
      isCompromise: false
    };
  }

  /**
   * Distance-based final fallback
   */
  private static attemptDistanceFallback(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget
  ): HeritageSelectionResult {
    let bestDestination: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;

    for (const candidate of availableStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        candidate.latitude, candidate.longitude
      );
      
      const driveTimeHours = distance / 50;

      if (driveTimeHours < driveTimeTarget.minHours || driveTimeHours > driveTimeTarget.maxHours) {
        continue;
      }

      const timeDiff = Math.abs(driveTimeHours - driveTimeTarget.targetHours);

      if (timeDiff < bestScore) {
        bestScore = timeDiff;
        bestDestination = candidate;
      }
    }

    return {
      selectedDestination: bestDestination,
      selectionReason: 'distance-fallback',
      warnings: [],
      isCompromise: false
    };
  }

  /**
   * Calculate drive time compatibility score
   */
  private static calculateDriveTimeScore(driveTimeHours: number, target: DriveTimeTarget): number {
    const timeDiff = Math.abs(driveTimeHours - target.targetHours);
    const tolerance = (target.maxHours - target.minHours) / 2;
    return Math.max(0, 100 - (timeDiff / tolerance) * 100);
  }
}
