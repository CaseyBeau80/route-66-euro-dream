
import { TripStop } from '../../types/TripStop';
import { SupabaseDataService } from './SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class DatabaseAuditService {
  /**
   * Audit stops between two locations to identify data gaps
   */
  static async auditStopsBetweenLocations(
    startCity: string,
    endCity: string,
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Promise<{
    totalStops: number;
    categoryBreakdown: Record<string, number>;
    geographicDistribution: TripStop[];
    missingCategories: string[];
    recommendations: string[];
  }> {
    console.log(`📊 DATABASE AUDIT: ${startCity} → ${endCity}`);
    
    const allStops = await SupabaseDataService.fetchAllStops();
    const segmentDistance = DistanceCalculationService.calculateDistance(startLat, startLng, endLat, endLng);
    
    // Find stops within reasonable distance of the route
    const routeStops = allStops.filter(stop => {
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startLat, startLng, stop.latitude, stop.longitude
      );
      const distanceFromEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude, endLat, endLng
      );
      
      // More generous geographic filtering for audit
      const totalViaStop = distanceFromStart + distanceFromEnd;
      const detourFactor = totalViaStop / segmentDistance;
      
      return detourFactor <= 2.0 && distanceFromStart <= segmentDistance * 1.5;
    });
    
    // Category breakdown
    const categoryBreakdown = routeStops.reduce((acc, stop) => {
      acc[stop.category] = (acc[stop.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Identify missing categories
    const expectedCategories = ['attraction', 'hidden_gem', 'diner', 'motel', 'museum', 'destination_city'];
    const missingCategories = expectedCategories.filter(cat => !categoryBreakdown[cat]);
    
    // Generate recommendations
    const recommendations = [];
    if (routeStops.length < 3) {
      recommendations.push('Very few stops found - consider expanding geographic search radius');
    }
    if (missingCategories.length > 0) {
      recommendations.push(`Missing categories: ${missingCategories.join(', ')}`);
    }
    if (!categoryBreakdown.attraction) {
      recommendations.push('No attractions found - check database content for this region');
    }
    
    console.log(`📊 AUDIT RESULTS:`, {
      segment: `${startCity} → ${endCity}`,
      totalStops: routeStops.length,
      categoryBreakdown,
      missingCategories,
      recommendations
    });
    
    return {
      totalStops: routeStops.length,
      categoryBreakdown,
      geographicDistribution: routeStops,
      missingCategories,
      recommendations
    };
  }
}
