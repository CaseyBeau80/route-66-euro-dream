
import { TripPlan, DailySegment } from './planning/TripPlanTypes';
import { GoogleDistanceMatrixService } from '../../Route66Planner/services/GoogleDistanceMatrixService';
import { ROUTE_66_DESTINATION_CITIES } from '../../Route66Planner/data/destinationCities';

export interface EnhancedTripPlanResult {
  tripPlan: TripPlan;
  completionAnalysis: any;
  originalRequestedDays: number;
  validationResults?: any;
  warnings?: string[];
}

// Re-export the types from TripPlanTypes for backward compatibility
export type { TripPlan, DailySegment } from './planning/TripPlanTypes';

export class Route66TripPlannerService {
  static async planTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): Promise<TripPlan> {
    console.log('🚗 Route66TripPlannerService: Planning trip with Google Distance Matrix API');

    // Find matching destination cities for accurate coordinates
    const startCity = ROUTE_66_DESTINATION_CITIES.find(city => 
      city.name.toLowerCase().includes(startLocation.toLowerCase()) ||
      startLocation.toLowerCase().includes(city.name.toLowerCase())
    );
    
    const endCity = ROUTE_66_DESTINATION_CITIES.find(city => 
      city.name.toLowerCase().includes(endLocation.toLowerCase()) ||
      endLocation.toLowerCase().includes(city.name.toLowerCase())
    );

    // Get intermediate cities for the route
    const intermediateCities = this.selectIntermediateCities(startCity, endCity, travelDays - 1);
    const allCities = [startCity, ...intermediateCities, endCity].filter(Boolean);

    console.log('🛣️ Selected cities for route:', allCities.map(c => c?.name).join(' → '));

    // Calculate distances using Google Distance Matrix API if available
    const segments: DailySegment[] = [];
    
    for (let day = 1; day <= travelDays; day++) {
      const fromCity = allCities[day - 1];
      const toCity = allCities[day];
      
      if (!fromCity || !toCity) {
        console.warn(`⚠️ Missing city data for day ${day}`);
        continue;
      }

      let distance = 0;
      let driveTimeHours = 0;
      let isGoogleMapsData = false;

      // Try to get real distance from Google Distance Matrix API
      if (GoogleDistanceMatrixService.isAvailable()) {
        try {
          console.log(`🗺️ Calculating real distance: ${fromCity.name} → ${toCity.name}`);
          const result = await GoogleDistanceMatrixService.calculateDistance(fromCity, toCity);
          distance = result.distance;
          driveTimeHours = result.duration / 3600; // Convert seconds to hours
          isGoogleMapsData = true;
          console.log(`✅ Google Maps: ${fromCity.name} → ${toCity.name} = ${distance} miles, ${driveTimeHours.toFixed(1)}h`);
        } catch (error) {
          console.warn(`❌ Google Distance Matrix failed for ${fromCity.name} → ${toCity.name}:`, error);
          // Fall back to estimated distance
          distance = this.estimateDistance(fromCity, toCity);
          driveTimeHours = distance / 55;
        }
      } else {
        console.log('📊 Google Distance Matrix not available, using estimated distances');
        distance = this.estimateDistance(fromCity, toCity);
        driveTimeHours = distance / 55;
      }

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${fromCity.name} to ${toCity.name}`,
        startCity: fromCity.name,
        endCity: toCity.name,
        distance: Math.round(distance),
        approximateMiles: Math.round(distance),
        driveTimeHours: Math.round(driveTimeHours * 10) / 10,
        drivingTime: Math.round(driveTimeHours * 10) / 10,
        destination: {
          city: toCity.name,
          state: toCity.state
        },
        recommendedStops: [],
        isGoogleMapsData,
        attractions: [
          { 
            name: `Historic Site in ${toCity.name}`, 
            title: `Historic Site in ${toCity.name}`,
            description: `Discover the history of ${toCity.name} on Route 66`,
            city: toCity.name,
            category: 'Historic Site' 
          },
          { 
            name: `Local Restaurant in ${toCity.name}`, 
            title: `Local Restaurant in ${toCity.name}`,
            description: `Taste local flavors in ${toCity.name}`,
            city: toCity.name,
            category: 'Restaurant' 
          },
          { 
            name: `Photo Stop near ${toCity.name}`, 
            title: `Photo Stop near ${toCity.name}`,
            description: `Capture memories along Route 66`,
            city: toCity.name,
            category: 'Photo Stop' 
          }
        ]
      };
      
      segments.push(segment);
    }

    const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    console.log('✅ Route66TripPlannerService: Trip planned with real distances:', {
      segments: segments.map(s => ({ 
        day: s.day, 
        route: `${s.startCity} → ${s.endCity}`,
        distance: s.distance,
        driveTime: s.driveTimeHours,
        isGoogleData: s.isGoogleMapsData
      })),
      totalDistance,
      totalDrivingTime: totalDrivingTime.toFixed(1),
      usingGoogleMaps: GoogleDistanceMatrixService.isAvailable()
    });

    const tripPlan: TripPlan = {
      id: `trip-${Date.now()}`,
      title: `${startLocation} to ${endLocation} Route 66 Adventure`,
      description: `Route 66 journey from ${startLocation} to ${endLocation}`,
      startCity: startLocation,
      endCity: endLocation,
      startLocation,
      endLocation,
      startDate: new Date(),
      totalDays: travelDays,
      totalDistance,
      totalMiles: totalDistance,
      totalDrivingTime,
      segments,
      dailySegments: segments,
      stops: [],
      tripStyle,
      lastUpdated: new Date(),
      summary: {
        startLocation,
        endLocation,
        totalDriveTime: totalDrivingTime,
        totalDays: travelDays,
        totalDistance: totalDistance,
        tripStyle: tripStyle
      }
    };

    return tripPlan;
  }

  private static selectIntermediateCities(startCity: any, endCity: any, intermediateCount: number): any[] {
    if (intermediateCount <= 0) return [];
    
    // Get all cities between start and end (simplified logic for demonstration)
    const availableCities = ROUTE_66_DESTINATION_CITIES.filter(city => 
      city !== startCity && city !== endCity
    );
    
    // Select evenly spaced cities for the route
    const selectedCities = [];
    const step = Math.max(1, Math.floor(availableCities.length / (intermediateCount + 1)));
    
    for (let i = 0; i < intermediateCount && i * step < availableCities.length; i++) {
      selectedCities.push(availableCities[i * step]);
    }
    
    return selectedCities.slice(0, intermediateCount);
  }

  private static estimateDistance(fromCity: any, toCity: any): number {
    if (!fromCity || !toCity) return 200; // Default fallback
    
    // Simple Haversine distance calculation
    const R = 3959; // Earth's radius in miles
    const dLat = (toCity.latitude - fromCity.latitude) * Math.PI / 180;
    const dLng = (toCity.longitude - fromCity.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(fromCity.latitude * Math.PI / 180) * Math.cos(toCity.latitude * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1.2; // Add 20% for actual driving vs straight line
  }

  static async planTripWithAnalysis(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): Promise<EnhancedTripPlanResult> {
    console.log('🚗 Route66TripPlannerService: Planning trip with analysis...');
    
    const tripPlan = await this.planTrip(startLocation, endLocation, travelDays, tripStyle);
    
    // Create mock completion analysis
    const completionAnalysis = {
      isComplete: true,
      completionPercentage: 100,
      missingDays: 0,
      adjustmentsMade: []
    };

    return {
      tripPlan,
      completionAnalysis,
      originalRequestedDays: travelDays,
      validationResults: {},
      warnings: []
    };
  }

  static getDataSourceStatus(): string {
    return GoogleDistanceMatrixService.isAvailable() ? 'Google Distance Matrix API' : 'Estimated Distances';
  }

  static isUsingFallbackData(): boolean {
    return !GoogleDistanceMatrixService.isAvailable();
  }

  static getDestinationCitiesCount(): number {
    return ROUTE_66_DESTINATION_CITIES.length;
  }
}
