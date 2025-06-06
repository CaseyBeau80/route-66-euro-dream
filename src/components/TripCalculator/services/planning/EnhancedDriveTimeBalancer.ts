
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
    console.log('🎯 Creating balanced route with consistent drive times');

    // Calculate total distance and ideal distribution
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const totalDriveTime = totalDistance / this.AVG_SPEED_MPH;
    const targetDailyTime = totalDriveTime / requestedDays;

    console.log(`📊 Route analysis: ${totalDistance.toFixed(0)}mi total, ${totalDriveTime.toFixed(1)}h total drive time`);
    console.log(`🎯 Target: ${targetDailyTime.toFixed(1)}h per day over ${requestedDays} days`);

    // Filter to destination cities for better route planning
    const destinationCities = availableStops.filter(stop => 
      stop.category === 'destination_city'
    );

    // Try multiple balancing strategies
    const strategies = [
      () => this.balanceByOptimalDistribution(startStop, endStop, destinationCities, requestedDays),
      () => this.balanceByProgressiveAdjustment(startStop, endStop, destinationCities, requestedDays),
      () => this.balanceByEvenSpacing(startStop, endStop, destinationCities, requestedDays)
    ];

    let bestRoute: BalancedRoute | null = null;
    let bestVariance = Number.MAX_VALUE;

    for (let i = 0; i < strategies.length; i++) {
      console.log(`🔄 Trying balancing strategy ${i + 1}/3`);
      try {
        const route = strategies[i]();
        if (route && route.variance < bestVariance) {
          bestRoute = route;
          bestVariance = route.variance;
          console.log(`✅ Better balance found: ${route.variance.toFixed(2)}h variance`);
          
          // If we achieve good balance, use it
          if (route.variance <= this.MAX_VARIANCE) {
            console.log(`🎯 Excellent balance achieved with strategy ${i + 1}`);
            break;
          }
        }
      } catch (error) {
        console.warn(`⚠️ Strategy ${i + 1} failed:`, error);
      }
    }

    return bestRoute || this.createFallbackRoute(startStop, endStop, destinationCities, requestedDays);
  }

  /**
   * Balance by optimal daily distance distribution
   */
  private static balanceByOptimalDistribution(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    requestedDays: number
  ): BalancedRoute {
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
      const targetDistance = Math.min(
        targetDailyDistance * 1.1, // Allow 10% variance
        remainingDistance * 0.75 // Don't use more than 75% of remaining distance
      );

      const nextStop = this.findOptimalStopByDistance(
        currentStop, 
        workingStops, 
        targetDistance
      );

      if (!nextStop) break;

      destinations.push(nextStop);
      currentStop = nextStop;

      // Update remaining distance
      const usedDistance = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        currentStop.latitude, currentStop.longitude
      );
      remainingDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        endStop.latitude, endStop.longitude
      );

      // Remove used stop
      const index = workingStops.findIndex(s => s.id === nextStop.id);
      if (index > -1) workingStops.splice(index, 1);
    }

    return this.calculateRouteMetrics(startStop, destinations, endStop);
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
   * Find optimal stop by target distance
   */
  private static findOptimalStopByDistance(
    currentStop: TripStop,
    availableStops: TripStop[],
    targetDistance: number
  ): TripStop | null {
    let bestStop: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;

    for (const stop of availableStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      // Score based on distance from target
      const distanceScore = Math.abs(distance - targetDistance);
      let score = distanceScore;

      // Bonus for destination cities
      if (stop.category === 'destination_city') {
        score -= 50;
      }

      // Penalty for very short or very long distances
      const driveTime = distance / this.AVG_SPEED_MPH;
      if (driveTime < this.MIN_DAILY_HOURS) {
        score += 100;
      } else if (driveTime > this.MAX_DAILY_HOURS) {
        score += 200;
      }

      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }

    return bestStop;
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
   * Calculate comprehensive route metrics
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

    const isWellBalanced = variance <= this.MAX_VARIANCE &&
                          driveTimes.every(time => time >= this.MIN_DAILY_HOURS && time <= this.MAX_DAILY_HOURS);

    console.log(`📊 Route metrics: ${driveTimes.map(t => t.toFixed(1)).join('h, ')}h drive times`);
    console.log(`📊 Variance: ${variance.toFixed(2)}h, Well balanced: ${isWellBalanced}`);

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
   * Create fallback route if balancing fails
   */
  private static createFallbackRoute(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    requestedDays: number
  ): BalancedRoute {
    console.log('⚠️ Creating fallback route with basic distance division');
    
    // Simple distance-based selection as fallback
    const destinations = availableStops
      .filter(stop => stop.category === 'destination_city')
      .slice(0, requestedDays - 1);

    return this.calculateRouteMetrics(startStop, destinations, endStop);
  }
}
