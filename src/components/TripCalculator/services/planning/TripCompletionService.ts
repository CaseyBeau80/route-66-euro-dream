
import { TripStop } from '../data/SupabaseDataService';
import { DailySegment } from './TripPlanBuilder';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface TripCompletionAnalysis {
  isCompleted: boolean;
  completedOnDay: number;
  totalUsefulDays: number;
  unusedDays: number;
  duplicateSegments: number[];
  redistributionSuggestion?: {
    canRedistribute: boolean;
    recommendedApproach: 'trim' | 'redistribute' | 'extend-stops';
    message: string;
  };
}

export class TripCompletionService {
  /**
   * Analyze if a trip has been completed early and detect issues
   */
  static analyzeTripCompletion(
    segments: DailySegment[],
    requestedDays: number,
    availableDestinations: TripStop[]
  ): TripCompletionAnalysis {
    console.log(`🔍 COMPLETION ANALYSIS: Analyzing ${segments.length} segments for ${requestedDays} requested days`);
    
    // Find duplicate/zero-progress segments
    const duplicateSegments: number[] = [];
    let lastValidDay = 0;
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isZeroProgress = segment.distance < 1 || segment.driveTimeHours < 0.1;
      const isDuplicate = segment.startCity === segment.endCity;
      
      if (isZeroProgress || isDuplicate) {
        duplicateSegments.push(segment.day);
        console.log(`❌ DUPLICATE/ZERO SEGMENT: Day ${segment.day} - ${segment.startCity} → ${segment.endCity} (${segment.distance}mi, ${segment.driveTimeHours}h)`);
      } else {
        lastValidDay = segment.day;
      }
    }
    
    // Determine if trip is effectively completed
    const isCompleted = duplicateSegments.length > 0 || lastValidDay < segments.length;
    const completedOnDay = lastValidDay || segments.length;
    const unusedDays = Math.max(0, requestedDays - completedOnDay);
    
    console.log(`📊 COMPLETION STATUS: ${isCompleted ? 'COMPLETED EARLY' : 'NORMAL'} on day ${completedOnDay}, ${unusedDays} unused days`);
    
    // Determine redistribution strategy
    const redistributionSuggestion = this.determineRedistributionStrategy(
      segments,
      completedOnDay,
      unusedDays,
      duplicateSegments.length,
      availableDestinations
    );
    
    return {
      isCompleted,
      completedOnDay,
      totalUsefulDays: completedOnDay,
      unusedDays,
      duplicateSegments,
      redistributionSuggestion
    };
  }

  /**
   * Remove duplicate and zero-progress segments from the trip
   */
  static cleanupSegments(segments: DailySegment[]): DailySegment[] {
    console.log(`🧹 CLEANUP: Starting with ${segments.length} segments`);
    
    const cleanedSegments = segments.filter((segment, index) => {
      const isValid = this.isValidSegment(segment);
      
      if (!isValid) {
        console.log(`🗑️ REMOVING: Day ${segment.day} - ${segment.startCity} → ${segment.endCity} (${segment.distance}mi)`);
      }
      
      return isValid;
    });
    
    // Renumber days to be consecutive
    const renumberedSegments = cleanedSegments.map((segment, index) => ({
      ...segment,
      day: index + 1,
      title: segment.title.replace(/Day \d+/, `Day ${index + 1}`)
    }));
    
    console.log(`✅ CLEANUP COMPLETE: ${renumberedSegments.length} valid segments remain`);
    return renumberedSegments;
  }

  /**
   * Check if a segment represents valid progression
   */
  private static isValidSegment(segment: DailySegment): boolean {
    // Must have meaningful distance (at least 5 miles)
    const hasDistance = segment.distance >= 5;
    
    // Must have different start and end cities
    const hasDifferentCities = segment.startCity !== segment.endCity;
    
    // Must have some drive time (at least 10 minutes)
    const hasDriveTime = segment.driveTimeHours >= 0.15;
    
    const isValid = hasDistance && hasDifferentCities && hasDriveTime;
    
    if (!isValid) {
      console.log(`❌ INVALID SEGMENT: ${segment.startCity} → ${segment.endCity} - Distance: ${segment.distance}mi, Time: ${segment.driveTimeHours}h, Same city: ${!hasDifferentCities}`);
    }
    
    return isValid;
  }

  /**
   * Determine the best strategy for handling unused days
   */
  private static determineRedistributionStrategy(
    segments: DailySegment[],
    completedOnDay: number,
    unusedDays: number,
    duplicateCount: number,
    availableDestinations: TripStop[]
  ) {
    if (unusedDays === 0 && duplicateCount === 0) {
      return {
        canRedistribute: false,
        recommendedApproach: 'trim' as const,
        message: 'Trip is optimally planned with no unused days'
      };
    }

    if (duplicateCount > 2 || unusedDays > 3) {
      return {
        canRedistribute: true,
        recommendedApproach: 'trim' as const,
        message: `Route completed in ${completedOnDay} days. ${unusedDays} unused days have been removed to avoid duplicate stops.`
      };
    }

    if (unusedDays <= 2 && segments.length >= 3) {
      return {
        canRedistribute: true,
        recommendedApproach: 'redistribute' as const,
        message: `${unusedDays} extra days redistributed as extended stops for better sightseeing opportunities.`
      };
    }

    return {
      canRedistribute: true,
      recommendedApproach: 'extend-stops' as const,
      message: `Trip optimized to ${completedOnDay} days with enhanced stop experiences.`
    };
  }

  /**
   * Create a user-friendly completion message
   */
  static createCompletionMessage(analysis: TripCompletionAnalysis): string {
    if (!analysis.isCompleted) {
      return '';
    }

    const { totalUsefulDays, unusedDays, redistributionSuggestion } = analysis;
    
    if (redistributionSuggestion) {
      return redistributionSuggestion.message;
    }

    return `Your Route 66 journey has been optimized to ${totalUsefulDays} days. ${unusedDays > 0 ? `${unusedDays} unused days were removed to ensure meaningful daily progression.` : ''}`;
  }
}
