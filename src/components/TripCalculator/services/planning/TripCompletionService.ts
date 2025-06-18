
import { TripPlan } from './TripPlanTypes';

export interface TripCompletionAnalysis {
  isComplete: boolean;
  isCompleted: boolean; // Alias for backward compatibility
  completionPercentage: number;
  missingElements: string[];
  recommendations: string[];
  
  // Additional properties expected by components
  confidence: number;
  duplicateSegments: any[];
  totalUsefulDays: number;
  unusedDays: number;
  originalDays: number;
  optimizedDays: number;
  adjustmentReason?: string;
  
  // Quality metrics
  qualityMetrics: {
    driveTimeBalance: 'excellent' | 'good' | 'fair' | 'poor';
    routeEfficiency: 'excellent' | 'good' | 'fair' | 'poor';
    attractionCoverage: 'excellent' | 'good' | 'fair' | 'poor';
    overallScore: number;
  };
}

export class TripCompletionService {
  static analyzeTripCompletion(tripPlan: TripPlan): TripCompletionAnalysis {
    const missingElements: string[] = [];
    const recommendations: string[] = [];

    if (!tripPlan.segments || tripPlan.segments.length === 0) {
      missingElements.push('segments');
    }

    if (!tripPlan.startLocation) {
      missingElements.push('startLocation');
    }

    if (!tripPlan.endLocation) {
      missingElements.push('endLocation');
    }

    const completionPercentage = Math.max(0, 100 - (missingElements.length * 25));
    const isComplete = missingElements.length === 0;

    // Calculate quality metrics
    const driveTimeBalance = this.analyzeDriveTimeBalance(tripPlan);
    const routeEfficiency = this.analyzeRouteEfficiency(tripPlan);
    const attractionCoverage = this.analyzeAttractionCoverage(tripPlan);
    const overallScore = (
      this.getQualityScore(driveTimeBalance) +
      this.getQualityScore(routeEfficiency) +
      this.getQualityScore(attractionCoverage)
    ) / 3;

    // Calculate useful days and optimization metrics
    const totalUsefulDays = tripPlan.segments?.length || tripPlan.totalDays || 1;
    const originalDays = tripPlan.totalDays || totalUsefulDays;
    const unusedDays = Math.max(0, originalDays - totalUsefulDays);

    return {
      isComplete,
      isCompleted: isComplete, // Alias
      completionPercentage,
      missingElements,
      recommendations,
      confidence: overallScore,
      duplicateSegments: [], // Placeholder - would need actual duplicate detection logic
      totalUsefulDays,
      unusedDays,
      originalDays,
      optimizedDays: totalUsefulDays,
      adjustmentReason: unusedDays > 0 ? 'Removed duplicate or unnecessary segments' : undefined,
      qualityMetrics: {
        driveTimeBalance,
        routeEfficiency,
        attractionCoverage,
        overallScore
      }
    };
  }

  private static analyzeDriveTimeBalance(tripPlan: TripPlan): 'excellent' | 'good' | 'fair' | 'poor' {
    if (!tripPlan.segments || tripPlan.segments.length === 0) return 'poor';
    
    const driveTimes = tripPlan.segments.map(s => s.driveTimeHours || 0);
    const maxTime = Math.max(...driveTimes);
    const minTime = Math.min(...driveTimes);
    const avgTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    
    if (maxTime - minTime <= 2 && maxTime <= 8) return 'excellent';
    if (maxTime - minTime <= 3 && maxTime <= 10) return 'good';
    if (maxTime <= 12) return 'fair';
    return 'poor';
  }

  private static analyzeRouteEfficiency(tripPlan: TripPlan): 'excellent' | 'good' | 'fair' | 'poor' {
    if (!tripPlan.totalDistance || tripPlan.totalDistance === 0) return 'poor';
    
    // Simple efficiency based on distance per day
    const avgDistancePerDay = tripPlan.totalDistance / (tripPlan.totalDays || 1);
    
    if (avgDistancePerDay >= 200 && avgDistancePerDay <= 400) return 'excellent';
    if (avgDistancePerDay >= 150 && avgDistancePerDay <= 500) return 'good';
    if (avgDistancePerDay >= 100 && avgDistancePerDay <= 600) return 'fair';
    return 'poor';
  }

  private static analyzeAttractionCoverage(tripPlan: TripPlan): 'excellent' | 'good' | 'fair' | 'poor' {
    if (!tripPlan.segments) return 'poor';
    
    const segmentsWithAttractions = tripPlan.segments.filter(s => 
      s.attractions && s.attractions.length > 0
    ).length;
    
    const coverage = segmentsWithAttractions / tripPlan.segments.length;
    
    if (coverage >= 0.8) return 'excellent';
    if (coverage >= 0.6) return 'good';
    if (coverage >= 0.4) return 'fair';
    return 'poor';
  }

  private static getQualityScore(quality: 'excellent' | 'good' | 'fair' | 'poor'): number {
    switch (quality) {
      case 'excellent': return 1.0;
      case 'good': return 0.8;
      case 'fair': return 0.6;
      case 'poor': return 0.4;
      default: return 0.5;
    }
  }
}
