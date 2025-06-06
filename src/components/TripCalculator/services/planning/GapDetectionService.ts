
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface RouteGap {
  startCity: string;
  endCity: string;
  distance: number;
  driveTime: number;
  severity: 'moderate' | 'high' | 'extreme';
  recommendation: string;
}

export class GapDetectionService {
  private static readonly MODERATE_THRESHOLD = 6; // hours
  private static readonly HIGH_THRESHOLD = 8; // hours
  private static readonly EXTREME_THRESHOLD = 10; // hours
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Detect gaps between consecutive destination cities
   */
  static detectRouteGaps(destinations: TripStop[]): RouteGap[] {
    const gaps: RouteGap[] = [];

    for (let i = 0; i < destinations.length - 1; i++) {
      const currentStop = destinations[i];
      const nextStop = destinations[i + 1];

      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );

      const driveTime = distance / this.AVG_SPEED_MPH;

      if (driveTime >= this.MODERATE_THRESHOLD) {
        const gap: RouteGap = {
          startCity: currentStop.name,
          endCity: nextStop.name,
          distance: Math.round(distance),
          driveTime: parseFloat(driveTime.toFixed(1)),
          severity: this.getSeverity(driveTime),
          recommendation: this.getRecommendation(driveTime, currentStop.name, nextStop.name)
        };

        gaps.push(gap);
      }
    }

    return gaps;
  }

  /**
   * Get severity level based on drive time
   */
  private static getSeverity(driveTime: number): 'moderate' | 'high' | 'extreme' {
    if (driveTime >= this.EXTREME_THRESHOLD) return 'extreme';
    if (driveTime >= this.HIGH_THRESHOLD) return 'high';
    return 'moderate';
  }

  /**
   * Get recommendation based on drive time and cities
   */
  private static getRecommendation(driveTime: number, startCity: string, endCity: string): string {
    if (driveTime >= this.EXTREME_THRESHOLD) {
      return `Consider breaking this ${driveTime.toFixed(1)}-hour drive into multiple days or adding an intermediate stop`;
    }
    
    if (driveTime >= this.HIGH_THRESHOLD) {
      return `Long driving day (${driveTime.toFixed(1)} hours). Plan for early start and minimal stops`;
    }
    
    return `Moderate driving day (${driveTime.toFixed(1)} hours). Allow extra time for attractions`;
  }

  /**
   * Generate user-friendly gap warnings
   */
  static generateGapWarnings(gaps: RouteGap[]): string[] {
    const warnings: string[] = [];

    gaps.forEach(gap => {
      switch (gap.severity) {
        case 'extreme':
          warnings.push(`⚠️ Very long drive from ${gap.startCity} to ${gap.endCity} (${gap.driveTime}h, ${gap.distance}mi). ${gap.recommendation}`);
          break;
        case 'high':
          warnings.push(`⚠️ Long drive from ${gap.startCity} to ${gap.endCity} (${gap.driveTime}h, ${gap.distance}mi). ${gap.recommendation}`);
          break;
        case 'moderate':
          warnings.push(`ℹ️ Moderate drive from ${gap.startCity} to ${gap.endCity} (${gap.driveTime}h, ${gap.distance}mi). ${gap.recommendation}`);
          break;
      }
    });

    return warnings;
  }

  /**
   * Check if gaps make the trip impractical
   */
  static isRouteImpractical(gaps: RouteGap[]): boolean {
    const extremeGaps = gaps.filter(gap => gap.severity === 'extreme');
    const highGaps = gaps.filter(gap => gap.severity === 'high');
    
    // More than 1 extreme gap or more than 2 high gaps makes it impractical
    return extremeGaps.length > 1 || highGaps.length > 2;
  }

  /**
   * Get overall route assessment
   */
  static getRouteAssessment(gaps: RouteGap[]): {
    isRecommended: boolean;
    summary: string;
    totalLongDrives: number;
  } {
    const extremeCount = gaps.filter(g => g.severity === 'extreme').length;
    const highCount = gaps.filter(g => g.severity === 'high').length;
    const totalLongDrives = extremeCount + highCount;

    let isRecommended = true;
    let summary = 'Route has good pacing between destination cities';

    if (extremeCount > 1) {
      isRecommended = false;
      summary = 'Route has multiple very long driving days - consider adding more days or switching to Balanced mode';
    } else if (extremeCount > 0 || highCount > 2) {
      isRecommended = false;
      summary = 'Route has challenging driving days - consider additional planning for long drives';
    } else if (totalLongDrives > 0) {
      summary = 'Route has some longer driving days but remains manageable';
    }

    return {
      isRecommended,
      summary,
      totalLongDrives
    };
  }
}
