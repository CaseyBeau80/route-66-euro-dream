
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

  // ADDED: Missing methods for DeveloperDebugTools
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

    // FIXED: Calculate distances and create segments with proper day distribution
    const segments: DailySegment[] = [];
    
    // First, determine which cities will be endpoints for each day
    const dayEndpoints: DestinationCity[] = [];
    
    // Distribute cities across days more evenly
    const citiesPerDay = Math.max(1, Math.floor((routeCities.length - 1) / travelDays));
    
    for (let day = 1; day <= travelDays; day++) {
      if (day === travelDays) {
        // Last day always ends at the final city
        dayEndpoints.push(endCity);
      } else {
        // Calculate which city this day should end at
        const cityIndex = Math.min(
          startIndex + (day * citiesPerDay),
          routeCities.length - 2 // Ensure we don't go past the second-to-last city
        );
        dayEndpoints.push(routeCities[cityIndex] || endCity);
      }
    }

    console.log(`📍 Day endpoints:`, dayEndpoints.map((city, idx) => `Day ${idx + 1}: ${city.name}`));

    // Now create segments with actual distances between consecutive day endpoints
    let currentStartCity = startCity;
    
    for (let day = 1; day <= travelDays; day++) {
      const dayEndCity = dayEndpoints[day - 1];
      let segmentDistance = 0;
      let segmentDuration = 0;
      let isGoogleData = false;

      // Calculate direct distance from current start to day end
      if (GoogleDistanceMatrixService.isAvailable()) {
        try {
          const result = await GoogleDistanceMatrixService.calculateDistance(currentStartCity, dayEndCity);
          segmentDistance = result.distance;
          segmentDuration = result.duration;
          isGoogleData = true;
          console.log(`✅ Day ${day} Google API: ${currentStartCity.name} → ${dayEndCity.name} = ${segmentDistance} miles`);
        } catch (error) {
          console.error(`❌ Google API failed for Day ${day}:`, error);
          segmentDistance = this.calculateHaversineDistance(currentStartCity, dayEndCity);
          segmentDuration = (segmentDistance / 55) * 3600;
        }
      } else {
        segmentDistance = this.calculateHaversineDistance(currentStartCity, dayEndCity);
        segmentDuration = (segmentDistance / 55) * 3600;
        console.log(`📏 Day ${day} Fallback: ${currentStartCity.name} → ${dayEndCity.name} = ${segmentDistance} miles`);
      }

      // Create the segment with UNIQUE distance for this day
      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${currentStartCity.name} to ${dayEndCity.name}`,
        startCity: currentStartCity.name,
        endCity: dayEndCity.name,
        distance: Math.round(segmentDistance), // UNIQUE distance per day
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: Math.round((segmentDuration / 3600) * 10) / 10,
        drivingTime: Math.round((segmentDuration / 3600) * 10) / 10,
        destination: {
          city: dayEndCity.name,
          state: dayEndCity.state
        },
        attractions: dayEndCity.attractions.map(name => ({ 
          name, 
          title: name,
          description: `Historic attraction in ${dayEndCity.name}`,
          city: dayEndCity.name,
          category: 'attraction' 
        })),
        recommendedStops: [],
        isGoogleMapsData: isGoogleData
      };

      segments.push(segment);
      
      console.log(`🎯 Day ${day} CREATED: ${currentStartCity.name} → ${dayEndCity.name} = ${Math.round(segmentDistance)} miles, ${Math.round((segmentDuration / 3600) * 10) / 10}h (Google: ${isGoogleData})`);
      
      // Move to next day's starting point
      currentStartCity = dayEndCity;
    }

    // Calculate totals from the actual segments
    const totalRouteDistance = segments.reduce((sum, segment) => sum + segment.distance, 0);
    const totalRouteDuration = segments.reduce((sum, segment) => sum + (segment.driveTimeHours || 0), 0);

    const tripPlan: TripPlan = {
      id: `trip-${Date.now()}`,
      title: `${startLocation} to ${endLocation} Route 66 Adventure`,
      startLocation,
      endLocation,
      startCity: startCity.name,
      endCity: endCity.name,
      startDate: new Date(),
      totalDays: travelDays,
      totalDistance: totalRouteDistance,
      totalMiles: totalRouteDistance,
      totalDrivingTime: totalRouteDuration,
      segments,
      dailySegments: segments,
      stops: [],
      tripStyle,
      lastUpdated: new Date(),
      summary: {
        startLocation,
        endLocation,
        totalDriveTime: totalRouteDuration,
        totalDays: travelDays,
        totalDistance: totalRouteDistance,
        tripStyle
      }
    };

    console.log('🎯 FINAL TRIP PLAN - Each day now has UNIQUE distances:', {
      segments: segments.map(s => ({ 
        day: s.day, 
        route: `${s.startCity} → ${s.endCity}`,
        distance: s.distance,
        driveTime: s.driveTimeHours,
        isGoogle: s.isGoogleMapsData
      })),
      totalDistance: totalRouteDistance,
      totalDriveTime: totalRouteDuration
    });

    return tripPlan;
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
