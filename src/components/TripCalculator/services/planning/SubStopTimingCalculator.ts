
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface SubStopTiming {
  stop: TripStop;
  distanceFromStart: number;
  cumulativeDriveTime: number;
  estimatedArrival: string;
  recommendedStayDuration: number;
}

export interface SegmentTiming {
  fromStop: TripStop;
  toStop: TripStop;
  distance: number;
  drivingTime: number;
  distanceMiles: number;
  driveTimeHours: number;
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
      
      // Validate distance is reasonable (not negative or excessive)
      if (segmentDistance <= 0 || segmentDistance > 500) {
        console.warn(`⚠️ Invalid segment distance ${segmentDistance}mi between ${currentStop.name} and ${stop.name}, skipping`);
        continue;
      }
      
      const segmentDriveTime = this.calculateRealisticDriveTime(segmentDistance);
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
   * Calculate segment timings for route progression display - FIXED to prevent circular references
   */
  static calculateSegmentTimings(
    startStop: TripStop,
    endStop: TripStop,
    stops: TripStop[]
  ): SegmentTiming[] {
    const segmentTimings: SegmentTiming[] = [];
    
    // Create full route including start, intermediate stops, and end
    const fullRoute = [startStop, ...stops, endStop];
    
    // Calculate timing between each consecutive pair
    for (let i = 0; i < fullRoute.length - 1; i++) {
      const fromStop = fullRoute[i];
      const toStop = fullRoute[i + 1];
      
      // Prevent self-referencing segments
      if (fromStop.id === toStop.id) {
        console.warn(`⚠️ Skipping self-referencing segment: ${fromStop.name}`);
        continue;
      }
      
      const distance = DistanceCalculationService.calculateDistance(
        fromStop.latitude, fromStop.longitude,
        toStop.latitude, toStop.longitude
      );
      
      // Validate distance is reasonable
      if (distance <= 0 || distance > 1000) {
        console.warn(`⚠️ Invalid distance ${distance}mi between ${fromStop.name} and ${toStop.name}`);
        continue;
      }
      
      // Use corrected realistic drive time calculation
      const driveTime = this.calculateRealisticDriveTime(distance);
      
      segmentTimings.push({
        fromStop,
        toStop,
        distance: Math.round(distance),
        drivingTime: Math.round(driveTime * 10) / 10,
        distanceMiles: Math.round(distance),
        driveTimeHours: Math.round(driveTime * 10) / 10
      });
    }
    
    console.log(`📊 Created ${segmentTimings.length} valid segment timings`);
    return segmentTimings;
  }

  /**
   * Calculate realistic drive time based on distance and road conditions - FIXED CALCULATION
   */
  private static calculateRealisticDriveTime(distance: number): number {
    // Use appropriate speeds based on Route 66 conditions
    let avgSpeed: number;
    
    if (distance < 50) {
      avgSpeed = 45; // Urban/city driving with stops and traffic lights
    } else if (distance < 150) {
      avgSpeed = 55; // Mixed highway/rural roads
    } else {
      avgSpeed = 65; // Highway driving on interstates
    }
    
    // Calculate base time in hours
    const baseTime = distance / avgSpeed;
    
    // Add minimal buffer for stops (5-10% depending on distance)
    const bufferMultiplier = distance < 100 ? 1.1 : 1.05;
    
    // Return the calculated time, ensuring minimum of 0.5 hours (30 minutes)
    const finalTime = Math.max(baseTime * bufferMultiplier, 0.5);
    
    console.log(`🚗 Drive time for ${distance} miles: ${finalTime.toFixed(2)} hours at avg ${avgSpeed} mph`);
    return finalTime;
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
