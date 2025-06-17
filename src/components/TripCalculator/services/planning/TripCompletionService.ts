export interface TripCompletionAnalysis {
  isCompleted: boolean;
  originalDays: number; // Add this property
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
}
