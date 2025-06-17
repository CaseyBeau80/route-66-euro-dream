import { TripPlan, DailySegment } from './TripPlanTypes';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { TripStop } from '../../types/TripStop';

export interface HeritageValidationResult {
  isValid: boolean;
  heritageQuality: 'excellent' | 'good' | 'fair' | 'poor';
  highHeritageCitiesIncluded: number;
  totalHeritageCities: number;
  averageHeritageScore: number;
  missingHighHeritageCities: string[];
  driveTimeBalance: 'excellent' | 'good' | 'poor';
  recommendations: string[];
}

export class HeritageValidationService {
  private static readonly HIGH_HERITAGE_THRESHOLD = 85;

  /**
   * Validate heritage inclusion and trip balance for destination-focused trips
   */
  static validateHeritageTrip(
    tripPlan: TripPlan,
    allAvailableStops: TripStop[]
  ): HeritageValidationResult {
    console.log('🔍 Validating heritage trip quality...');

    // Extract destinations from trip plan
    const destinations = this.extractDestinationsFromPlan(tripPlan);
    
    // Calculate heritage statistics
    const heritageStats = this.calculateHeritageStats(destinations);
    
    // Find missing high-heritage cities
    const missingHighHeritage = this.findMissingHighHeritageCities(
      destinations,
      allAvailableStops,
      tripPlan.startCity,
      tripPlan.endCity
    );

    // Analyze drive time balance
    const driveTimeBalance = this.analyzeDriveTimeBalance(tripPlan);

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      heritageStats,
      missingHighHeritage,
      driveTimeBalance
    );

    // Determine overall quality
    const heritageQuality = this.determineHeritageQuality(heritageStats);
    const isValid = heritageQuality !== 'poor' && driveTimeBalance !== 'poor';

    console.log(`✅ Heritage validation complete: ${heritageQuality} quality, ${heritageStats.highHeritageCities} high-heritage cities`);

    return {
      isValid,
      heritageQuality,
      highHeritageCitiesIncluded: heritageStats.highHeritageCities,
      totalHeritageCities: heritageStats.totalCities,
      averageHeritageScore: heritageStats.averageScore,
      missingHighHeritageCities: missingHighHeritage,
      driveTimeBalance,
      recommendations
    };
  }

  /**
   * Extract destinations from trip plan segments
   */
  private static extractDestinationsFromPlan(tripPlan: TripPlan): TripStop[] {
    const destinations: TripStop[] = [];
    
    for (const segment of tripPlan.segments) {
      if (segment.recommendedStops && segment.recommendedStops.length > 0) {
        // Convert recommended stops back to TripStop format
        const stop: TripStop = {
          id: segment.recommendedStops[0].id,
          name: segment.recommendedStops[0].name,
          description: segment.recommendedStops[0].description || '',
          latitude: segment.recommendedStops[0].latitude,
          longitude: segment.recommendedStops[0].longitude,
          category: segment.recommendedStops[0].category,
          city_name: segment.recommendedStops[0].city_name,
          state: segment.recommendedStops[0].state,
          city: segment.recommendedStops[0].city || segment.recommendedStops[0].city_name || 'Unknown'
        };
        destinations.push(stop);
      }
    }
    
    return destinations;
  }

  /**
   * Calculate heritage statistics for destinations
   */
  private static calculateHeritageStats(destinations: TripStop[]) {
    const heritageScores = destinations.map(dest => 
      HeritageScoringService.calculateHeritageScore(dest)
    );

    const totalCities = destinations.length;
    const highHeritageCities = heritageScores.filter(h => 
      h.heritageScore >= this.HIGH_HERITAGE_THRESHOLD
    ).length;
    
    const averageScore = heritageScores.length > 0 
      ? heritageScores.reduce((sum, h) => sum + h.heritageScore, 0) / heritageScores.length
      : 0;

    return {
      totalCities,
      highHeritageCities,
      averageScore
    };
  }

  /**
   * Find high-heritage cities that should have been included but weren't
   */
  private static findMissingHighHeritageCities(
    includedDestinations: TripStop[],
    allAvailableStops: TripStop[],
    startLocation: string,
    endLocation: string
  ): string[] {
    const includedIds = new Set(includedDestinations.map(dest => dest.id));
    
    const missingHighHeritage: string[] = [];
    
    for (const stop of allAvailableStops) {
      if (includedIds.has(stop.id)) continue;
      
      // Skip start/end locations
      if (stop.name.toLowerCase().includes(startLocation.toLowerCase()) ||
          stop.name.toLowerCase().includes(endLocation.toLowerCase())) {
        continue;
      }
      
      const heritage = HeritageScoringService.calculateHeritageScore(stop);
      
      if (heritage.heritageScore >= this.HIGH_HERITAGE_THRESHOLD) {
        missingHighHeritage.push(`${stop.name}, ${stop.state} (${heritage.heritageScore}/100)`);
      }
    }
    
    return missingHighHeritage;
  }

  /**
   * Analyze drive time balance across segments
   */
  private static analyzeDriveTimeBalance(tripPlan: TripPlan): 'excellent' | 'good' | 'poor' {
    const driveTimes = tripPlan.segments.map(seg => seg.driveTimeHours);
    
    if (driveTimes.length === 0) return 'poor';
    
    const maxTime = Math.max(...driveTimes);
    const minTime = Math.min(...driveTimes);
    const avgTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    
    // Check balance criteria
    const imbalanceRatio = maxTime / avgTime;
    const finalDayIsLongest = driveTimes[driveTimes.length - 1] === maxTime;
    
    if (imbalanceRatio <= 1.3 && !finalDayIsLongest) {
      return 'excellent';
    } else if (imbalanceRatio <= 1.6 && maxTime <= 9) {
      return 'good';
    } else {
      return 'poor';
    }
  }

  /**
   * Generate recommendations based on validation results
   */
  private static generateRecommendations(
    heritageStats: any,
    missingHighHeritage: string[],
    driveTimeBalance: string
  ): string[] {
    const recommendations: string[] = [];
    
    if (heritageStats.highHeritageCities === 0) {
      recommendations.push('Consider extending trip length to include high-heritage cities like Tulsa or Oklahoma City');
    } else if (heritageStats.highHeritageCities < 2) {
      recommendations.push('Trip could benefit from including more high-heritage destinations');
    }
    
    if (missingHighHeritage.length > 0) {
      recommendations.push(`Consider including: ${missingHighHeritage.slice(0, 2).join(', ')}`);
    }
    
    if (driveTimeBalance === 'poor') {
      recommendations.push('Consider rebalancing daily drive times or adding an extra day');
    }
    
    if (heritageStats.averageScore < 60) {
      recommendations.push('Focus on including more destination cities with higher heritage scores');
    }
    
    return recommendations;
  }

  /**
   * Determine overall heritage quality level
   */
  private static determineHeritageQuality(heritageStats: any): 'excellent' | 'good' | 'fair' | 'poor' {
    const { highHeritageCities, averageScore } = heritageStats;
    
    if (highHeritageCities >= 2 && averageScore >= 80) {
      return 'excellent';
    } else if (highHeritageCities >= 1 && averageScore >= 70) {
      return 'good';
    } else if (averageScore >= 60) {
      return 'fair';
    } else {
      return 'poor';
    }
  }
}
