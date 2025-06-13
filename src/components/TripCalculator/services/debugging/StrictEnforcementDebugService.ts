
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';
import { StrictDestinationCityEnforcer } from '../planning/StrictDestinationCityEnforcer';

export class StrictEnforcementDebugService {
  /**
   * Comprehensive debug report for strict destination city enforcement
   */
  static generateDebugReport(
    allStops: TripStop[],
    startStop: TripStop,
    endStop: TripStop,
    segments: DailySegment[],
    context: string = 'trip-planning'
  ): void {
    console.log(`\n🔍 ========== STRICT ENFORCEMENT DEBUG REPORT [${context}] ==========`);
    
    // 1. Overall stop analysis
    this.analyzeStopDistribution(allStops);
    
    // 2. Start/End stop validation
    this.validateStartEndStops(startStop, endStop);
    
    // 3. Segment analysis
    this.analyzeSegments(segments);
    
    // 4. Final validation
    this.performFinalValidation(segments);
    
    console.log(`🔍 ========== END DEBUG REPORT [${context}] ==========\n`);
  }
  
  private static analyzeStopDistribution(allStops: TripStop[]): void {
    console.log(`\n📊 STOP DISTRIBUTION ANALYSIS:`);
    console.log(`  Total stops: ${allStops.length}`);
    
    const categoryBreakdown = allStops.reduce((acc, stop) => {
      acc[stop.category] = (acc[stop.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log(`  Category breakdown:`, categoryBreakdown);
    
    const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    console.log(`  Destination cities: ${destinationCities.length} (${((destinationCities.length / allStops.length) * 100).toFixed(1)}%)`);
    console.log(`  Non-destination stops: ${allStops.length - destinationCities.length}`);
    
    console.log(`  Destination cities list:`, destinationCities.map(s => `${s.name}, ${s.state}`).join(' | '));
  }
  
  private static validateStartEndStops(startStop: TripStop, endStop: TripStop): void {
    console.log(`\n🏁 START/END STOP VALIDATION:`);
    
    const startIsDestCity = StrictDestinationCityEnforcer.isDestinationCity(startStop);
    const endIsDestCity = StrictDestinationCityEnforcer.isDestinationCity(endStop);
    
    console.log(`  Start: ${startStop.name} (${startStop.category}) - Destination City: ${startIsDestCity ? '✅' : '❌'}`);
    console.log(`  End: ${endStop.name} (${endStop.category}) - Destination City: ${endIsDestCity ? '✅' : '❌'}`);
    
    if (!startIsDestCity) {
      console.warn(`  ⚠️ WARNING: Start city is not a destination city`);
    }
    if (!endIsDestCity) {
      console.warn(`  ⚠️ WARNING: End city is not a destination city`);
    }
  }
  
  private static analyzeSegments(segments: DailySegment[]): void {
    console.log(`\n🗓️ SEGMENT ANALYSIS:`);
    console.log(`  Total segments: ${segments.length}`);
    
    segments.forEach((segment, index) => {
      console.log(`\n  📍 Day ${segment.day}: ${segment.startCity} → ${segment.endCity}`);
      console.log(`    Distance: ${segment.approximateMiles} miles`);
      console.log(`    Drive time: ${segment.driveTimeHours} hours`);
      console.log(`    Recommended stops: ${segment.recommendedStops?.length || 0}`);
      
      if (segment.recommendedStops && segment.recommendedStops.length > 0) {
        segment.recommendedStops.forEach((stop, stopIndex) => {
          const isDestCity = stop.category === 'destination_city';
          console.log(`      ${stopIndex + 1}. ${stop.name} (${stop.category}) - ${isDestCity ? '✅' : '❌'}`);
        });
      }
    });
  }
  
  private static performFinalValidation(segments: DailySegment[]): void {
    console.log(`\n✅ FINAL VALIDATION:`);
    
    const validation = StrictDestinationCityEnforcer.validateTripPlan(segments);
    
    if (validation.isValid) {
      console.log(`  🎉 VALIDATION PASSED: All stops comply with destination city requirements`);
    } else {
      console.error(`  ❌ VALIDATION FAILED: ${validation.violations.length} violations found`);
      validation.violations.forEach((violation, index) => {
        console.error(`    ${index + 1}. ${violation}`);
      });
    }
    
    // Count total stops across all segments
    const totalStops = segments.reduce((count, segment) => {
      return count + (segment.recommendedStops?.length || 0);
    }, 0);
    
    const destinationCityStops = segments.reduce((count, segment) => {
      if (!segment.recommendedStops) return count;
      return count + segment.recommendedStops.filter(stop => 
        StrictDestinationCityEnforcer.isDestinationCity({
          ...stop,
          city: stop.city || stop.city_name || 'Unknown'
        } as TripStop)
      ).length;
    }, 0);
    
    console.log(`  📊 Statistics:`);
    console.log(`    Total stops in trip: ${totalStops}`);
    console.log(`    Destination city stops: ${destinationCityStops}`);
    console.log(`    Compliance rate: ${totalStops > 0 ? ((destinationCityStops / totalStops) * 100).toFixed(1) : 100}%`);
  }
  
  /**
   * Quick validation check with logging
   */
  static quickValidationCheck(segments: DailySegment[], context: string = 'unknown'): boolean {
    const validation = StrictDestinationCityEnforcer.validateTripPlan(segments);
    
    if (validation.isValid) {
      console.log(`✅ QUICK CHECK [${context}]: All stops are destination cities`);
    } else {
      console.warn(`⚠️ QUICK CHECK [${context}]: ${validation.violations.length} violations found`);
      validation.violations.forEach(violation => console.warn(`  - ${violation}`));
    }
    
    return validation.isValid;
  }
  
  /**
   * Log stop filtering results
   */
  static logStopFiltering(
    originalStops: TripStop[],
    filteredStops: TripStop[],
    context: string = 'filtering'
  ): void {
    console.log(`🔍 STOP FILTERING [${context}]:`);
    console.log(`  Input: ${originalStops.length} stops`);
    console.log(`  Output: ${filteredStops.length} destination cities`);
    console.log(`  Filtered out: ${originalStops.length - filteredStops.length} stops`);
    
    const removed = originalStops.filter(stop => 
      !filteredStops.some(filtered => filtered.id === stop.id)
    );
    
    if (removed.length > 0) {
      console.log(`  Removed stops:`, removed.map(s => `${s.name} (${s.category})`).join(', '));
    }
  }
}
