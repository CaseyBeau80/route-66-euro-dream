
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface DriveTimeConstraints {
  optimal: { min: number; max: number };
  acceptable: { min: number; max: number };
  absolute: { min: number; max: number };
}

export interface DriveTimeTarget {
  targetHours: number;
  minHours: number;
  maxHours: number;
  isOptimal: boolean;
}

export class DriveTimeBalancingService {
  // Drive time constraints in hours
  private static readonly DRIVE_TIME_CONSTRAINTS: DriveTimeConstraints = {
    optimal: { min: 4, max: 6 },     // Sweet spot for comfortable driving
    acceptable: { min: 3, max: 7.5 }, // Acceptable range
    absolute: { min: 2.5, max: 8 }   // Hard limits
  };

  /**
   * Calculate balanced drive time targets for trip days
   */
  static calculateDriveTimeTargets(
    totalDistance: number,
    totalDays: number,
    avgSpeedMph: number = 50
  ): DriveTimeTarget[] {
    const totalDriveTimeHours = totalDistance / avgSpeedMph;
    const baseTargetHours = totalDriveTimeHours / totalDays;
    
    console.log(`🎯 Drive time balancing: ${totalDriveTimeHours.toFixed(1)}h total / ${totalDays} days = ${baseTargetHours.toFixed(1)}h average`);

    const targets: DriveTimeTarget[] = [];
    
    for (let day = 1; day <= totalDays; day++) {
      let targetHours = baseTargetHours;
      
      // Adjust for optimal range if possible
      if (baseTargetHours < this.DRIVE_TIME_CONSTRAINTS.optimal.min) {
        targetHours = this.DRIVE_TIME_CONSTRAINTS.optimal.min;
      } else if (baseTargetHours > this.DRIVE_TIME_CONSTRAINTS.optimal.max) {
        targetHours = this.DRIVE_TIME_CONSTRAINTS.optimal.max;
      }

      const isOptimal = targetHours >= this.DRIVE_TIME_CONSTRAINTS.optimal.min && 
                       targetHours <= this.DRIVE_TIME_CONSTRAINTS.optimal.max;

      targets.push({
        targetHours,
        minHours: Math.max(this.DRIVE_TIME_CONSTRAINTS.absolute.min, targetHours * 0.7),
        maxHours: Math.min(this.DRIVE_TIME_CONSTRAINTS.absolute.max, targetHours * 1.3),
        isOptimal
      });
    }

    return targets;
  }

  /**
   * Find best destination within drive time constraints
   */
  static findBestDestinationByDriveTime(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    avgSpeedMph: number = 50
  ): TripStop | null {
    if (availableStops.length === 0) return null;

    let bestStop: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;

    console.log(`🕒 Finding destination for ${driveTimeTarget.targetHours.toFixed(1)}h target (${driveTimeTarget.minHours.toFixed(1)}-${driveTimeTarget.maxHours.toFixed(1)}h range)`);

    for (const stop of availableStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );
      
      const driveTimeHours = distance / avgSpeedMph;
      
      // Skip if outside absolute constraints
      if (driveTimeHours < driveTimeTarget.minHours || driveTimeHours > driveTimeTarget.maxHours) {
        continue;
      }

      // Calculate score based on how close to target
      const timeDiff = Math.abs(driveTimeHours - driveTimeTarget.targetHours);
      let score = timeDiff;

      // Bonus for destination cities
      if (stop.category === 'destination_city') {
        score -= 1.0; // Strong preference for destination cities
      }

      // Bonus for major stops
      if (stop.is_major_stop) {
        score -= 0.5;
      }

      // Bonus for being in optimal range
      if (driveTimeHours >= this.DRIVE_TIME_CONSTRAINTS.optimal.min && 
          driveTimeHours <= this.DRIVE_TIME_CONSTRAINTS.optimal.max) {
        score -= 0.3;
      }

      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }

    if (bestStop) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        bestStop.latitude, bestStop.longitude
      );
      const actualDriveTime = distance / avgSpeedMph;
      
      console.log(`✅ Selected ${bestStop.name} (${bestStop.category}): ${Math.round(distance)}mi, ${actualDriveTime.toFixed(1)}h drive`);
    }

    return bestStop;
  }

  /**
   * Validate and adjust trip for balanced drive times
   */
  static validateDriveTimeBalance(
    segments: Array<{ distance: number; driveTimeHours: number }>,
    targets: DriveTimeTarget[]
  ): {
    isBalanced: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const target = targets[i];

      if (segment.driveTimeHours < this.DRIVE_TIME_CONSTRAINTS.absolute.min) {
        issues.push(`Day ${i + 1}: Too short (${segment.driveTimeHours.toFixed(1)}h)`);
        suggestions.push(`Consider combining Day ${i + 1} with adjacent day`);
      }

      if (segment.driveTimeHours > this.DRIVE_TIME_CONSTRAINTS.absolute.max) {
        issues.push(`Day ${i + 1}: Too long (${segment.driveTimeHours.toFixed(1)}h)`);
        suggestions.push(`Consider adding intermediate stop on Day ${i + 1}`);
      }
    }

    // Check for extreme variations
    const driveTimes = segments.map(s => s.driveTimeHours);
    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);
    
    if (maxTime - minTime > 4) {
      issues.push(`Large variation: ${minTime.toFixed(1)}h to ${maxTime.toFixed(1)}h`);
      suggestions.push('Consider redistributing stops for more balanced days');
    }

    return {
      isBalanced: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * Get drive time category for messaging
   */
  static getDriveTimeCategory(driveTimeHours: number): {
    category: 'short' | 'optimal' | 'long' | 'extreme';
    message: string;
    color: string;
  } {
    if (driveTimeHours < this.DRIVE_TIME_CONSTRAINTS.optimal.min) {
      return {
        category: 'short',
        message: 'Short driving day - great for exploring stops!',
        color: 'text-green-600'
      };
    } else if (driveTimeHours <= this.DRIVE_TIME_CONSTRAINTS.optimal.max) {
      return {
        category: 'optimal',
        message: 'Perfect driving time for a comfortable day',
        color: 'text-blue-600'
      };
    } else if (driveTimeHours <= this.DRIVE_TIME_CONSTRAINTS.absolute.max) {
      return {
        category: 'long',
        message: 'Longer driving day - plan for more rest stops',
        color: 'text-orange-600'
      };
    } else {
      return {
        category: 'extreme',
        message: 'Very long driving day - consider breaking it up',
        color: 'text-red-600'
      };
    }
  }
}
