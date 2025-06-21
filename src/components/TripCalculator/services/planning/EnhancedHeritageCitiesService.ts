
import { TripPlan } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { SupabaseDataService } from '../data/SupabaseDataService';
import { DestinationMatchingService } from '../DestinationMatchingService';

export class EnhancedHeritageCitiesService {
  /**
   * Plan an enhanced heritage cities trip with proper day distribution
   */
  static async planEnhancedHeritageCitiesTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🏛️ Enhanced Heritage Cities Planning: ${startLocation} → ${endLocation}, ${travelDays} days`);
    
    try {
      // Fetch all Route 66 stops if not provided
      const stops = allStops.length > 0 ? allStops : await SupabaseDataService.fetchAllStops();
      
      if (!stops || stops.length === 0) {
        throw new Error('No Route 66 stops available');
      }

      console.log(`📍 Working with ${stops.length} Route 66 stops`);

      // Find start and end stops using enhanced matching
      const startMatch = DestinationMatchingService.findBestMatch(startLocation, stops);
      const endMatch = DestinationMatchingService.findBestMatch(endLocation, stops);

      if (!startMatch || !endMatch) {
        console.error('❌ Could not match start/end locations:', { 
          startLocation, 
          endLocation,
          foundStart: !!startMatch,
          foundEnd: !!endMatch 
        });
        throw new Error(`Could not find Route 66 stops for ${!startMatch ? startLocation : endLocation}`);
      }

      const startStop = startMatch.stop;
      const endStop = endMatch.stop;

      console.log(`✅ Matched locations:`, {
        start: `${startStop.name} (${startStop.city}, ${startStop.state})`,
        end: `${endStop.name} (${endStop.city}, ${endStop.state})`
      });

      // Get heritage cities (destination cities) between start and end
      const destinationCities = await SupabaseDataService.getDestinationCities();
      console.log(`🏛️ Found ${destinationCities.length} heritage cities`);

      // Filter heritage cities that are between start and end geographically
      const routeHeritageCities = this.filterHeritageCitiesOnRoute(
        startStop, 
        endStop, 
        destinationCities
      );

      console.log(`🛣️ Route heritage cities: ${routeHeritageCities.length} cities`);

      // Select key destinations based on travel days
      const selectedDestinations = this.selectKeyDestinations(
        routeHeritageCities,
        travelDays - 1 // Reserve last day for final destination
      );

      console.log(`🎯 Selected ${selectedDestinations.length} destinations for ${travelDays} days`);

      // Build daily segments with proper distribution
      const segments = await this.buildDailySegments(
        startStop,
        selectedDestinations,
        endStop,
        stops,
        travelDays
      );

      // Calculate total metrics
      const totalDistance = segments.reduce((sum, seg) => sum + (seg.distance || 0), 0);
      const totalDrivingTime = segments.reduce((sum, seg) => sum + (seg.driveTimeHours || 0), 0);

      console.log(`📊 Trip totals: ${totalDistance} miles, ${totalDrivingTime.toFixed(1)} hours`);

      const tripPlan: TripPlan = {
        id: `heritage-trip-${Date.now()}`,
        startLocation: startLocation,
        endLocation: endLocation,
        startCity: startStop.city || startStop.name,
        endCity: endStop.city || endStop.name,
        totalDays: travelDays,
        totalDistance: Math.round(totalDistance),
        totalDrivingTime: totalDrivingTime,
        segments: segments,
        tripStyle: 'destination-focused',
        summary: {
          startLocation: startLocation,
          endLocation: endLocation,
          totalDays: travelDays,
          totalDistance: Math.round(totalDistance),
          totalDriveTime: totalDrivingTime
        }
      };

      console.log(`✅ Heritage cities trip plan created: ${segments.length} days, ${Math.round(totalDistance)} miles`);
      return tripPlan;

    } catch (error) {
      console.error('❌ Enhanced heritage cities planning failed:', error);
      throw error;
    }
  }

  /**
   * Filter heritage cities that are on the route between start and end
   */
  private static filterHeritageCitiesOnRoute(
    startStop: TripStop,
    endStop: TripStop,
    heritageCities: TripStop[]
  ): TripStop[] {
    const routeCities: TripStop[] = [];

    for (const city of heritageCities) {
      // Skip if it's the start or end location
      if (city.id === startStop.id || city.id === endStop.id) {
        continue;
      }

      // Simple geographical filtering - between start and end coordinates
      const isOnRoute = this.isLocationBetween(startStop, endStop, city);
      
      if (isOnRoute) {
        routeCities.push(city);
      }
    }

    // Sort by distance from start to maintain route order
    return routeCities.sort((a, b) => {
      const distA = this.calculateDistance(startStop, a);
      const distB = this.calculateDistance(startStop, b);
      return distA - distB;
    });
  }

  /**
   * Check if a location is geographically between start and end points
   */
  private static isLocationBetween(start: TripStop, end: TripStop, location: TripStop): boolean {
    const startLat = start.latitude;
    const startLng = start.longitude;
    const endLat = end.latitude;
    const endLng = end.longitude;
    const locLat = location.latitude;
    const locLng = location.longitude;

    // Check if location is within the bounding box of start and end
    const minLat = Math.min(startLat, endLat);
    const maxLat = Math.max(startLat, endLat);
    const minLng = Math.min(startLng, endLng);
    const maxLng = Math.max(startLng, endLng);

    // Add some tolerance for Route 66's winding path
    const tolerance = 2.0; // degrees

    return (
      locLat >= minLat - tolerance &&
      locLat <= maxLat + tolerance &&
      locLng >= minLng - tolerance &&
      locLng <= maxLng + tolerance
    );
  }

  /**
   * Select key destinations based on available travel days
   */
  private static selectKeyDestinations(
    heritageCities: TripStop[],
    maxDestinations: number
  ): TripStop[] {
    if (heritageCities.length <= maxDestinations) {
      return heritageCities;
    }

    // Select evenly distributed destinations
    const selected: TripStop[] = [];
    const step = heritageCities.length / maxDestinations;
    
    for (let i = 0; i < maxDestinations; i++) {
      const index = Math.round(i * step);
      if (index < heritageCities.length) {
        selected.push(heritageCities[index]);
      }
    }

    return selected;
  }

  /**
   * Build daily segments with proper day distribution
   */
  private static async buildDailySegments(
    startStop: TripStop,
    destinations: TripStop[],
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number
  ) {
    const segments = [];
    
    // Create the route stops in order
    const routeStops = [startStop, ...destinations, endStop];
    
    console.log(`🛣️ Building route with ${routeStops.length} stops for ${totalDays} days`);

    // Distribute stops across days
    const stopsPerDay = Math.max(1, Math.floor(routeStops.length / totalDays));
    let currentStopIndex = 0;

    for (let day = 1; day <= totalDays; day++) {
      const isLastDay = day === totalDays;
      
      // Start city for this day
      const dayStartStop = routeStops[currentStopIndex];
      
      // End city for this day
      let dayEndStop: TripStop;
      if (isLastDay) {
        // Last day always ends at final destination
        dayEndStop = endStop;
      } else {
        // Calculate next stop index
        const nextIndex = Math.min(
          currentStopIndex + stopsPerDay,
          routeStops.length - 2 // Ensure we don't skip the final destination
        );
        dayEndStop = routeStops[nextIndex];
        currentStopIndex = nextIndex;
      }

      // Calculate distance and drive time
      const distance = this.calculateDistance(dayStartStop, dayEndStop);
      const driveTimeHours = distance / 55; // Assume 55 mph average

      // Find attractions near the end city
      const attractions = await this.findNearbyAttractions(dayEndStop, allStops);

      const segment = {
        day: day,
        startCity: dayStartStop.city || dayStartStop.name,
        endCity: dayEndStop.city || dayEndStop.name,
        distance: Math.round(distance),
        driveTimeHours: Math.round(driveTimeHours * 10) / 10,
        attractions: attractions.slice(0, 3), // Limit to 3 attractions per day
        description: `Day ${day}: Drive from ${dayStartStop.city || dayStartStop.name} to ${dayEndStop.city || dayEndStop.name}`,
        isGoogleMapsData: false
      };

      segments.push(segment);

      // If we've reached the end, break
      if (dayEndStop.id === endStop.id) {
        break;
      }
    }

    console.log(`✅ Built ${segments.length} daily segments`);
    return segments;
  }

  /**
   * Find nearby attractions for a given stop
   */
  private static async findNearbyAttractions(targetStop: TripStop, allStops: TripStop[]): Promise<TripStop[]> {
    const attractions = allStops.filter(stop => {
      // Skip if it's the same stop
      if (stop.id === targetStop.id) return false;
      
      // Look for attractions within reasonable distance
      const distance = this.calculateDistance(targetStop, stop);
      return distance <= 50; // Within 50 miles
    });

    // Sort by distance and return closest ones
    return attractions
      .sort((a, b) => {
        const distA = this.calculateDistance(targetStop, a);
        const distB = this.calculateDistance(targetStop, b);
        return distA - distB;
      })
      .slice(0, 5);
  }

  /**
   * Calculate distance between two stops using Haversine formula
   */
  private static calculateDistance(stop1: TripStop, stop2: TripStop): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (stop2.latitude - stop1.latitude) * Math.PI / 180;
    const dLon = (stop2.longitude - stop1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(stop1.latitude * Math.PI / 180) * Math.cos(stop2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  }
}
