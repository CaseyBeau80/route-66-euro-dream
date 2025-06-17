
export interface TripCompletionAnalysis {
  isCompleted: boolean;
  originalDays: number;
  optimizedDays: number;
  adjustmentReason?: string;
  confidence: number;
  qualityMetrics: {
    driveTimeBalance: 'excellent' | 'good' | 'fair' | 'poor';
    routeEfficiency: 'excellent' | 'good' | 'fair' | 'poor';
    attractionCoverage: 'excellent' | 'good' | 'fair' | 'poor';
    overallScore: number;
  };
  recommendations?: string[];
  duplicateSegments?: any[];
  totalUsefulDays?: number;
  unusedDays?: number;
}

export class TripCompletionService {
  static analyzeTripCompletion(
    originalDays: number,
    optimizedDays: number,
    segments: any[]
  ): TripCompletionAnalysis {
    const isCompleted = optimizedDays > 0 && segments.length > 0;
    
    return {
      isCompleted,
      originalDays,
      optimizedDays,
      adjustmentReason: originalDays !== optimizedDays ? 'Route optimization' : undefined,
      confidence: 0.85,
      qualityMetrics: {
        driveTimeBalance: 'good',
        routeEfficiency: 'excellent',
        attractionCoverage: 'good',
        overallScore: 0.8
      },
      recommendations: [
        'Consider adding rest stops for longer driving segments',
        'Check local attractions at each destination'
      ],
      totalUsefulDays: optimizedDays,
      unusedDays: Math.max(0, originalDays - optimizedDays)
    };
  }
}
