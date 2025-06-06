
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { DriveTimeConstraints, DriveTimeTarget } from './DriveTimeConstraints';
import { DestinationOptimizationService } from './DestinationOptimizationService';
import { SegmentStopCurator } from './SegmentStopCurator';
import { DestinationCityValidator } from './DestinationCityValidator';
import { DriveTimeBalancer } from './DriveTimeBalancer';

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

    // Calculate optimal trip duration and drive time distribution
    const durationAnalysis = DriveTimeBalancer.suggestOptimalTripDuration(
      startStop,
      endStop,
      requestedDays
    );

    const actualDays = durationAnalysis.suggestedDays;
    const wasAdjusted = actualDays !== requestedDays;
    const distribution = durationAnalysis.distribution;

    if (wasAdjusted) {
      console.log(`⚖️ Trip duration adjusted from ${requestedDays} to ${actualDays} days: ${durationAnalysis.reason}`);
    }

    // Filter stops to only include valid destination cities and relevant stops
    const validDestinationCities = DestinationCityValidator.filterValidDestinationCities(allStops);
    const relevantStops = allStops.filter(stop => 
      stop.id !== startStop.id && 
      stop.id !== endStop.id &&
      (validDestinationCities.find(city => city.id === stop.id) || 
       stop.category === 'route66_waypoint' ||
       stop.category === 'attraction' ||
       stop.category === 'hidden_gem')
    );

    console.log(`🎯 Using ${validDestinationCities.length} validated destination cities and ${relevantStops.length} total relevant stops`);

    const segments: DailySegment[] = [];
    let currentStop = startStop;
    const remainingStops = [...relevantStops];

    // Build daily segments using the optimized distribution
    for (let day = 1; day <= actualDays; day++) {
      const driveTimeTarget = distribution.dailyTargets[day - 1];
      const remainingDays = actualDays - day;

      console.log(`\n📅 Planning Day ${day} with target ${driveTimeTarget.targetHours.toFixed(1)}h drive`);

      let dayDestination: TripStop;
      
      if (remainingDays === 0) {
        dayDestination = endStop;
        console.log(`🏁 Final day - going to ${CityDisplayService.getCityDisplayName(endStop)}`);
      } else {
        dayDestination = DestinationOptimizationService.selectNextDayDestination(
          currentStop,
          endStop,
          remainingStops,
          remainingDays,
          driveTimeTarget
        );
        
        // Remove selected destination from remaining stops
        const destIndex = remainingStops.findIndex(stop => stop.id === dayDestination.id);
        if (destIndex > -1) {
          remainingStops.splice(destIndex, 1);
        }
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
        routeSection: day <= Math.ceil(actualDays / 3) ? 'Early Route' : 
                     day <= Math.ceil(2 * actualDays / 3) ? 'Mid Route' : 'Final Stretch'
      };

      segments.push(segment);
      currentStop = dayDestination;

      console.log(`✅ Day ${day}: ${segment.startCity} → ${segment.endCity} (${Math.round(segmentDistance)}mi, ${driveTimeHours.toFixed(1)}h, ${segmentStops.length} stops)`);
    }

    // Calculate total metrics
    const totalDistance = segments.reduce((sum, seg) => sum + (seg.distance || 0), 0);
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    const tripPlan: TripPlan = {
      title: `${inputStartCity} to ${inputEndCity} Road Trip`,
      startCity: inputStartCity,
      endCity: inputEndCity,
      totalDays: actualDays,
      originalDays: wasAdjusted ? requestedDays : undefined,
      totalDistance: Math.round(totalDistance),
      totalMiles: Math.round(totalDistance),
      totalDrivingTime: parseFloat(totalDrivingTime.toFixed(1)),
      segments,
      dailySegments: segments,
      wasAdjusted,
      driveTimeBalance: {
        isBalanced: distribution.isBalanced,
        averageDriveTime: distribution.averageDriveTime,
        reason: wasAdjusted ? durationAnalysis.reason : undefined,
        balanceQuality: distribution.isBalanced ? 'excellent' : 'fair'
      }
    };

    console.log(`🎯 Trip plan completed:`, {
      totalDays: actualDays,
      totalDistance: Math.round(totalDistance),
      totalDrivingTime: totalDrivingTime.toFixed(1),
      wasAdjusted,
      isBalanced: distribution.isBalanced
    });

    return tripPlan;
  }
}
