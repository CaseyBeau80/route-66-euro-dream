
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface SubStopTiming {
  stop: TripStop;
  distanceFromStart: number;
  cumulativeDriveTime: number;
  estimatedArrival: string;
  recommendedStayDuration: number;
}

export class SubStopTimingCalculator {
  /**
   * Calculate valid sub-stop timings for a segment
   */
  static calculateValidSubStopTimings(
    startStop: TripStop,
    endStop: TripStop,
    stops: TripStop[]
  ): SubStopTiming[] {
    if (stops.length === 0) return [];

    const timings: SubStopTiming[] = [];
    let cumulativeDistance = 0;
    let cumulativeDriveTime = 0;
    let currentStop = startStop;

    // Add each stop along the route
    for (const stop of stops) {
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );
      
      const segmentDriveTime = segmentDistance / 50; // 50 mph average
      cumulativeDistance += segmentDistance;
      cumulativeDriveTime += segmentDriveTime;

      // Calculate estimated arrival time (starting at 8 AM)
      const startHour = 8;
      const arrivalHour = startHour + cumulativeDriveTime;
      const estimatedArrival = this.formatTime(arrivalHour);

      // Determine recommended stay duration based on stop type
      const stayDuration = this.calculateStayDuration(stop);

      timings.push({
        stop,
        distanceFromStart: cumulativeDistance,
        cumulativeDriveTime,
        estimatedArrival,
        recommendedStayDuration: stayDuration
      });

      currentStop = stop;
    }

    return timings;
  }

  /**
   * Calculate total drive time including sub-stops
   */
  static calculateTotalDriveTime(subStopTimings: SubStopTiming[]): number {
    if (subStopTimings.length === 0) return 0;
    
    const lastTiming = subStopTimings[subStopTimings.length - 1];
    return lastTiming.cumulativeDriveTime;
  }

  /**
   * Format time in 12-hour format
   */
  private static formatTime(hour: number): string {
    const wholeHour = Math.floor(hour);
    const minutes = Math.round((hour - wholeHour) * 60);
    
    let displayHour = wholeHour;
    const period = displayHour >= 12 ? 'PM' : 'AM';
    
    if (displayHour > 12) displayHour -= 12;
    if (displayHour === 0) displayHour = 12;
    
    const minuteString = minutes.toString().padStart(2, '0');
    return `${displayHour}:${minuteString} ${period}`;
  }

  /**
   * Calculate recommended stay duration based on stop type
   */
  private static calculateStayDuration(stop: TripStop): number {
    switch (stop.category) {
      case 'destination_city':
        return 2.0; // 2 hours for destination cities
      case 'attraction':
        return 1.5; // 1.5 hours for attractions
      case 'historic_site':
        return 1.0; // 1 hour for historic sites
      case 'drive_in_theater':
        return 0.5; // 30 minutes for drive-ins (quick stop)
      default:
        return 1.0; // 1 hour default
    }
  }
}
