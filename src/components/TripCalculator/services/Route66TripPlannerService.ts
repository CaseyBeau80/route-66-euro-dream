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
    console.log('🚗 Route66TripPlannerService: Planning trip with improved segment calculation');

    // Find matching destination cities for accurate coordinates
    const startCity = ROUTE_66_DESTINATION_CITIES.find(city => 
      city.name.toLowerCase().includes(startLocation.toLowerCase()) ||
      startLocation.toLowerCase().includes(city.name.toLowerCase())
    );
    
    const endCity = ROUTE_66_DESTINATION_CITIES.find(city => 
      city.name.toLowerCase().includes(endLocation.toLowerCase()) ||
      endLocation.toLowerCase().includes(city.name.toLowerCase())
    );

    if (!startCity || !endCity) {
      throw new Error(`Could not find cities for ${startLocation} or ${endLocation}`);
    }

    // Get intermediate cities for the route
    const intermediateCities = this.selectIntermediateCities(startCity, endCity, travelDays - 1);
    const allCities = [startCity, ...intermediateCities, endCity].filter(Boolean);

    console.log('🛣️ Selected cities for route:', allCities.map(c => c?.name).join(' → '));

    // FIXED: Calculate actual distances for each segment individually
    const segments: DailySegment[] = [];
    let totalDistance = 0;
    let totalDrivingTime = 0;

    for (let day = 1; day <= travelDays; day++) {
      const fromCity = allCities[day - 1];
      const toCity = allCities[day];
      
      if (!fromCity || !toCity) {
        console.warn(`⚠️ Missing city data for day ${day}`);
        continue;
      }

      let segmentDistance = 0;
      let segmentDriveTimeHours = 0;
      let isGoogleMapsData = false;

      // FIXED: Calculate individual segment distance using Google Distance Matrix API
      if (GoogleDistanceMatrixService.isAvailable()) {
        try {
          console.log(`🗺️ Calculating REAL distance for Day ${day}: ${fromCity.name} → ${toCity.name}`);
          const result = await GoogleDistanceMatrixService.calculateDistance(fromCity, toCity);
          segmentDistance = result.distance;
          segmentDriveTimeHours = result.duration / 3600; // Convert seconds to hours
          isGoogleMapsData = true;
          console.log(`✅ Day ${day} Google Maps: ${segmentDistance} miles, ${segmentDriveTimeHours.toFixed(1)}h`);
        } catch (error) {
          console.warn(`❌ Google Distance Matrix failed for Day ${day}:`, error);
          // Fall back to estimated distance for this specific segment
          segmentDistance = this.estimateDistance(fromCity, toCity);
          segmentDriveTimeHours = segmentDistance / 55;
          console.log(`📊 Day ${day} Fallback: ${segmentDistance} miles, ${segmentDriveTimeHours.toFixed(1)}h`);
        }
      } else {
        console.log(`📊 Day ${day} using estimated distances - no Google API`);
        segmentDistance = this.estimateDistance(fromCity, toCity);
        segmentDriveTimeHours = segmentDistance / 55;
        console.log(`📊 Day ${day} Estimated: ${segmentDistance} miles, ${segmentDriveTimeHours.toFixed(1)}h`);
      }

      // Create the segment with the actual calculated distance
      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${fromCity.name} to ${toCity.name}`,
        startCity: fromCity.name,
        endCity: toCity.name,
        distance: Math.round(segmentDistance), // FIXED: Use actual segment distance
        approximateMiles: Math.round(segmentDistance), // FIXED: Use actual segment distance
        driveTimeHours: Math.round(segmentDriveTimeHours * 10) / 10,
        drivingTime: Math.round(segmentDriveTimeHours * 10) / 10,
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
      
      // FIXED: Add individual segment values to totals
      totalDistance += segmentDistance;
      totalDrivingTime += segmentDriveTimeHours;
    }

    console.log('✅ Route66TripPlannerService: Trip planned with INDIVIDUAL segment distances:', {
      segments: segments.map(s => ({ 
        day: s.day, 
        route: `${s.startCity} → ${s.endCity}`,
        distance: s.distance,
        driveTime: s.driveTimeHours,
        isGoogleData: s.isGoogleMapsData
      })),
      totalDistance: Math.round(totalDistance),
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
      totalDistance: Math.round(totalDistance), // FIXED: Use sum of actual segments
      totalMiles: Math.round(totalDistance), // FIXED: Use sum of actual segments
      totalDrivingTime: Math.round(totalDrivingTime * 10) / 10,
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
        totalDistance: Math.round(totalDistance),
        tripStyle: tripStyle
      }
    };

    return tripPlan;
  }

  private static selectIntermediateCities(startCity: any, endCity: any, intermediateCount: number): any[] {
    if (intermediateCount <= 0) return [];
    
    // FIXED: Better city selection logic based on Route 66 path
    const startIndex = ROUTE_66_DESTINATION_CITIES.findIndex(city => city.id === startCity.id);
    const endIndex = ROUTE_66_DESTINATION_CITIES.findIndex(city => city.id === endCity.id);
    
    if (startIndex === -1 || endIndex === -1) {
      console.warn('Could not find city indices, using fallback selection');
      return ROUTE_66_DESTINATION_CITIES.slice(1, intermediateCount + 1);
    }
    
    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);
    
    // Get cities between start and end
    const routeCities = ROUTE_66_DESTINATION_CITIES.slice(minIndex + 1, maxIndex);
    
    // If going backwards, reverse the order
    if (startIndex > endIndex) {
      routeCities.reverse();
    }
    
    // Select evenly spaced cities if we have more than needed
    if (routeCities.length <= intermediateCount) {
      return routeCities;
    }
    
    const selectedCities = [];
    const step = routeCities.length / (intermediateCount + 1);
    
    for (let i = 1; i <= intermediateCount; i++) {
      const index = Math.round(i * step) - 1;
      if (index >= 0 && index < routeCities.length) {
        selectedCities.push(routeCities[index]);
      }
    }
    
    return selectedCities;
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
