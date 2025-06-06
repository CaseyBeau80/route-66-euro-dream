import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { DriveTimeConstraints, DriveTimeTarget } from './DriveTimeConstraints';
import { DriveTimeConstraintsService } from './DriveTimeConstraintsService';
import { DestinationOptimizationService } from './DestinationOptimizationService';
import { SegmentStopCurator } from './SegmentStopCurator';
import { DestinationCityValidator } from './DestinationCityValidator';
import { DriveTimeBalancer } from './DriveTimeBalancer';
import { EnhancedDriveTimeBalancer } from './EnhancedDriveTimeBalancer';

export interface SubStopTiming {
  fromStop: TripStop;
  toStop: TripStop;
  distanceMiles: number;
  driveTimeHours: number;
}

export interface DailySegment {
  day: number;
  title?: string;
  startCity: string;
  endCity: string;
  distance?: number;
  approximateMiles: number;
  driveTimeHours: number;
  destination?: TripStop;
  recommendedStops?: TripStop[];
  attractions?: string[];
  driveTimeCategory?: {
    category: 'short' | 'optimal' | 'long' | 'extreme';
    message: string;
    color?: string;
  };
  curatedStops?: {
    attractions: TripStop[];
    waypoints: TripStop[];
    hiddenGems: TripStop[];
  };
  subStopTimings?: SubStopTiming[];
  routeSection?: string;
  drivingTime?: number;
}

export interface TripPlan {
  title: string;
  startCity: string;
  endCity: string;
  startCityImage?: string;
  endCityImage?: string;
  totalDays: number;
  originalDays?: number;
  totalDistance: number;
  totalMiles?: number; // Alias for totalDistance
  totalDrivingTime: number;
  segments: DailySegment[];
  dailySegments?: DailySegment[]; // Alias for segments
  wasAdjusted?: boolean;
  driveTimeBalance?: {
    isBalanced: boolean;
    averageDriveTime: number;
    reason?: string;
    balanceQuality?: 'excellent' | 'good' | 'fair' | 'poor';
    driveTimeRange?: { min: number; max: number };
    qualityGrade?: 'A' | 'B' | 'C' | 'D' | 'F';
    overallScore?: number;
    variance?: number;
    suggestions?: string[];
  };
}

export interface SegmentTiming {
  targetHours: number;
  minHours: number;
  maxHours: number;
  category: 'short' | 'optimal' | 'long' | 'extreme';
}

export class TripPlanBuilder {
  static buildTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): TripPlan {
    console.log(`🗺️ Building trip plan from ${CityDisplayService.getCityDisplayName(startStop)} to ${CityDisplayService.getCityDisplayName(endStop)} in ${requestedDays} days`);

    // Calculate total distance and validate feasibility
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Get day adjustment suggestions
    const dayAdjustment = DriveTimeConstraintsService.suggestDayAdjustments(
      totalDistance,
      requestedDays
    );

    console.log(`📊 Day adjustment analysis:`, dayAdjustment);

    // Use suggested days if significantly different
    const adjustedDays = dayAdjustment.suggestedDays !== requestedDays ? 
      dayAdjustment.suggestedDays : requestedDays;

    // Use enhanced drive time balancer for better route distribution
    const balancedRoute = EnhancedDriveTimeBalancer.createBalancedRoute(
      startStop,
      endStop,
      allStops,
      adjustedDays
    );

    console.log(`⚖️ Enhanced balancing result: ${balancedRoute.isWellBalanced ? 'WELL BALANCED' : 'NEEDS IMPROVEMENT'}`);
    console.log(`📊 Balancer details: strategy=${balancedRoute.balancingStrategy}, variance=${balancedRoute.variance.toFixed(2)}h`);

    // Determine if we should use balanced results or fallback
    let selectedDestinations: TripStop[];
    let finalDays = adjustedDays;
    
    if (balancedRoute.isWellBalanced && balancedRoute.destinations.length > 0) {
      selectedDestinations = balancedRoute.destinations;
      finalDays = balancedRoute.destinations.length + 1;
      console.log(`✅ Using enhanced balanced route with ${selectedDestinations.length} destinations`);
    } else {
      console.log('⚠️ Enhanced balancer did not produce satisfactory results, using improved fallback');
      selectedDestinations = this.improvedFallbackLogic(startStop, endStop, allStops, adjustedDays);
      finalDays = selectedDestinations.length + 1;
    }

    const wasAdjusted = finalDays !== requestedDays;

    if (wasAdjusted) {
      console.log(`⚖️ Trip duration adjusted from ${requestedDays} to ${finalDays} days for better balance`);
    }

    // Filter stops to only include valid destination cities and relevant stops
    const validDestinationCities = DestinationCityValidator.filterValidDestinationCities(allStops);
    const relevantStops = allStops.filter(stop => 
      stop.id !== startStop.id && 
      stop.id !== endStop.id &&
      !selectedDestinations.find(dest => dest.id === stop.id) &&
      (validDestinationCities.find(city => city.id === stop.id) || 
       stop.category === 'route66_waypoint' ||
       stop.category === 'attraction' ||
       stop.category === 'hidden_gem')
    );

    console.log(`🎯 Using ${selectedDestinations.length} destinations and ${relevantStops.length} remaining stops`);

    const segments: DailySegment[] = [];
    let currentStop = startStop;
    const remainingStops = allStops.filter(stop => 
      stop.id !== startStop.id && 
      stop.id !== endStop.id &&
      !selectedDestinations.find(dest => dest.id === stop.id)
    );

    // Build daily segments using the selected destinations
    for (let day = 1; day <= finalDays; day++) {
      const remainingDays = finalDays - day;

      console.log(`\n📅 Planning Day ${day}`);

      let dayDestination: TripStop;
      
      if (remainingDays === 0) {
        dayDestination = endStop;
        console.log(`🏁 Final day - going to ${CityDisplayService.getCityDisplayName(endStop)}`);
      } else {
        dayDestination = selectedDestinations[day - 1];
        console.log(`🎯 Going to destination: ${CityDisplayService.getCityDisplayName(dayDestination)}`);
      }

      // Calculate segment metrics
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );
      const driveTimeHours = segmentDistance / 50; // 50 mph average

      // Determine drive time category
      const driveTimeCategory = DriveTimeConstraints.categorizeSegment({
        targetHours: driveTimeHours,
        minHours: driveTimeHours,
        maxHours: driveTimeHours,
        category: DriveTimeConstraints.getDriveTimeCategory(driveTimeHours)
      });

      // Add color to drive time category
      if (driveTimeCategory) {
        const colorMap = {
          short: 'text-green-800',
          optimal: 'text-blue-800',
          long: 'text-orange-800',
          extreme: 'text-red-800'
        };
        driveTimeCategory.color = colorMap[driveTimeCategory.category] || 'text-gray-800';
      }

      // Curate stops for this segment
      const { segmentStops, curatedSelection } = SegmentStopCurator.curateStopsForSegment(
        currentStop,
        dayDestination,
        remainingStops
      );

      // Remove used stops from remaining stops
      SegmentStopCurator.removeUsedStops(remainingStops, segmentStops);

      // Create sub-stop timings
      const subStopTimings: SubStopTiming[] = [];
      if (segmentStops.length > 0) {
        let prevStop = currentStop;
        for (const stop of segmentStops) {
          const distance = DistanceCalculationService.calculateDistance(
            prevStop.latitude, prevStop.longitude,
            stop.latitude, stop.longitude
          );
          subStopTimings.push({
            fromStop: prevStop,
            toStop: stop,
            distanceMiles: distance,
            driveTimeHours: distance / 50
          });
          prevStop = stop;
        }
        // Final segment to destination
        const finalDistance = DistanceCalculationService.calculateDistance(
          prevStop.latitude, prevStop.longitude,
          dayDestination.latitude, dayDestination.longitude
        );
        subStopTimings.push({
          fromStop: prevStop,
          toStop: dayDestination,
          distanceMiles: finalDistance,
          driveTimeHours: finalDistance / 50
        });
      }

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(dayDestination)}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(dayDestination),
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
        drivingTime: parseFloat(driveTimeHours.toFixed(1)),
        destination: dayDestination,
        recommendedStops: segmentStops,
        attractions: segmentStops.map(stop => stop.name),
        driveTimeCategory,
        curatedStops: curatedSelection,
        subStopTimings,
        routeSection: day <= Math.ceil(finalDays / 3) ? 'Early Route' : 
                     day <= Math.ceil(2 * finalDays / 3) ? 'Mid Route' : 'Final Stretch'
      };

      segments.push(segment);
      currentStop = dayDestination;

      console.log(`✅ Day ${day}: ${segment.startCity} → ${segment.endCity} (${Math.round(segmentDistance)}mi, ${driveTimeHours.toFixed(1)}h, ${segmentStops.length} stops)`);
    }

    // Validate the final trip balance
    const balanceValidation = DriveTimeConstraintsService.validateTripBalance(segments);

    // Calculate total metrics from segments
    const actualTotalDistance = segments.reduce((sum, seg) => sum + (seg.distance || 0), 0);
    const actualTotalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    // Enhanced drive time balance analysis
    const driveTimes = segments.map(seg => seg.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const variance = Math.sqrt(
      driveTimes.reduce((sum, time) => sum + Math.pow(time - averageDriveTime, 2), 0) / driveTimes.length
    );

    const isBalanced = balanceValidation.isValid;
    const balanceQuality = balanceValidation.overallGrade === 'A' ? 'excellent' :
                          balanceValidation.overallGrade === 'B' ? 'good' :
                          balanceValidation.overallGrade === 'C' ? 'fair' : 'poor';

    const tripPlan: TripPlan = {
      title: `${inputStartCity} to ${inputEndCity} Road Trip`,
      startCity: inputStartCity,
      endCity: inputEndCity,
      totalDays: finalDays,
      originalDays: wasAdjusted ? requestedDays : undefined,
      totalDistance: Math.round(actualTotalDistance),
      totalMiles: Math.round(actualTotalDistance),
      totalDrivingTime: parseFloat(actualTotalDrivingTime.toFixed(1)),
      segments,
      dailySegments: segments,
      wasAdjusted,
      driveTimeBalance: {
        isBalanced,
        averageDriveTime: parseFloat(averageDriveTime.toFixed(1)),
        reason: wasAdjusted ? `Balanced drive times (${variance.toFixed(1)}h variance, grade ${balanceValidation.overallGrade})` : undefined,
        balanceQuality,
        variance: parseFloat(variance.toFixed(1)),
        driveTimeRange: {
          min: Math.min(...driveTimes),
          max: Math.max(...driveTimes)
        },
        qualityGrade: balanceValidation.overallGrade,
        overallScore: balanceValidation.balanceScore,
        suggestions: balanceValidation.suggestions
      }
    };

    console.log(`🎯 Enhanced trip plan completed:`, {
      totalDays: finalDays,
      totalDistance: Math.round(actualTotalDistance),
      totalDrivingTime: actualTotalDrivingTime.toFixed(1),
      wasAdjusted,
      isBalanced,
      variance: variance.toFixed(1),
      balanceQuality,
      qualityGrade: balanceValidation.overallGrade,
      balanceScore: balanceValidation.balanceScore.toFixed(1),
      segmentDriveTimes: driveTimes.map(t => `${t.toFixed(1)}h`)
    });

    return tripPlan;
  }

  /**
   * IMPROVED: Enhanced fallback logic with better destination selection
   */
  private static improvedFallbackLogic(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number
  ): TripStop[] {
    console.log('🔄 Using improved fallback destination selection logic');
    
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const validDestinationCities = DestinationCityValidator.filterValidDestinationCities(allStops);
    const destinations: TripStop[] = [];
    let currentStop = startStop;

    // Use distance-based selection with geographic validation
    for (let day = 1; day < requestedDays; day++) {
      const remainingDays = requestedDays - day;
      const targetSegmentDistance = (totalDistance * 0.8) / requestedDays; // Target slightly less than total/days
      
      // Filter candidates that haven't been used and make geographic progress
      const availableCandidates = validDestinationCities.filter(stop => {
        if (destinations.find(dest => dest.id === stop.id)) return false;
        
        const distanceToEnd = DistanceCalculationService.calculateDistance(
          stop.latitude, stop.longitude,
          endStop.latitude, endStop.longitude
        );
        
        const currentToEndDistance = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          endStop.latitude, endStop.longitude
        );
        
        return distanceToEnd < currentToEndDistance; // Ensure progress toward destination
      });

      if (availableCandidates.length === 0) {
        console.log(`⚠️ No valid candidates for day ${day}, ending destination selection`);
        break;
      }

      // Find best candidate based on target distance and drive time
      let bestCandidate = availableCandidates[0];
      let bestScore = Number.MAX_VALUE;

      for (const candidate of availableCandidates) {
        const distance = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          candidate.latitude, candidate.longitude
        );
        
        const driveTime = distance / 50;
        
        // Score based on target distance and drive time constraints
        const distanceScore = Math.abs(distance - targetSegmentDistance);
        const driveTimeScore = Math.abs(driveTime - 6) * 20; // Prefer ~6 hour drives
        
        // Bonus for destination cities
        const categoryBonus = candidate.category === 'destination_city' ? -100 : 0;
        
        const totalScore = distanceScore + driveTimeScore + categoryBonus;
        
        if (totalScore < bestScore) {
          bestScore = totalScore;
          bestCandidate = candidate;
        }
      }

      destinations.push(bestCandidate);
      currentStop = bestCandidate;
      
      console.log(`📍 Fallback Day ${day}: Selected ${bestCandidate.name} (${bestCandidate.category})`);
    }

    return destinations;
  }

  /**
   * DEPRECATED: Keep for compatibility but prefer improved fallback
   */
  private static fallbackToOriginalLogic(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number
  ): TripStop[] {
    console.log('⚠️ Using deprecated original destination selection logic');
    return this.improvedFallbackLogic(startStop, endStop, allStops, requestedDays);
  }
}
