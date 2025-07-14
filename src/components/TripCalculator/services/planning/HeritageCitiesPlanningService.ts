
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
import { DirectionEnforcerService } from './DirectionEnforcerService';

export class HeritageCitiesPlanningService {
  /**
   * SIMPLIFIED: Plan a heritage cities focused Route 66 trip using ONLY destination cities
   */
  static async planHeritageCitiesTrip(
    startLocation: string,
    endLocation: string,
    requestedDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🏛️ SIMPLIFIED HERITAGE CITIES PLANNING: ${startLocation} → ${endLocation}, ${requestedDays} days`);
    console.log(`🚀 DEBUG: HeritageCitiesPlanningService.planHeritageCitiesTrip called!`);

    // Get ONLY destination cities from the database
    console.log(`🔍 Fetching destination cities from database...`);
    const destinationCities = await SupabaseDataService.getDestinationCities();
    console.log(`🏙️ Found ${destinationCities.length} destination cities available`);

    // Find start and end from destination cities
    console.log(`🔍 Finding start and end cities...`);
    console.log(`🔍 [SPRINGFIELD FIX] Input startLocation: "${startLocation}"`);
    console.log(`🔍 [SPRINGFIELD FIX] Input endLocation: "${endLocation}"`);
    
    console.log(`🔍 [SPRINGFIELD FIX] Calling findBestMatchingStop for start: "${startLocation}"`);
    const startStop = SupabaseDataService.findBestMatchingStop(startLocation, destinationCities);
    console.log(`🔍 [SPRINGFIELD FIX] Calling findBestMatchingStop for end: "${endLocation}"`);
    const endStop = SupabaseDataService.findBestMatchingStop(endLocation, destinationCities);
    console.log(`🔍 [SPRINGFIELD FIX] START STOP RESULT:`, startStop);
    console.log(`🔍 [SPRINGFIELD FIX] END STOP RESULT:`, endStop);

    if (!startStop || !endStop) {
      const error = `Could not find destination cities for: ${!startStop ? startLocation : endLocation}`;
      console.error(`❌ ${error}`);
      throw new Error(error);
    }

    console.log(`✅ [SPRINGFIELD FIX] Found start: ${startStop.name}, ${startStop.state}`);
    console.log(`✅ [SPRINGFIELD FIX] Found end: ${endStop.name}, ${endStop.state}`);

    // Filter destination cities between start and end
    const availableDestinations = this.filterDestinationCitiesAlongRoute(
      destinationCities, 
      startStop, 
      endStop
    );

    console.log(`🛣️ Found ${availableDestinations.length} destination cities along the route`);

    // FIXED: Maximum days = available destinations along route (no complex logic)
    const maxPossibleDays = availableDestinations.length + 1; // +1 for end city
    const actualDays = Math.min(requestedDays, maxPossibleDays);
    
    console.log(`🎯 SIMPLIFIED: Max possible days = ${maxPossibleDays} (${availableDestinations.length} destinations + end city)`);
    console.log(`📅 Requested: ${requestedDays} days, Actual: ${actualDays} days`);
    
    let adjustmentMessage: string | undefined;
    if (actualDays < requestedDays) {
      adjustmentMessage = `Trip adjusted from ${requestedDays} to ${actualDays} days - maximum possible with available destination cities along this route.`;
      console.log(`⚠️ ${adjustmentMessage}`);
    }

    // Select destinations for the trip
    const selectedDestinations = this.selectDestinationsForDays(
      availableDestinations,
      actualDays - 1 // -1 because last day is end city
    );

    console.log(`🎯 Selected ${selectedDestinations.length} destination cities for ${actualDays} days`);

    // Calculate total distance
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Create daily segments - SIMPLIFIED approach
    const dailySegments = await this.createSimplifiedDailySegments(
      startStop,
      selectedDestinations,
      endStop,
      totalDistance
    );

    // Calculate actual metrics from segments
    const actualTotalDistance = dailySegments.reduce((sum, segment) => sum + (segment.distance || 0), 0);
    const actualTotalDriveTime = dailySegments.reduce((sum, segment) => sum + (segment.driveTimeHours || 0), 0);

    // Create trip plan
    console.log(`🚨 [FINAL DEBUG] About to create trip plan with:`);
    console.log(`   startStop object:`, startStop);
    console.log(`   endStop object:`, endStop);
    console.log(`   startLocation param:`, startLocation);
    console.log(`   endLocation param:`, endLocation);
    console.log(`   CityDisplayService.formatCityDisplay(startStop):`, CityDisplayService.formatCityDisplay(startStop));
    console.log(`   CityDisplayService.formatCityDisplay(endStop):`, CityDisplayService.formatCityDisplay(endStop));
    
    const tripPlan: TripPlan = {
      id: `heritage-${Date.now()}`,
      title: `${startLocation} to ${endLocation} Heritage Cities Adventure`,
      description: adjustmentMessage ? 
        `${adjustmentMessage} This ${actualDays}-day journey focuses on Route 66's most significant heritage cities.` : 
        `A ${actualDays}-day journey through Route 66's most significant heritage cities.`,
      startCity: CityDisplayService.formatCityDisplay(startStop),
      endCity: CityDisplayService.formatCityDisplay(endStop),
      startLocation: CityDisplayService.formatCityDisplay(startStop),
      endLocation: CityDisplayService.formatCityDisplay(endStop),
      startDate: new Date(),
      totalDays: actualDays,
      totalDistance: actualTotalDistance,
      totalMiles: Math.round(actualTotalDistance),
      totalDrivingTime: actualTotalDriveTime,
      segments: dailySegments,
      dailySegments: dailySegments,
      stops: [],
      tripStyle: 'destination-focused',
      lastUpdated: new Date(),
      
      // Add adjustment information if applicable
      ...(adjustmentMessage && {
        limitMessage: adjustmentMessage,
        stopsLimited: true,
        originalRequestedDays: requestedDays !== actualDays ? requestedDays : undefined
      })
    };

    console.log(`🚨 [FINAL DEBUG] Created trip plan object with:`);
    console.log(`   tripPlan.startCity: "${tripPlan.startCity}"`);
    console.log(`   tripPlan.endCity: "${tripPlan.endCity}"`);
    console.log(`   tripPlan.startLocation: "${tripPlan.startLocation}"`);
    console.log(`   tripPlan.endLocation: "${tripPlan.endLocation}"`);
    console.log(`   tripPlan.title: "${tripPlan.title}"`);
    console.log(`   tripPlan.description: "${tripPlan.description}"`);

    console.log(`✅ Heritage Cities trip planned: ${actualDays} days, ${Math.round(actualTotalDistance)} miles, ${actualTotalDriveTime.toFixed(1)}h total drive time`);
    
    return tripPlan;
  }

  /**
   * Filter destination cities that are along the route between start and end
   * FIXED: Uses DirectionEnforcerService to prevent ping-ponging
   */
  private static filterDestinationCitiesAlongRoute(
    destinationCities: TripStop[],
    startStop: TripStop,
    endStop: TripStop
  ): TripStop[] {
    console.log(`🔍 FIXED: Filtering destination cities with anti-ping-pong logic`);
    console.log(`   Route: ${startStop.name}, ${startStop.state} → ${endStop.name}, ${endStop.state}`);
    
    // Exclude start and end cities
    const candidateCities = destinationCities.filter(city => 
      city.id !== startStop.id && city.id !== endStop.id
    );
    
    console.log(`🎯 Found ${candidateCities.length} candidate cities to filter`);

    // Use DirectionEnforcerService to filter for forward-progressing destinations only
    const forwardProgressingCities = DirectionEnforcerService.filterForwardDestinations(
      startStop,
      candidateCities,
      endStop,
      'moderate' // Use moderate strictness for good coverage
    );

    console.log(`✅ ANTI-PING-PONG: Filtered to ${forwardProgressingCities.length} forward-progressing cities`);
    
    // Log the selected cities for debugging
    forwardProgressingCities.forEach((city, index) => {
      const score = DirectionEnforcerService.calculateProgressionScore(startStop, city, endStop);
      console.log(`   ${index + 1}. ${city.name}, ${city.state} (score: ${score.toFixed(1)})`);
    });

    return forwardProgressingCities;
  }

  /**
   * SIMPLIFIED: Just take the first N destinations in order (no complex selection)
   */
  private static selectDestinationsForDays(
    availableDestinations: TripStop[],
    daysNeeded: number
  ): TripStop[] {
    if (daysNeeded <= 0) return [];
    
    // SIMPLE: Just take the first N destinations in geographic order
    const selectedDestinations = availableDestinations.slice(0, daysNeeded);
    
    console.log(`📍 SIMPLIFIED: Taking first ${selectedDestinations.length} destinations in order:`);
    selectedDestinations.forEach((dest, i) => {
      console.log(`   ${i + 1}. ${dest.name}, ${dest.state}`);
    });
    
    return selectedDestinations;
  }

  /**
   * Create simplified daily segments using only destination cities
   */
  private static async createSimplifiedDailySegments(
    startStop: TripStop,
    selectedDestinations: TripStop[],
    endStop: TripStop,
    totalDistance: number
  ): Promise<DailySegment[]> {
    console.log(`🛠️ Creating simplified daily segments for ${selectedDestinations.length + 1} days`);
    
    const dailySegments: DailySegment[] = [];
    let currentStop = startStop;
    
    // Create route: start -> destinations -> end
    const allStops = [startStop, ...selectedDestinations, endStop];
    
    for (let day = 1; day < allStops.length; day++) {
      const nextStop = allStops[day];
      const isLastDay = day === allStops.length - 1;
      
      // Calculate segment distance and drive time
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );
      
      const driveTimeHours = segmentDistance / 50; // Assume 50 mph average
      
      // Create simplified segment
      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${CityDisplayService.formatCityDisplay(currentStop)} to ${CityDisplayService.formatCityDisplay(nextStop)}`,
        startCity: CityDisplayService.formatCityDisplay(currentStop),
        endCity: CityDisplayService.formatCityDisplay(nextStop),
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours,
        drivingTime: driveTimeHours,
        destination: {
          city: nextStop.name,
          state: nextStop.state || 'Unknown'
        },
        recommendedStops: [], // No intermediate stops, just destination cities
        isGoogleMapsData: false,
        attractions: [],
        subStopTimings: [],
        routeSection: `${Math.round((day / allStops.length) * 100)}% of total route`,
        driveTimeCategory: {
          category: driveTimeHours <= 3 ? 'short' : driveTimeHours <= 5 ? 'optimal' : driveTimeHours <= 7 ? 'long' : 'extreme',
          message: this.getDriveTimeMessage(driveTimeHours),
          color: this.getDriveTimeColor(driveTimeHours)
        },
        dataAccuracy: 'Estimated distances using Haversine formula'
      };
      
      dailySegments.push(segment);
      currentStop = nextStop;
      
      console.log(`✅ Day ${day}: ${segment.startCity} → ${segment.endCity} (${Math.round(segmentDistance)}mi, ${driveTimeHours.toFixed(1)}h)`);
    }
    
    return dailySegments;
  }

  /**
   * Get drive time message
   */
  private static getDriveTimeMessage(hours: number): string {
    if (hours <= 3) return 'Light driving day - plenty of time for sightseeing';
    if (hours <= 5) return 'Balanced driving and exploration time';
    if (hours <= 7) return 'Long driving day - plan your stops carefully';
    return 'Very long driving day - consider breaking this segment';
  }

  /**
   * Get drive time color
   */
  private static getDriveTimeColor(hours: number): string {
    if (hours <= 3) return 'text-green-600';
    if (hours <= 5) return 'text-blue-600';
    if (hours <= 7) return 'text-orange-600';
    return 'text-red-600';
  }
}
