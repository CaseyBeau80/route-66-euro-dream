
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
  unusedDays?: number; // Add this missing property
}
