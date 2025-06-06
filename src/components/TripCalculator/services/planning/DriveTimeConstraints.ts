
export interface DriveTimeConstraints {
  optimal: { min: number; max: number };
  acceptable: { min: number; max: number };
  absolute: { min: number; max: number };
  short: { min: number; max: number };
  long: { min: number; max: number };
  extreme: { min: number; max: number };
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
    absolute: { min: 2.5, max: 8 },   // Hard limits
    short: { min: 2.5, max: 4 },      // Short driving days
    long: { min: 6, max: 8 },         // Long driving days
    extreme: { min: 8, max: 10 }      // Extreme driving days
  };

  /**
   * Get drive time category based on hours
   */
  static getDriveTimeCategory(hours: number): 'short' | 'optimal' | 'long' | 'extreme' {
    const constraints = this.CONSTRAINTS;
    
    if (hours <= constraints.short.max) return 'short';
    if (hours <= constraints.optimal.max) return 'optimal';
    if (hours <= constraints.long.max) return 'long';
    return 'extreme';
  }

  /**
   * Categorize a segment based on timing
   */
  static categorizeSegment(timing: {
    targetHours: number;
    minHours: number;
    maxHours: number;
    category: 'short' | 'optimal' | 'long' | 'extreme';
  }): {
    category: 'short' | 'optimal' | 'long' | 'extreme';
    message: string;
    color?: string;
  } {
    const messages = {
      short: 'A quick and easy driving day with plenty of time for stops',
      optimal: 'Perfect balance of driving time and sightseeing opportunities',
      long: 'A substantial driving day but still manageable',
      extreme: 'An intensive driving day - consider breaking it up'
    };

    return {
      category: timing.category,
      message: messages[timing.category],
      color: this.getCategoryColor(timing.category)
    };
  }

  /**
   * Get color for drive time category
   */
  private static getCategoryColor(category: 'short' | 'optimal' | 'long' | 'extreme'): string {
    const colorMap = {
      short: 'text-green-800',
      optimal: 'text-blue-800',
      long: 'text-orange-800',
      extreme: 'text-red-800'
    };
    return colorMap[category];
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
