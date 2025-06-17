import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { DestinationCandidateService } from './DestinationCandidateService';
import { SegmentBalanceEnforcer } from './SegmentBalanceEnforcer';
import { DriveTimeConstraints } from './DriveTimeConstraints';

export class SegmentDestinationPlanner {
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Select optimal destinations for daily segments with enhanced constraints enforcement
   */
  static selectDailyDestinations(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    console.log(`🎯 SegmentDestinationPlanner: Selecting destinations for ${totalDays} days with enhanced constraints`);

    // Add null safety checks
    if (!startStop || !endStop || !allStops) {
      console.log('⚠️ Null safety check failed in selectDailyDestinations');
      return [];
    }

    // Enforce hard constraints first
    const constraintCheck = SegmentBalanceEnforcer.enforceHardConstraints(
      startStop,
      endStop,
      totalDays
    );

    if (!constraintCheck.isValid) {
      console.log(`❌ Hard constraint violation: ${constraintCheck.reason}`);
      console.log(`🔧 Using recommended ${constraintCheck.recommendedDays} days instead`);
      totalDays = constraintCheck.recommendedDays;
    }

    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total distance: ${totalDistance.toFixed(0)} miles for ${totalDays} days`);

    // Separate and prioritize destination cities
    const officialDestinations = allStops.filter(stop => 
      stop && 
      stop.category === 'destination_city' &&
      stop.id !== startStop.id &&
      stop.id !== endStop.id
    );

    const otherStops = allStops.filter(stop => 
      stop && 
      stop.category !== 'destination_city' &&
      stop.id !== startStop.id &&
      stop.id !== endStop.id
    );

    console.log(`🏙️ Found ${officialDestinations.length} official destination cities`);
    console.log(`📍 Found ${otherStops.length} other stops available`);

    const selectedDestinations: TripStop[] = [];
    let currentStop = startStop;
    const targetDailyDistance = totalDistance / totalDays;

    // Select destinations for each intermediate day with enhanced logic
    for (let day = 1; day < totalDays; day++) {
      const targetDistanceFromStart = targetDailyDistance * day;
      const targetDriveTime = targetDailyDistance / this.AVG_SPEED_MPH;
      const driveTimeTarget = DriveTimeConstraints.createTarget(targetDriveTime);
      
      console.log(`📅 Day ${day + 1}: Looking for destination around ${targetDistanceFromStart.toFixed(0)} miles (${targetDriveTime.toFixed(1)}h drive)`);

      const candidateDestination = DestinationCandidateService.selectBestDestinationForDay(
        currentStop,
        endStop,
        officialDestinations,
        otherStops,
        selectedDestinations,
        targetDistanceFromStart,
        driveTimeTarget
      );

      if (candidateDestination && candidateDestination.name) {
        selectedDestinations.push(candidateDestination);
        currentStop = candidateDestination;
        
        const actualDistance = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          candidateDestination.latitude, candidateDestination.longitude
        );
        const actualDriveTime = actualDistance / this.AVG_SPEED_MPH;
        
        console.log(`✅ Selected ${candidateDestination.name} (${candidateDestination.category}) - ${actualDistance.toFixed(0)}mi, ${actualDriveTime.toFixed(1)}h`);
      } else {
        console.log(`⚠️ No suitable destination found for day ${day + 1}, stopping destination selection`);
        break;
      }
    }

    // Validate final balance
    const violations = SegmentBalanceEnforcer.analyzeSegmentBalance(
      startStop,
      selectedDestinations,
      endStop
    );

    if (violations.length > 0) {
      console.log(`⚠️ Balance violations detected:`, violations.map(v => 
        `Day ${v.day}: ${v.type} (${v.currentValue.toFixed(1)}h)`
      ));
      
      const adjustment = SegmentBalanceEnforcer.suggestDaysAdjustment(
        totalDistance,
        totalDays,
        violations
      );
      
      if (adjustment) {
        console.log(`💡 Recommended adjustment: ${adjustment.reason}`);
      }
    }

    console.log(`🎯 Final selection: ${selectedDestinations.length} destinations for ${totalDays} days`);
    return selectedDestinations;
  }

  /**
   * Get enhanced summary of destination selection strategy
   */
  static getSelectionSummary(destinations: TripStop[]): string {
    if (!destinations || destinations.length === 0) {
      return 'No destinations selected';
    }
    
    const officialCount = destinations.filter(d => d && d.category === 'destination_city').length;
    const otherCount = destinations.length - officialCount;
    
    const summary = `Selected ${destinations.length} destinations: ${officialCount} official cities, ${otherCount} other stops`;
    
    if (officialCount > 0) {
      return `${summary} (prioritized destination cities)`;
    }
    
    return summary;
  }
}
