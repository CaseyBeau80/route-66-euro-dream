
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { SupabaseDataService } from '../data/SupabaseDataService';
import { StopValidationService } from './StopValidationService';
import { SegmentDestinationPlanner } from './SegmentDestinationPlanner';
import { SegmentCreationLoop } from './SegmentCreationLoop';
import { TripSegmentValidator } from './TripSegmentValidator';
import { DriveTimeBalancingService } from './DriveTimeBalancingService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';

export class HeritageCitiesPlanningService {
  /**
   * Plan a heritage cities focused Route 66 trip with enhanced validation
   */
  static async planHeritageCitiesTrip(
    startLocation: string,
    endLocation: string,
    totalDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🏛️ HERITAGE CITIES PLANNING: ${startLocation} → ${endLocation}, ${totalDays} days`);

    // Find start and end stops
    const startStop = SupabaseDataService.findBestMatchingStop(startLocation, allStops);
    const endStop = SupabaseDataService.findBestMatchingStop(endLocation, allStops);

    if (!startStop || !endStop) {
      throw new Error(`Could not find Route 66 stops for: ${!startStop ? startLocation : endLocation}`);
    }

    // Calculate total distance
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total route distance: ${totalDistance.toFixed(0)} miles`);

    // Get remaining stops (excluding start and end)
    const remainingStops = StopValidationService.validateAndDeduplicateStops(
      allStops,
      startStop,
      endStop
    );

    // Select destinations for daily segments
    const selectedDestinations = SegmentDestinationPlanner.selectDailyDestinations(
      startStop,
      endStop,
      remainingStops,
      totalDays
    );

    console.log(`🎯 Selected ${selectedDestinations.length} destinations for ${totalDays} requested days`);

    // Create drive time targets for balance
    const driveTimeTargets = DriveTimeBalancingService.createBalancedDriveTimeTargets(
      totalDistance,
      totalDays
    );

    const balanceMetrics = DriveTimeBalancingService.calculateDriveTimeBalance(
      totalDistance,
      totalDays
    );

    // Create daily segments
    const dailySegments = await SegmentCreationLoop.createDailySegments(
      startStop,
      selectedDestinations,
      endStop,
      remainingStops,
      totalDistance,
      driveTimeTargets,
      balanceMetrics
    );

    console.log(`📅 Created ${dailySegments.length} daily segments`);

    // ENHANCED VALIDATION: Check for quality issues
    const validationResult = TripSegmentValidator.validateTripSegments(dailySegments);
    
    let finalSegments = dailySegments;
    let adjustmentMessage: string | undefined;
    
    if (!validationResult.isValid && validationResult.shouldTruncate) {
      console.log(`⚠️ Trip quality issues detected - truncating to ${validationResult.optimalDays} days`);
      
      finalSegments = TripSegmentValidator.truncateSegments(dailySegments, validationResult);
      adjustmentMessage = validationResult.recommendations.join(' ');
      
      // Update total days to reflect truncation
      totalDays = validationResult.optimalDays;
    }

    // Calculate actual metrics from final segments
    const actualTotalDistance = finalSegments.reduce((sum, segment) => sum + (segment.distance || 0), 0);
    const actualTotalDriveTime = finalSegments.reduce((sum, segment) => sum + (segment.driveTimeHours || 0), 0);

    // Create trip plan
    const tripPlan: TripPlan = {
      id: `heritage-${Date.now()}`,
      title: `${startLocation} to ${endLocation} Heritage Cities Adventure`,
      description: adjustmentMessage ? `${adjustmentMessage} This ${finalSegments.length}-day journey focuses on Route 66's most significant heritage cities and landmarks.` : `A ${finalSegments.length}-day journey through Route 66's most significant heritage cities and landmarks.`,
      startCity: startLocation,
      endCity: endLocation,
      startLocation: CityDisplayService.formatCityDisplay(startStop),
      endLocation: CityDisplayService.formatCityDisplay(endStop),
      startDate: new Date(),
      totalDays: finalSegments.length,
      totalDistance: actualTotalDistance,
      totalMiles: Math.round(actualTotalDistance),
      totalDrivingTime: actualTotalDriveTime,
      segments: finalSegments,
      dailySegments: finalSegments,
      stops: [],
      tripStyle: 'destination-focused',
      lastUpdated: new Date(),
      
      // Add truncation/adjustment information
      ...(adjustmentMessage && {
        limitMessage: adjustmentMessage,
        stopsLimited: true,
        originalRequestedDays: totalDays !== finalSegments.length ? totalDays : undefined
      })
    };

    console.log(`✅ Heritage Cities trip planned: ${finalSegments.length} days, ${Math.round(actualTotalDistance)} miles, ${actualTotalDriveTime.toFixed(1)}h total drive time`);
    
    if (adjustmentMessage) {
      console.log(`📝 Trip adjustment applied: ${adjustmentMessage}`);
    }

    return tripPlan;
  }
}
