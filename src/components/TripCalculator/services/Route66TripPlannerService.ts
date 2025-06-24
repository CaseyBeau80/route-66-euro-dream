
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

    // Calculate distances for consecutive city pairs and map to days
    const cityPairDistances: Array<{
      fromCity: DestinationCity;
      toCity: DestinationCity;
      distance: number;
      duration: number;
      isGoogleData: boolean;
    }> = [];

    // Calculate distance for each consecutive city pair
    for (let i = 0; i < routeCities.length - 1; i++) {
      const fromCity = routeCities[i];
      const toCity = routeCities[i + 1];
      
      let distance = 0;
      let duration = 0;
      let isGoogleData = false;

      if (GoogleDistanceMatrixService.isAvailable()) {
        try {
          const result = await GoogleDistanceMatrixService.calculateDistance(fromCity, toCity);
          distance = result.distance;
          duration = result.duration;
          isGoogleData = true;
          console.log(`✅ Google API: ${fromCity.name} → ${toCity.name} = ${distance} miles`);
        } catch (error) {
          console.error(`❌ Google API failed for ${fromCity.name} → ${toCity.name}:`, error);
          // Fallback to straight-line distance
          distance = this.calculateHaversineDistance(fromCity, toCity);
          duration = (distance / 55) * 3600; // 55 mph average
        }
      } else {
        distance = this.calculateHaversineDistance(fromCity, toCity);
        duration = (distance / 55) * 3600;
        console.log(`📏 Fallback calculation: ${fromCity.name} → ${toCity.name} = ${distance} miles`);
      }

      cityPairDistances.push({
        fromCity,
        toCity,
        distance,
        duration,
        isGoogleData
      });
    }

    // Distribute city pairs across travel days ensuring each day gets correct distances
    const segments: DailySegment[] = [];
    const totalRouteDistance = cityPairDistances.reduce((sum, pair) => sum + pair.distance, 0);
    const totalRouteDuration = cityPairDistances.reduce((sum, pair) => sum + pair.duration, 0);
    
    console.log(`📊 Total route: ${Math.round(totalRouteDistance)} miles, ${Math.round(totalRouteDuration / 3600)} hours`);

    // Distribute city pairs across days
    const targetDistancePerDay = totalRouteDistance / travelDays;
    let currentDay = 1;
    let currentDayStartCityIndex = 0;
    let pairIndex = 0;

    while (currentDay <= travelDays && pairIndex < cityPairDistances.length) {
      const startCityForDay = cityPairDistances[currentDayStartCityIndex].fromCity;
      let endCityForDay = startCityForDay;
      let dayDistance = 0;
      let dayDuration = 0;
      let isGoogleDataForDay = false;

      // Accumulate city pairs for this day
      while (pairIndex < cityPairDistances.length) {
        const pair = cityPairDistances[pairIndex];
        const wouldExceedTarget = (dayDistance + pair.distance) > (targetDistancePerDay * 1.3) && dayDistance > 0;
        const isLastDay = currentDay === travelDays;
        
        if (wouldExceedTarget && !isLastDay) {
          break; // Don't add this pair to current day
        }
        
        dayDistance += pair.distance;
        dayDuration += pair.duration;
        endCityForDay = pair.toCity;
        isGoogleDataForDay = isGoogleDataForDay || pair.isGoogleData;
        pairIndex++;
        
        console.log(`📍 Day ${currentDay}: Added ${pair.fromCity.name} → ${pair.toCity.name} (${Math.round(pair.distance)}mi)`);
        
        if (isLastDay) {
          // Last day - include all remaining pairs
          continue;
        } else if (dayDistance >= targetDistancePerDay * 0.8) {
          // Day has enough distance
          break;
        }
      }

      // Create segment for this day
      const segment: DailySegment = {
        day: currentDay,
        title: `Day ${currentDay}: ${startCityForDay.name} to ${endCityForDay.name}`,
        startCity: startCityForDay.name,
        endCity: endCityForDay.name,
        distance: Math.round(dayDistance),
        approximateMiles: Math.round(dayDistance),
        driveTimeHours: Math.round((dayDuration / 3600) * 10) / 10,
        drivingTime: Math.round((dayDuration / 3600) * 10) / 10,
        destination: {
          city: endCityForDay.name,
          state: endCityForDay.state
        },
        attractions: endCityForDay.attractions.map(name => ({ 
          name, 
          title: name,
          description: `Historic attraction in ${endCityForDay.name}`,
          city: endCityForDay.name,
          category: 'attraction' 
        })),
        recommendedStops: [],
        isGoogleMapsData: isGoogleDataForDay
      };

      segments.push(segment);
      
      console.log(`✅ Day ${currentDay} FINAL: ${startCityForDay.name} → ${endCityForDay.name} = ${Math.round(dayDistance)} miles, ${Math.round((dayDuration / 3600) * 10) / 10}h (Google: ${isGoogleDataForDay})`);
      
      currentDay++;
      currentDayStartCityIndex = pairIndex > 0 ? pairIndex - 1 : 0;
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
      totalDrivingTime: Math.round(totalRouteDuration / 3600),
      segments,
      dailySegments: segments,
      stops: [],
      tripStyle,
      lastUpdated: new Date(),
      summary: {
        startLocation,
        endLocation,
        totalDriveTime: Math.round(totalRouteDuration / 3600),
        totalDays: travelDays,
        totalDistance: Math.round(totalRouteDistance),
        tripStyle
      }
    };

    console.log('🎯 FINAL TRIP PLAN - Each day should now have UNIQUE distances:', {
      segments: segments.map(s => ({ 
        day: s.day, 
        route: `${s.startCity} → ${s.endCity}`,
        distance: s.distance,
        isGoogle: s.isGoogleMapsData
      }))
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
