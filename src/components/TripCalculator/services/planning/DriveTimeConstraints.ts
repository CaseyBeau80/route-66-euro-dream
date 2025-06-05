
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

export class DriveTimeConstraints {
  // Drive time constraints in hours
  static readonly CONSTRAINTS: DriveTimeConstraints = {
    optimal: { min: 4, max: 6 },     // Sweet spot for comfortable driving
    acceptable: { min: 3, max: 7.5 }, // Acceptable range
    absolute: { min: 2.5, max: 8 }   // Hard limits
  };

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

      if (segment.driveTimeHours < this.CONSTRAINTS.absolute.min) {
        issues.push(`Day ${i + 1}: Too short (${segment.driveTimeHours.toFixed(1)}h)`);
        suggestions.push(`Consider combining Day ${i + 1} with adjacent day`);
      }

      if (segment.driveTimeHours > this.CONSTRAINTS.absolute.max) {
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
}
