
import { DestinationCity, ROUTE_66_DESTINATION_CITIES } from '../../Route66Planner/data/destinationCities';
import { GoogleDistanceMatrixService } from '../../Route66Planner/services/GoogleDistanceMatrixService';
import { TripPlan, DailySegment } from './planning/TripPlanTypes';

export class Route66TripPlannerService {
  
  static getDataSourceStatus() {
    return {
      hasGoogleMapsApi: GoogleDistanceMatrixService.isAvailable(),
      apiKeyPresent: !!GoogleDistanceMatrixService.getApiKey()
    };
  }

  static isUsingFallbackData(): boolean {
    return !GoogleDistanceMatrixService.isAvailable();
  }

  static async getDestinationCitiesCount(): Promise<number> {
    return ROUTE_66_DESTINATION_CITIES.length;
  }

  static async planTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): Promise<TripPlan> {
    console.log(`🚗 Route66TripPlannerService: Planning ${travelDays}-day trip from ${startLocation} to ${endLocation}`);

    // Find start and end cities in destination cities
    const startCity = ROUTE_66_DESTINATION_CITIES.find(city => 
      `${city.name}, ${city.state}` === startLocation || city.name === startLocation.split(',')[0]?.trim()
    );
    const endCity = ROUTE_66_DESTINATION_CITIES.find(city => 
      `${city.name}, ${city.state}` === endLocation || city.name === endLocation.split(',')[0]?.trim()
    );

    if (!startCity || !endCity) {
      throw new Error(`Could not find route between ${startLocation} and ${endLocation}`);
    }

    // Get all cities in the route sequence
    const startIndex = ROUTE_66_DESTINATION_CITIES.findIndex(city => city.id === startCity.id);
    const endIndex = ROUTE_66_DESTINATION_CITIES.findIndex(city => city.id === endCity.id);
    
    const routeCities = startIndex < endIndex 
      ? ROUTE_66_DESTINATION_CITIES.slice(startIndex, endIndex + 1)
      : ROUTE_66_DESTINATION_CITIES.slice(endIndex, startIndex + 1).reverse();

    console.log(`🗺️ Route includes ${routeCities.length} cities:`, routeCities.map(c => c.name));

    // FIXED: Calculate actual route distances using Google API for each consecutive city pair
    const routeSegmentDistances: { distance: number; duration: number; isGoogle: boolean }[] = [];
    let totalRouteDistance = 0;
    let totalRouteDuration = 0;
    let hasGoogleData = false;

    if (GoogleDistanceMatrixService.isAvailable()) {
      console.log('🗺️ Using Google Distance Matrix API for accurate route calculations');
      
      // Calculate distance for each consecutive city pair in the route
      for (let i = 0; i < routeCities.length - 1; i++) {
        try {
          const result = await GoogleDistanceMatrixService.calculateDistance(routeCities[i], routeCities[i + 1]);
          routeSegmentDistances.push({
            distance: result.distance,
            duration: result.duration,
            isGoogle: true
          });
          totalRouteDistance += result.distance;
          totalRouteDuration += result.duration;
          hasGoogleData = true;
          
          console.log(`✅ Segment ${i + 1}: ${routeCities[i].name} → ${routeCities[i + 1].name} = ${result.distance} miles, ${this.formatDuration(result.duration)}`);
          
          // Small delay to respect API rate limits
          if (i < routeCities.length - 2) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`❌ Google API failed for ${routeCities[i].name} → ${routeCities[i + 1].name}:`, error);
          // Fallback to haversine distance for this segment
          const fallbackDistance = this.calculateHaversineDistance(routeCities[i], routeCities[i + 1]);
          const fallbackDuration = (fallbackDistance / 55) * 3600;
          routeSegmentDistances.push({
            distance: fallbackDistance,
            duration: fallbackDuration,
            isGoogle: false
          });
          totalRouteDistance += fallbackDistance;
          totalRouteDuration += fallbackDuration;
        }
      }
    } else {
      console.log('📏 Using fallback distance calculations');
      // Fallback calculations for all segments
      for (let i = 0; i < routeCities.length - 1; i++) {
        const distance = this.calculateHaversineDistance(routeCities[i], routeCities[i + 1]);
        const duration = (distance / 55) * 3600;
        routeSegmentDistances.push({
          distance,
          duration,
          isGoogle: false
        });
        totalRouteDistance += distance;
        totalRouteDuration += duration;
      }
    }

    console.log(`📊 Total route: ${Math.round(totalRouteDistance)} miles, ${this.formatDuration(totalRouteDuration)} (Google: ${hasGoogleData})`);

    // Now distribute the route segments across the requested days
    const segments: DailySegment[] = [];
    const segmentsPerDay = Math.max(1, Math.floor(routeSegmentDistances.length / travelDays));
    
    let segmentIndex = 0;
    for (let day = 1; day <= travelDays; day++) {
      const isLastDay = day === travelDays;
      
      // Determine how many route segments to include in this day
      let daySegmentCount: number;
      if (isLastDay) {
        // Last day gets all remaining segments
        daySegmentCount = routeSegmentDistances.length - segmentIndex;
      } else {
        // Calculate segments for this day, ensuring we don't exceed remaining segments
        const remainingSegments = routeSegmentDistances.length - segmentIndex;
        const remainingDays = travelDays - day + 1;
        daySegmentCount = Math.min(segmentsPerDay, Math.floor(remainingSegments / remainingDays));
        daySegmentCount = Math.max(1, daySegmentCount); // Ensure at least 1 segment per day
      }

      // Calculate this day's metrics by summing the included route segments
      let dayDistance = 0;
      let dayDuration = 0;
      let dayIsGoogleData = true;
      
      const dayStartCityIndex = segmentIndex;
      const dayEndCityIndex = Math.min(segmentIndex + daySegmentCount, routeCities.length - 1);
      
      // Sum up the distances for all segments included in this day
      for (let i = 0; i < daySegmentCount && segmentIndex < routeSegmentDistances.length; i++) {
        const segment = routeSegmentDistances[segmentIndex];
        dayDistance += segment.distance;
        dayDuration += segment.duration;
        if (!segment.isGoogle) {
          dayIsGoogleData = false;
        }
        segmentIndex++;
      }

      const startCity = routeCities[dayStartCityIndex];
      const endCity = routeCities[dayEndCityIndex];

      const dailySegment: DailySegment = {
        day,
        title: `Day ${day}: ${startCity.name} to ${endCity.name}`,
        startCity: startCity.name,
        endCity: endCity.name,
        distance: Math.round(dayDistance),
        approximateMiles: Math.round(dayDistance),
        driveTimeHours: Math.round((dayDuration / 3600) * 10) / 10,
        drivingTime: Math.round((dayDuration / 3600) * 10) / 10,
        destination: {
          city: endCity.name,
          state: endCity.state
        },
        attractions: endCity.attractions.map(name => ({ 
          name, 
          title: name,
          description: `Historic attraction in ${endCity.name}`,
          city: endCity.name,
          category: 'attraction' 
        })),
        recommendedStops: [],
        isGoogleMapsData: dayIsGoogleData
      };

      segments.push(dailySegment);
      
      console.log(`🎯 Day ${day} CREATED: ${startCity.name} → ${endCity.name} = ${Math.round(dayDistance)} miles, ${Math.round((dayDuration / 3600) * 10) / 10}h (${daySegmentCount} route segments, Google: ${dayIsGoogleData})`);
      
      // Break if we've used all route segments
      if (segmentIndex >= routeSegmentDistances.length) {
        break;
      }
    }

    const tripPlan: TripPlan = {
      id: `trip-${Date.now()}`,
      title: `${startLocation} to ${endLocation} Route 66 Adventure`,
      startLocation,
      endLocation,
      startCity: startCity.name,
      endCity: endCity.name,
      startDate: new Date(),
      totalDays: travelDays,
      totalDistance: Math.round(totalRouteDistance),
      totalMiles: Math.round(totalRouteDistance),
      totalDrivingTime: Math.round((totalRouteDuration / 3600) * 10) / 10,
      segments,
      dailySegments: segments,
      stops: [],
      tripStyle,
      lastUpdated: new Date(),
      summary: {
        startLocation,
        endLocation,
        totalDriveTime: Math.round((totalRouteDuration / 3600) * 10) / 10,
        totalDays: travelDays,
        totalDistance: Math.round(totalRouteDistance),
        tripStyle
      }
    };

    console.log('🎯 FINAL TRIP PLAN with UNIQUE daily distances:', {
      segments: segments.map(s => ({ 
        day: s.day, 
        route: `${s.startCity} → ${s.endCity}`,
        distance: s.distance,
        driveTime: s.driveTimeHours,
        isGoogle: s.isGoogleMapsData
      })),
      totalDistance: Math.round(totalRouteDistance),
      totalDriveTime: Math.round((totalRouteDuration / 3600) * 10) / 10
    });

    return tripPlan;
  }

  private static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes}m`;
    }
    
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  private static calculateHaversineDistance(city1: DestinationCity, city2: DestinationCity): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (city2.latitude - city1.latitude) * Math.PI / 180;
    const dLon = (city2.longitude - city1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(city1.latitude * Math.PI / 180) * Math.cos(city2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

// Export the TripPlan type from the unified types file
export type { TripPlan, DailySegment } from './planning/TripPlanTypes';
