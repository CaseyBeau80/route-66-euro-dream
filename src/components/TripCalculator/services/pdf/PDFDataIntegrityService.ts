
import { TripPlan } from '../planning/TripPlanBuilder';
import { TripPlanDataValidator } from '../planning/TripPlanDataValidator';

export interface DataIntegrityReport {
  isValid: boolean;
  issues: string[];
  warnings: string[];
  enrichmentStatus: {
    hasWeatherData: boolean;
    hasStopsData: boolean;
    completenessPercentage: number;
  };
  recommendations: string[];
}

export class PDFDataIntegrityService {
  static generateIntegrityReport(tripPlan: TripPlan): DataIntegrityReport {
    console.log('🔍 Generating data integrity report for PDF export');
    
    const validation = TripPlanDataValidator.validateTripPlan(tripPlan);
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    // Check weather data completeness
    const segmentsWithWeather = tripPlan.segments?.filter(s => s.weather || s.weatherData) || [];
    const weatherCompleteness = tripPlan.segments?.length > 0 ? 
      (segmentsWithWeather.length / tripPlan.segments.length) * 100 : 0;
    
    // Check stops data completeness
    const segmentsWithStops = tripPlan.segments?.filter(s => 
      s.recommendedStops && s.recommendedStops.length > 0
    ) || [];
    const stopsCompleteness = tripPlan.segments?.length > 0 ? 
      (segmentsWithStops.length / tripPlan.segments.length) * 100 : 0;
    
    const overallCompleteness = Math.round((weatherCompleteness + stopsCompleteness) / 2);
    
    // Generate warnings
    if (weatherCompleteness < 50) {
      warnings.push(`Limited weather data available (${Math.round(weatherCompleteness)}% of segments)`);
      recommendations.push('Consider re-generating the trip plan to fetch current weather data');
    }
    
    if (stopsCompleteness < 30) {
      warnings.push(`Few recommended stops found (${Math.round(stopsCompleteness)}% of segments have stops)`);
      recommendations.push('Some segments may show limited attraction information');
    }
    
    if (!tripPlan.isEnriched) {
      warnings.push('Trip plan has not been enriched with additional data');
      recommendations.push('Run the trip calculator again to enrich the plan with current information');
    }
    
    // Check for potential data issues
    const segmentsWithIssues = tripPlan.segments?.filter(s => 
      isNaN(s.distance) || isNaN(s.driveTimeHours) || s.distance <= 0 || s.driveTimeHours <= 0
    ) || [];
    
    if (segmentsWithIssues.length > 0) {
      warnings.push(`${segmentsWithIssues.length} segments have data quality issues`);
      recommendations.push('Some driving distances or times may be estimates');
    }
    
    console.log('📊 Data integrity report completed:', {
      isValid: validation.isValid,
      issuesCount: validation.issues.length,
      warningsCount: warnings.length,
      weatherCompleteness: Math.round(weatherCompleteness),
      stopsCompleteness: Math.round(stopsCompleteness),
      overallCompleteness
    });
    
    return {
      isValid: validation.isValid,
      issues: validation.issues,
      warnings,
      enrichmentStatus: {
        hasWeatherData: weatherCompleteness > 0,
        hasStopsData: stopsCompleteness > 0,
        completenessPercentage: overallCompleteness
      },
      recommendations
    };
  }
  
  static shouldShowDataQualityNotice(report: DataIntegrityReport): boolean {
    return report.warnings.length > 0 || report.enrichmentStatus.completenessPercentage < 60;
  }
  
  static generateDataQualityMessage(report: DataIntegrityReport): string {
    if (report.enrichmentStatus.completenessPercentage >= 80) {
      return '✅ High quality data - Your trip plan includes comprehensive information';
    } else if (report.enrichmentStatus.completenessPercentage >= 50) {
      return '⚠️ Good data quality - Some information may be limited or estimated';
    } else {
      return '📋 Basic data - Trip plan shows core route information with limited details';
    }
  }
}
