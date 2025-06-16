
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { SegmentDestinationPlanner } from './SegmentDestinationPlanner';
import { TripPlan } from './TripPlanBuilder';
import { EnhancedDriveTimeBalancer } from './EnhancedDriveTimeBalancer';
import { BalancedSegmentCreator } from './components/BalancedSegmentCreator';
import { DriveTimeBalanceCalculator } from './components/DriveTimeBalanceCalculator';

export class BalancedTripPlanningService {
  /**
   * Create a balanced trip plan with even drive time distribution
   */
  static createBalancedPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): TripPlan {
    console.log(`⚖️ Creating balanced trip plan: ${inputStartCity} → ${inputEndCity} in ${requestedDays} days`);

    // Calculate total distance
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total distance: ${totalDistance.toFixed(0)} miles`);

    // Use enhanced drive time balancer for optimal planning
    const balanceAnalysis = EnhancedDriveTimeBalancer.analyzeAndBalance(
      startStop,
      endStop,
      allStops,
      requestedDays
    );

    const optimalDays = balanceAnalysis.recommendedDays;
    const wasAdjusted = optimalDays !== requestedDays;

    console.log(`📅 Days: requested ${requestedDays}, optimal ${optimalDays}, adjusted: ${wasAdjusted}`);
    console.log(`⚖️ Balance quality: ${balanceAnalysis.isBalanced ? 'Balanced' : 'Needs attention'}, max drive: ${balanceAnalysis.maxDriveTime.toFixed(1)}h`);

    // Use SegmentDestinationPlanner with the balanced number of days
    const destinations = SegmentDestinationPlanner.selectDailyDestinations(
      startStop,
      endStop,
      allStops,
      optimalDays
    );

    console.log(`🎯 ${SegmentDestinationPlanner.getSelectionSummary(destinations)}`);

    // Create daily segments with enhanced balance validation
    const segments = BalancedSegmentCreator.createBalancedDailySegments(
      startStop,
      endStop,
      destinations,
      allStops,
      optimalDays
    );

    // Enhanced drive time balance metrics
    const driveTimeBalance = DriveTimeBalanceCalculator.calculateBalancedDriveTimeBalance(segments, balanceAnalysis);

    // Calculate total metrics
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    const tripPlan: TripPlan = {
      id: `balanced-trip-${Math.random().toString(36).substring(2, 9)}`,
      title: `${inputStartCity} to ${inputEndCity} Balanced Route`,
      startCity: inputStartCity,
      endCity: inputEndCity,
      startDate: new Date(),
      totalDays: optimalDays,
      originalDays: wasAdjusted ? requestedDays : undefined,
      totalDistance: Math.round(totalDistance),
      totalMiles: Math.round(totalDistance),
      totalDrivingTime: parseFloat(totalDrivingTime.toFixed(1)),
      segments,
      dailySegments: segments,
      driveTimeBalance,
      tripStyle: 'balanced'
    };

    console.log(`✅ Balanced trip plan: ${optimalDays} days, ${Math.round(totalDistance)}mi, ${totalDrivingTime.toFixed(1)}h`);
    return tripPlan;
  }
}
