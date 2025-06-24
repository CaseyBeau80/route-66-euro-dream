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

    // Calculate distances between each consecutive pair of cities
    const cityPairDistances: { distance: number; duration: number; isGoogle: boolean; fromCity: string; toCity: string }[] = [];
    let totalRouteDistance = 0;
    let totalRouteDuration = 0;
    let hasGoogleData = false;

    if (GoogleDistanceMatrixService.isAvailable()) {
      console.log('🗺️ Using Google Distance Matrix API for accurate route calculations');
      
      for (let i = 0; i < routeCities.length - 1; i++) {
        try {
          const result = await GoogleDistanceMatrixService.calculateDistance(routeCities[i], routeCities[i + 1]);
          const pairData = {
            distance: result.distance,
            duration: result.duration,
            isGoogle: true,
            fromCity: routeCities[i].name,
            toCity: routeCities[i + 1].name
          };
          
          cityPairDistances.push(pairData);
          totalRouteDistance += result.distance;
          totalRouteDuration += result.duration;
          hasGoogleData = true;
          
          console.log(`✅ City pair ${i + 1}: ${routeCities[i].name} → ${routeCities[i + 1].name} = ${result.distance} miles, ${this.formatDuration(result.duration)}`);
          
          if (i < routeCities.length - 2) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`❌ Google API failed for ${routeCities[i].name} → ${routeCities[i + 1].name}:`, error);
          const fallbackDistance = this.calculateHaversineDistance(routeCities[i], routeCities[i + 1]);
          const fallbackDuration = (fallbackDistance / 55) * 3600;
          
          cityPairDistances.push({
            distance: fallbackDistance,
            duration: fallbackDuration,
            isGoogle: false,
            fromCity: routeCities[i].name,
            toCity: routeCities[i + 1].name
          });
          totalRouteDistance += fallbackDistance;
          totalRouteDuration += fallbackDuration;
        }
      }
    } else {
      console.log('📏 Using fallback distance calculations');
      for (let i = 0; i < routeCities.length - 1; i++) {
        const distance = this.calculateHaversineDistance(routeCities[i], routeCities[i + 1]);
        const duration = (distance / 55) * 3600;
        
        cityPairDistances.push({
          distance,
          duration,
          isGoogle: false,
          fromCity: routeCities[i].name,
          toCity: routeCities[i + 1].name
        });
        totalRouteDistance += distance;
        totalRouteDuration += duration;
      }
    }

    console.log(`📊 Total route: ${Math.round(totalRouteDistance)} miles, ${this.formatDuration(totalRouteDuration)} (Google: ${hasGoogleData})`);
    console.log('🔍 City pair distances:', cityPairDistances.map(p => `${p.fromCity}→${p.toCity}: ${p.distance}mi`));

    // NOW: Intelligently distribute city pairs across the requested travel days
    const segments: DailySegment[] = [];
    
    // Create breakpoint indices for days - distribute city pairs as evenly as possible
    const totalCityPairs = cityPairDistances.length;
    const cityPairsPerDay = Math.max(1, Math.floor(totalCityPairs / travelDays));
    
    console.log(`📅 Distributing ${totalCityPairs} city pairs across ${travelDays} days (target: ${cityPairsPerDay} pairs per day)`);
    
    let currentPairIndex = 0;
    
    for (let day = 1; day <= travelDays; day++) {
      const isLastDay = day === travelDays;
      
      // Determine how many city pairs this day gets
      let pairsForThisDay: number;
      if (isLastDay) {
        // Last day gets all remaining pairs
        pairsForThisDay = totalCityPairs - currentPairIndex;
      } else {
        const remainingPairs = totalCityPairs - currentPairIndex;
        const remainingDays = travelDays - day + 1;
        pairsForThisDay = Math.min(cityPairsPerDay, Math.ceil(remainingPairs / remainingDays));
        pairsForThisDay = Math.max(1, pairsForThisDay); // Ensure at least 1 pair per day
      }
      
      // Calculate this day's metrics by summing the assigned city pairs
      let dayDistance = 0;
      let dayDuration = 0;
      let dayIsGoogleData = true;
      
      const dayStartCityIndex = currentPairIndex;
      const dayEndCityIndex = Math.min(currentPairIndex + pairsForThisDay, totalCityPairs);
      
      const pairsForDay: typeof cityPairDistances = [];
      
      // Sum up distances for the city pairs assigned to this day
      for (let p = 0; p < pairsForThisDay && currentPairIndex < totalCityPairs; p++) {
        const pairData = cityPairDistances[currentPairIndex];
        pairsForDay.push(pairData);
        dayDistance += pairData.distance;
        dayDuration += pairData.duration;
        if (!pairData.isGoogle) {
          dayIsGoogleData = false;
        }
        currentPairIndex++;
      }
      
      // Determine start and end cities for this day
      const startCityForDay = routeCities[dayStartCityIndex];
      const endCityForDay = routeCities[Math.min(dayStartCityIndex + pairsForThisDay, routeCities.length - 1)];

      const dailySegment: DailySegment = {
        day,
        title: `Day ${day}: ${startCityForDay.name} to ${endCityForDay.name}`,
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
        isGoogleMapsData: dayIsGoogleData
      };

      segments.push(dailySegment);
      
      console.log(`🎯 Day ${day} UNIQUE: ${startCityForDay.name} → ${endCityForDay.name} = ${Math.round(dayDistance)} miles, ${Math.round((dayDuration / 3600) * 10) / 10}h (${pairsForThisDay} city pairs: ${pairsForDay.map(p => `${p.fromCity}→${p.toCity}`).join(', ')}, Google: ${dayIsGoogleData})`);
      
      if (currentPairIndex >= totalCityPairs) {
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

    console.log('🎯 FINAL TRIP PLAN with TRULY UNIQUE daily distances:', {
      segments: segments.map(s => ({ 
        day: s.day, 
        route: `${s.startCity} → ${s.endCity}`,
        distance: s.distance,
        driveTime: s.driveTimeHours,
        isGoogle: s.isGoogleMapsData
      })),
      totalDistance: Math.round(totalRouteDistance),
      totalDriveTime: Math.round((totalRouteDuration / 3600) * 10) / 10,
      verification: 'Each day should now have different distances based on actual city pairs assigned'
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
