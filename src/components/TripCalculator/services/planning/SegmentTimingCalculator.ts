
export type DriveTimeCategory = 'short' | 'optimal' | 'long' | 'extreme';

export class SegmentTimingCalculator {
  static calculateOptimalTiming(segments: any[]): any {
    console.log('⏱️ SegmentTimingCalculator: calculateOptimalTiming stub');
    return { optimizedSegments: segments };
  }

  static categorizedriveTime(driveTime: number): DriveTimeCategory {
    if (driveTime <= 3) return 'short';
    if (driveTime <= 6) return 'optimal';
    if (driveTime <= 9) return 'long';
    return 'extreme';
  }

  static getDriveTimeCategory(category: string): DriveTimeCategory {
    // Fix type conversion with proper validation
    const validCategories: DriveTimeCategory[] = ['short', 'optimal', 'long', 'extreme'];
    return validCategories.includes(category as DriveTimeCategory) 
      ? (category as DriveTimeCategory)
      : 'optimal';
  }
}
