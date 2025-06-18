
export type DriveTimeCategory = 'short' | 'optimal' | 'long' | 'extreme';

export class DynamicRebalancingService {
  static rebalanceSegments(segments: any[], config: any): any {
    console.log('🔄 DynamicRebalancingService: rebalanceSegments stub');
    return { rebalancedSegments: segments, warnings: [] };
  }

  static getDriveTimeCategory(category: string): DriveTimeCategory {
    // Fix type conversion with proper validation
    const validCategories: DriveTimeCategory[] = ['short', 'optimal', 'long', 'extreme'];
    return validCategories.includes(category as DriveTimeCategory) 
      ? (category as DriveTimeCategory)
      : 'optimal';
  }
}
