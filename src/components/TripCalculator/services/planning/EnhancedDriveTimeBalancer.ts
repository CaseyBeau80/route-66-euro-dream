import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeTarget } from './DriveTimeConstraints';

export interface BalancedRoute {
  destinations: TripStop[];
  totalDistance: number;
  totalDriveTime: number;
  averageDriveTime: number;
  variance: number;
  isWellBalanced: boolean;
  balancingStrategy?: string;
  segmentDetails?: Array<{
    from: string;
    to: string;
    distance: number;
    driveTime: number;
  }>;
}

export class EnhancedDriveTimeBalancer {
  private static readonly TARGET_DAILY_HOURS = 6; // Ideal daily driving time
  private static readonly MIN_DAILY_HOURS = 4;
  private static readonly MAX_DAILY_HOURS = 8;
  private static readonly MAX_VARIANCE = 1.5; // Maximum acceptable variance in hours
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Create a well-balanced route with consistent daily driving times
   */
  static createBalancedRoute(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    requestedDays: number
  ): BalancedRoute {
    console.log('🎯 Enhanced Drive Time Balancer: Creating balanced route');
    console.log(`📊 Parameters: ${startStop.name} → ${endStop.name}, ${requestedDays} days, ${availableStops.length} available stops`);

    // Calculate total distance and validate feasibility
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const totalDriveTime = totalDistance / this.AVG_SPEED_MPH;
    const targetDailyTime = totalDriveTime / requestedDays;

    console.log(`📏 Route metrics: ${totalDistance.toFixed(0)}mi total, ${totalDriveTime.toFixed(1)}h total`);
    console.log(`🎯 Target: ${targetDailyTime.toFixed(1)}h per day over ${requestedDays} days`);

    // Validate if the target is reasonable
    if (targetDailyTime < this.MIN_DAILY_HOURS) {
      console.log('⚠️ Target drive time too short, adjusting days down');
      const adjustedDays = Math.max(3, Math.ceil(totalDriveTime / this.MIN_DAILY_HOURS));
      return this.createBalancedRoute(startStop, endStop, availableStops, adjustedDays);
    }

    if (targetDailyTime > this.MAX_DAILY_HOURS) {
      console.log('⚠️ Target drive time too long, adjusting days up');
      const adjustedDays = Math.ceil(totalDriveTime / this.MAX_DAILY_HOURS);
      return this.createBalancedRoute(startStop, endStop, availableStops, adjustedDays);
    }

    // Filter to destination cities for better route planning
    const destinationCities = availableStops.filter(stop => 
      stop.category === 'destination_city'
    );

    console.log(`🏙️ Found ${destinationCities.length} destination cities for balancing`);

    // Try multiple balancing strategies in order of preference
    const strategies = [
      { name: 'Optimal Distribution', fn: () => this.balanceByOptimalDistribution(startStop, endStop, destinationCities, requestedDays) },
      { name: 'Progressive Adjustment', fn: () => this.balanceByProgressiveAdjustment(startStop, endStop, destinationCities, requestedDays) },
      { name: 'Even Spacing', fn: () => this.balanceByEvenSpacing(startStop, endStop, destinationCities, requestedDays) },
      { name: 'Intermediate Injection', fn: () => this.balanceWithIntermediateInjection(startStop, endStop, destinationCities, requestedDays) }
    ];

    let bestRoute: BalancedRoute | null = null;
    let bestVariance = Number.MAX_VALUE;

    for (const strategy of strategies) {
      console.log(`🔄 Trying strategy: ${strategy.name}`);
      try {
        const route = strategy.fn();
        if (route && route.variance < bestVariance) {
          bestRoute = route;
          bestVariance = route.variance;
          bestRoute.balancingStrategy = strategy.name;
          console.log(`✅ Better balance found with ${strategy.name}: ${route.variance.toFixed(2)}h variance`);
          
          // If we achieve excellent balance, use it
          if (route.variance <= this.MAX_VARIANCE && route.isWellBalanced) {
            console.log(`🎯 Excellent balance achieved with ${strategy.name}`);
            break;
          }
        }
      } catch (error) {
        console.warn(`⚠️ Strategy ${strategy.name} failed:`, error);
      }
    }

    if (!bestRoute) {
      console.log('⚠️ All strategies failed, creating fallback route');
      bestRoute = this.createFallbackRoute(startStop, endStop, destinationCities, requestedDays);
    }

    // Add detailed segment information for debugging
    bestRoute.segmentDetails = this.calculateSegmentDetails(startStop, bestRoute.destinations, endStop);

    console.log(`✅ Final balanced route created:`, {
      strategy: bestRoute.balancingStrategy,
      variance: bestRoute.variance,
      isWellBalanced: bestRoute.isWellBalanced,
      segments: bestRoute.segmentDetails?.map(s => `${s.from} → ${s.to}: ${s.driveTime.toFixed(1)}h`)
    });

    return bestRoute;
  }

  /**
   * NEW: Balance with intermediate destination injection for long segments
   */
  private static balanceWithIntermediateInjection(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    requestedDays: number
  ): BalancedRoute {
    console.log('🔧 Using intermediate injection strategy');
    
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const targetDailyDistance = totalDistance / requestedDays;
    const destinations: TripStop[] = [];
    let currentStop = startStop;
    let remainingDistance = totalDistance;
    const workingStops = [...availableStops];

    for (let day = 1; day < requestedDays; day++) {
      const remainingDays = requestedDays - day;
      
      // Calculate ideal position for next destination
      const progressRatio = day / requestedDays;
      const idealDistance = totalDistance * progressRatio;
      
      // Find the best stop near the ideal position
      let bestStop: TripStop | null = null;
      let bestScore = Number.MAX_VALUE;
      
      for (const stop of workingStops) {
        const distanceFromStart = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          stop.latitude, stop.longitude
        );
        
        const distanceFromCurrent = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          stop.latitude, stop.longitude
        );
        
        const distanceToEnd = DistanceCalculationService.calculateDistance(
          stop.latitude, stop.longitude,
          endStop.latitude, endStop.longitude
        );
        
        // Ensure we're making progress toward the destination
        const currentToEndDistance = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          endStop.latitude, endStop.longitude
        );
        
        if (distanceToEnd >= currentToEndDistance) continue; // Not making progress
        
        // Score based on how close to ideal position and drive time constraints
        const positionScore = Math.abs(distanceFromStart - idealDistance);
        const driveTimeScore = Math.abs(distanceFromCurrent / this.AVG_SPEED_MPH - this.TARGET_DAILY_HOURS) * 50;
        
        // Bonus for destination cities
        const cityBonus = stop.category === 'destination_city' ? -100 : 0;
        
        const totalScore = positionScore + driveTimeScore + cityBonus;
        
        if (totalScore < bestScore) {
          bestScore = totalScore;
          bestStop = stop;
        }
      }
      
      if (!bestStop) {
        console.log(`⚠️ No suitable stop found for day ${day}, breaking`);
        break;
      }
      
      destinations.push(bestStop);
      currentStop = bestStop;
      
      // Remove used stop
      const index = workingStops.findIndex(s => s.id === bestStop!.id);
      if (index > -1) workingStops.splice(index, 1);
      
      console.log(`📍 Day ${day}: Selected ${bestStop.name} (${bestStop.category})`);
    }

    return this.calculateRouteMetrics(startStop, destinations, endStop);
  }

  /**
   * IMPROVED: Balance by optimal daily distance distribution
   */
  private static balanceByOptimalDistribution(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    requestedDays: number
  ): BalancedRoute {
    console.log('📐 Using optimal distribution strategy');
    
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const targetDailyDistance = totalDistance / requestedDays;
    const destinations: TripStop[] = [];
    let currentStop = startStop;
    const workingStops = [...availableStops];

    for (let day = 1; day < requestedDays; day++) {
      const remainingDays = requestedDays - day;
      
      // Allow some flexibility in daily distance (±20%)
      const minDailyDistance = targetDailyDistance * 0.8;
      const maxDailyDistance = targetDailyDistance * 1.2;
      
      // If it's the last day before final destination, be more flexible
      const isLastIntermediateDay = remainingDays === 1;
      const finalMaxDistance = isLastIntermediateDay ? targetDailyDistance * 1.5 : maxDailyDistance;

      const nextStop = this.findOptimalStopByDistance(
        currentStop, 
        endStop,
        workingStops, 
        targetDailyDistance,
        minDailyDistance,
        finalMaxDistance
      );

      if (!nextStop) {
        console.log(`⚠️ No suitable stop found for day ${day} with optimal distribution`);
        break;
      }

      destinations.push(nextStop);
      currentStop = nextStop;

      // Remove used stop
      const index = workingStops.findIndex(s => s.id === nextStop.id);
      if (index > -1) workingStops.splice(index, 1);
      
      const dayDistance = DistanceCalculationService.calculateDistance(
        destinations.length > 1 ? destinations[destinations.length - 2].latitude : startStop.latitude,
        destinations.length > 1 ? destinations[destinations.length - 2].longitude : startStop.longitude,
        nextStop.latitude,
        nextStop.longitude
      );
      
      console.log(`📍 Day ${day}: ${nextStop.name} (${dayDistance.toFixed(0)}mi, ${(dayDistance/this.AVG_SPEED_MPH).toFixed(1)}h)`);
    }

    return this.calculateRouteMetrics(startStop, destinations, endStop);
  }

  /**
   * IMPROVED: Find optimal stop by target distance with better constraints
   */
  private static findOptimalStopByDistance(
    currentStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    targetDistance: number,
    minDistance: number,
    maxDistance: number
  ): TripStop | null {
    let bestStop: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;

    const currentToEndDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      endStop.latitude, endStop.longitude
    );

    for (const stop of availableStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      // Enforce distance constraints
      if (distance < minDistance || distance > maxDistance) {
        continue;
      }

      const distanceToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );

      // CRITICAL: Ensure geographic progression
      if (distanceToEnd >= currentToEndDistance) {
        continue; // Not making progress toward destination
      }

      // Score based on distance from target
      const distanceScore = Math.abs(distance - targetDistance);
      let score = distanceScore;

      // Massive bonus for destination cities
      if (stop.category === 'destination_city') {
        score -= 200;
      }

      // Bonus for major stops
      if (stop.is_major_stop) {
        score -= 100;
      }

      // Penalty for extreme drive times
      const driveTime = distance / this.AVG_SPEED_MPH;
      if (driveTime < this.MIN_DAILY_HOURS) {
        score += 50;
      } else if (driveTime > this.MAX_DAILY_HOURS) {
        score += 150;
      }

      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }

    return bestStop;
  }

  /**
   * Balance by progressive adjustment
   */
  private static balanceByProgressiveAdjustment(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    requestedDays: number
  ): BalancedRoute {
    // Start with even spacing, then adjust
    let route = this.balanceByEvenSpacing(startStop, endStop, availableStops, requestedDays);
    
    // Iteratively improve balance
    for (let iteration = 0; iteration < 3; iteration++) {
      route = this.adjustRouteForBalance(route, availableStops);
      if (route.variance <= this.MAX_VARIANCE) break;
    }

    return route;
  }

  /**
   * Balance by even geographical spacing
   */
  private static balanceByEvenSpacing(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    requestedDays: number
  ): BalancedRoute {
    const destinations: TripStop[] = [];
    
    // Calculate bearing from start to end
    const bearing = this.calculateBearing(startStop, endStop);
    
    // Find stops along the route path
    const routeStops = availableStops
      .map(stop => ({
        stop,
        distanceFromStart: DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          stop.latitude, stop.longitude
        ),
        routeAlignment: this.calculateRouteAlignment(startStop, endStop, stop)
      }))
      .filter(item => item.routeAlignment > 0.7) // Only stops reasonably along the route
      .sort((a, b) => a.distanceFromStart - b.distanceFromStart);

    // Select destinations with even spacing
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    for (let day = 1; day < requestedDays; day++) {
      const targetDistance = (totalDistance / requestedDays) * day;
      const candidateStop = routeStops.find(item => 
        Math.abs(item.distanceFromStart - targetDistance) < 100 && // Within 100 miles
        !destinations.find(dest => dest.id === item.stop.id)
      );

      if (candidateStop) {
        destinations.push(candidateStop.stop);
      }
    }

    return this.calculateRouteMetrics(startStop, destinations, endStop);
  }

  /**
   * Adjust route to improve balance
   */
  private static adjustRouteForBalance(
    route: BalancedRoute,
    availableStops: TripStop[]
  ): BalancedRoute {
    // Find the most unbalanced segment and try to improve it
    // This is a simplified version - could be enhanced further
    return route;
  }

  /**
   * Calculate route alignment (how well a stop aligns with the overall route direction)
   */
  private static calculateRouteAlignment(
    startStop: TripStop,
    endStop: TripStop,
    candidateStop: TripStop
  ): number {
    const totalBearing = this.calculateBearing(startStop, endStop);
    const toBearing = this.calculateBearing(startStop, candidateStop);
    const fromBearing = this.calculateBearing(candidateStop, endStop);

    // Calculate how aligned the bearings are
    const alignment1 = Math.cos((totalBearing - toBearing) * Math.PI / 180);
    const alignment2 = Math.cos((totalBearing - fromBearing) * Math.PI / 180);

    return (alignment1 + alignment2) / 2;
  }

  /**
   * Calculate bearing between two points
   */
  private static calculateBearing(from: TripStop, to: TripStop): number {
    const lat1 = from.latitude * Math.PI / 180;
    const lat2 = to.latitude * Math.PI / 180;
    const deltaLng = (to.longitude - from.longitude) * Math.PI / 180;

    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  /**
   * IMPROVED: Calculate comprehensive route metrics with enhanced validation
   */
  private static calculateRouteMetrics(
    startStop: TripStop,
    destinations: TripStop[],
    endStop: TripStop
  ): BalancedRoute {
    const allStops = [startStop, ...destinations, endStop];
    const segments: number[] = [];
    let totalDistance = 0;

    // Calculate segment distances and drive times
    for (let i = 0; i < allStops.length - 1; i++) {
      const distance = DistanceCalculationService.calculateDistance(
        allStops[i].latitude, allStops[i].longitude,
        allStops[i + 1].latitude, allStops[i + 1].longitude
      );
      segments.push(distance);
      totalDistance += distance;
    }

    const driveTimes = segments.map(distance => distance / this.AVG_SPEED_MPH);
    const totalDriveTime = driveTimes.reduce((sum, time) => sum + time, 0);
    const averageDriveTime = totalDriveTime / driveTimes.length;

    // Calculate variance
    const variance = Math.sqrt(
      driveTimes.reduce((sum, time) => sum + Math.pow(time - averageDriveTime, 2), 0) / driveTimes.length
    );

    // Enhanced balance validation
    const hasExtremeSegments = driveTimes.some(time => time > this.MAX_DAILY_HOURS || time < this.MIN_DAILY_HOURS);
    const hasReasonableVariance = variance <= this.MAX_VARIANCE;
    const hasProgressiveFlow = this.validateProgressiveFlow(allStops);

    const isWellBalanced = hasReasonableVariance && !hasExtremeSegments && hasProgressiveFlow;

    console.log(`📊 Route metrics calculated:`, {
      segments: driveTimes.map(t => `${t.toFixed(1)}h`),
      variance: variance.toFixed(2),
      hasExtremeSegments,
      hasReasonableVariance,
      hasProgressiveFlow,
      isWellBalanced
    });

    return {
      destinations,
      totalDistance,
      totalDriveTime,
      averageDriveTime,
      variance,
      isWellBalanced
    };
  }

  /**
   * NEW: Validate that the route makes progressive geographic sense
   */
  private static validateProgressiveFlow(stops: TripStop[]): boolean {
    if (stops.length < 3) return true;

    const startStop = stops[0];
    const endStop = stops[stops.length - 1];
    
    let previousDistanceToEnd = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    for (let i = 1; i < stops.length - 1; i++) {
      const currentDistanceToEnd = DistanceCalculationService.calculateDistance(
        stops[i].latitude, stops[i].longitude,
        endStop.latitude, endStop.longitude
      );

      if (currentDistanceToEnd >= previousDistanceToEnd) {
        console.log(`⚠️ Progressive flow violation at ${stops[i].name}: ${currentDistanceToEnd.toFixed(0)}mi vs ${previousDistanceToEnd.toFixed(0)}mi to end`);
        return false;
      }

      previousDistanceToEnd = currentDistanceToEnd;
    }

    return true;
  }

  /**
   * NEW: Calculate detailed segment information for debugging
   */
  private static calculateSegmentDetails(
    startStop: TripStop,
    destinations: TripStop[],
    endStop: TripStop
  ) {
    const allStops = [startStop, ...destinations, endStop];
    const segmentDetails = [];

    for (let i = 0; i < allStops.length - 1; i++) {
      const from = allStops[i];
      const to = allStops[i + 1];
      const distance = DistanceCalculationService.calculateDistance(
        from.latitude, from.longitude,
        to.latitude, to.longitude
      );
      const driveTime = distance / this.AVG_SPEED_MPH;

      segmentDetails.push({
        from: from.name,
        to: to.name,
        distance,
        driveTime
      });
    }

    return segmentDetails;
  }

  /**
   * IMPROVED: Create fallback route with better validation
   */
  private static createFallbackRoute(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    requestedDays: number
  ): BalancedRoute {
    console.log('⚠️ Creating improved fallback route with basic distance division');
    
    // Use simple even distribution as last resort
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const targetSegmentDistance = totalDistance / requestedDays;
    const destinations: TripStop[] = [];
    
    // Try to find destinations at roughly even intervals
    for (let day = 1; day < requestedDays; day++) {
      const targetDistanceFromStart = targetSegmentDistance * day;
      
      let closestStop = availableStops[0];
      let closestDistance = Number.MAX_VALUE;
      
      for (const stop of availableStops) {
        if (destinations.find(dest => dest.id === stop.id)) continue;
        
        const distanceFromStart = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          stop.latitude, stop.longitude
        );
        
        const diff = Math.abs(distanceFromStart - targetDistanceFromStart);
        if (diff < closestDistance) {
          closestDistance = diff;
          closestStop = stop;
        }
      }
      
      if (closestStop && !destinations.find(dest => dest.id === closestStop.id)) {
        destinations.push(closestStop);
      }
    }

    const result = this.calculateRouteMetrics(startStop, destinations, endStop);
    result.balancingStrategy = 'Fallback - Even Distribution';
    return result;
  }
}
