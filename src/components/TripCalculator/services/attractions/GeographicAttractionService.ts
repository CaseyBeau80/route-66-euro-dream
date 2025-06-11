
import { SupabaseDataService, TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface NearbyAttraction extends TripStop {
  distanceFromCity: number;
  attractionType: 'attraction' | 'hidden_gem' | 'drive_in' | 'waypoint';
}

// Timeout utility for async operations
class TimeoutUtility {
  static async withTimeout<T>(
    promise: Promise<T>, 
    timeoutMs: number, 
    timeoutMessage: string = 'Operation timed out'
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
  }
}

// Fallback geocoding service for missing cities
class FallbackGeocodingService {
  private static readonly ROUTE_66_CITY_COORDINATES: Record<string, { lat: number; lng: number; state: string }> = {
    'springfield': { lat: 37.2153, lng: -93.2982, state: 'MO' },
    'joplin': { lat: 37.0842, lng: -94.5133, state: 'MO' },
    'carthage': { lat: 37.1765, lng: -94.3100, state: 'MO' },
    'webb city': { lat: 37.1467, lng: -94.4663, state: 'MO' },
    'chicago': { lat: 41.8781, lng: -87.6298, state: 'IL' },
    'st. louis': { lat: 38.6270, lng: -90.1994, state: 'MO' },
    'oklahoma city': { lat: 35.4676, lng: -97.5164, state: 'OK' },
    'amarillo': { lat: 35.2220, lng: -101.8313, state: 'TX' },
    'albuquerque': { lat: 35.0844, lng: -106.6504, state: 'NM' },
    'flagstaff': { lat: 35.1983, lng: -111.6513, state: 'AZ' },
    'los angeles': { lat: 34.0522, lng: -118.2437, state: 'CA' }
  };

  static getFallbackCoordinates(cityName: string, state?: string): { latitude: number; longitude: number } | null {
    const normalizedCity = cityName.toLowerCase().trim();
    const coords = this.ROUTE_66_CITY_COORDINATES[normalizedCity];
    
    if (coords && (!state || coords.state.toLowerCase() === state.toLowerCase())) {
      console.log(`🔄 Using fallback coordinates for ${cityName}: ${coords.lat}, ${coords.lng}`);
      return { latitude: coords.lat, longitude: coords.lng };
    }
    
    return null;
  }
}

// Data validation utility
class DataValidationUtility {
  static validateStopData(stop: TripStop): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!stop.id) issues.push('Missing stop ID');
    if (!stop.name) issues.push('Missing stop name');
    if (!stop.city_name) issues.push('Missing city name');
    if (!stop.state) issues.push('Missing state');
    if (typeof stop.latitude !== 'number' || stop.latitude === 0) issues.push('Invalid latitude');
    if (typeof stop.longitude !== 'number' || stop.longitude === 0) issues.push('Invalid longitude');
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }

  static validateDestinationCity(city: TripStop, cityName: string): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!city) {
      issues.push(`Destination city "${cityName}" not found in database`);
      return { isValid: false, issues };
    }

    const validation = this.validateStopData(city);
    if (!validation.isValid) {
      issues.push(`Destination city "${cityName}" has invalid data: ${validation.issues.join(', ')}`);
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

// Structured logging service
class StructuredLogger {
  static logAttractionSearch(operation: string, data: any, level: 'info' | 'warn' | 'error' = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      operation,
      level,
      service: 'GeographicAttractionService',
      ...data
    };

    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '🎯';
    console.log(`${prefix} ${operation}:`, logEntry);
  }
}

export class GeographicAttractionService {
  private static readonly TIMEOUT_MS = 10000; // 10 second timeout
  private static readonly MAX_ATTRACTIONS = 8;

  /**
   * Find attractions near a destination city with enhanced error handling
   */
  static async findAttractionsNearCity(
    cityName: string,
    state: string,
    maxDistance: number = 50 // miles
  ): Promise<NearbyAttraction[]> {
    const searchId = `${cityName}-${state}-${Date.now()}`;
    
    StructuredLogger.logAttractionSearch('findAttractionsNearCity_start', {
      searchId,
      cityName,
      state,
      maxDistance
    });

    try {
      // Wrap the entire operation in a timeout
      const result = await TimeoutUtility.withTimeout(
        this.performAttractionSearch(cityName, state, maxDistance, searchId),
        this.TIMEOUT_MS,
        `Attraction search timed out after ${this.TIMEOUT_MS}ms for ${cityName}, ${state}`
      );

      StructuredLogger.logAttractionSearch('findAttractionsNearCity_success', {
        searchId,
        attractionsFound: result.length,
        cityName,
        state
      });

      return result;

    } catch (error) {
      StructuredLogger.logAttractionSearch('findAttractionsNearCity_error', {
        searchId,
        cityName,
        state,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      }, 'error');

      // Return empty array on error to prevent UI crashes
      return [];
    }
  }

  private static async performAttractionSearch(
    cityName: string,
    state: string,
    maxDistance: number,
    searchId: string
  ): Promise<NearbyAttraction[]> {
    // Get all stops from database with timeout
    const allStops = await TimeoutUtility.withTimeout(
      SupabaseDataService.fetchAllStops(),
      5000,
      'Database fetch timeout'
    );

    StructuredLogger.logAttractionSearch('database_fetch_complete', {
      searchId,
      totalStops: allStops.length
    });

    // Find the destination city with enhanced matching
    const destinationCity = this.findDestinationCity(allStops, cityName, state);
    
    if (!destinationCity) {
      // Try fallback geocoding
      const fallbackCoords = FallbackGeocodingService.getFallbackCoordinates(cityName, state);
      
      if (fallbackCoords) {
        StructuredLogger.logAttractionSearch('using_fallback_coordinates', {
          searchId,
          cityName,
          state,
          coordinates: fallbackCoords
        }, 'warn');

        return this.findAttractionsNearCoordinates(
          fallbackCoords.latitude,
          fallbackCoords.longitude,
          allStops,
          maxDistance,
          cityName,
          searchId
        );
      }

      StructuredLogger.logAttractionSearch('destination_city_not_found', {
        searchId,
        cityName,
        state,
        availableCities: allStops
          .filter(stop => stop.category === 'destination_city')
          .map(stop => `${stop.city_name}, ${stop.state}`)
      }, 'warn');

      return [];
    }

    // Validate destination city data
    const validation = DataValidationUtility.validateDestinationCity(destinationCity, cityName);
    if (!validation.isValid) {
      StructuredLogger.logAttractionSearch('destination_city_invalid', {
        searchId,
        cityName,
        state,
        issues: validation.issues
      }, 'error');
      return [];
    }

    StructuredLogger.logAttractionSearch('destination_city_found', {
      searchId,
      city: destinationCity.name,
      coordinates: {
        lat: destinationCity.latitude,
        lng: destinationCity.longitude
      }
    });

    return this.findAttractionsNearCoordinates(
      destinationCity.latitude,
      destinationCity.longitude,
      allStops,
      maxDistance,
      cityName,
      searchId,
      destinationCity.id
    );
  }

  private static findDestinationCity(allStops: TripStop[], cityName: string, state: string): TripStop | undefined {
    // Enhanced city matching with fuzzy logic
    const normalizedCityName = cityName.toLowerCase().trim();
    const normalizedState = state.toLowerCase().trim();

    // Exact match first
    let destinationCity = allStops.find(stop => 
      stop.city_name?.toLowerCase() === normalizedCityName &&
      stop.state?.toLowerCase() === normalizedState
    );

    if (destinationCity) return destinationCity;

    // Partial match within same state
    destinationCity = allStops.find(stop => 
      stop.state?.toLowerCase() === normalizedState &&
      (stop.city_name?.toLowerCase().includes(normalizedCityName) ||
       normalizedCityName.includes(stop.city_name?.toLowerCase() || ''))
    );

    if (destinationCity) return destinationCity;

    // Fallback to name-only match
    return allStops.find(stop => 
      stop.name?.toLowerCase() === normalizedCityName ||
      stop.city_name?.toLowerCase() === normalizedCityName
    );
  }

  private static findAttractionsNearCoordinates(
    latitude: number,
    longitude: number,
    allStops: TripStop[],
    maxDistance: number,
    cityName: string,
    searchId: string,
    excludeStopId?: string
  ): NearbyAttraction[] {
    const nearbyAttractions: NearbyAttraction[] = [];
    let validStopsCount = 0;
    let invalidStopsCount = 0;

    for (const stop of allStops) {
      // Skip if it's the destination city itself
      if (excludeStopId && stop.id === excludeStopId) continue;

      // Validate stop data
      const validation = DataValidationUtility.validateStopData(stop);
      if (!validation.isValid) {
        invalidStopsCount++;
        continue;
      }
      validStopsCount++;

      // Calculate distance
      const distance = DistanceCalculationService.calculateDistance(
        latitude,
        longitude,
        stop.latitude,
        stop.longitude
      );

      // Include if within range and is an attraction type
      if (distance <= maxDistance && this.isAttractionType(stop)) {
        nearbyAttractions.push({
          ...stop,
          distanceFromCity: distance,
          attractionType: this.categorizeAttraction(stop)
        });
      }
    }

    StructuredLogger.logAttractionSearch('attraction_filtering_complete', {
      searchId,
      validStops: validStopsCount,
      invalidStops: invalidStopsCount,
      attractionsInRange: nearbyAttractions.length,
      cityName
    });

    // Sort by distance and relevance
    const sortedAttractions = nearbyAttractions.sort((a, b) => {
      // Prioritize major stops and closer attractions
      const aScore = (a.is_major_stop ? -10 : 0) + a.distanceFromCity;
      const bScore = (b.is_major_stop ? -10 : 0) + b.distanceFromCity;
      return aScore - bScore;
    });

    const finalResult = sortedAttractions.slice(0, this.MAX_ATTRACTIONS);

    StructuredLogger.logAttractionSearch('attraction_search_complete', {
      searchId,
      finalCount: finalResult.length,
      attractions: finalResult.map(a => ({ 
        name: a.name, 
        distance: a.distanceFromCity.toFixed(1),
        type: a.attractionType 
      }))
    });

    return finalResult;
  }
  
  /**
   * Check if a stop is an attraction type
   */
  private static isAttractionType(stop: TripStop): boolean {
    const attractionCategories = [
      'attraction',
      'historic_site',
      'restaurant',
      'lodging',
      'museum',
      'park',
      'scenic_view',
      'roadside_attraction',
      'drive_in'
    ];
    
    return attractionCategories.includes(stop.category);
  }
  
  /**
   * Categorize attraction by type
   */
  private static categorizeAttraction(stop: TripStop): 'attraction' | 'hidden_gem' | 'drive_in' | 'waypoint' {
    if (stop.category === 'drive_in') return 'drive_in';
    if (stop.category === 'roadside_attraction' || stop.is_major_stop) return 'attraction';
    return 'hidden_gem';
  }
  
  /**
   * Get attraction icon based on category
   */
  static getAttractionIcon(attraction: NearbyAttraction): string {
    switch (attraction.attractionType) {
      case 'drive_in': return '🎬';
      case 'attraction': return '🏛️';
      case 'hidden_gem': return '💎';
      case 'waypoint': return '📍';
      default: return '🎯';
    }
  }
  
  /**
   * Get attraction type label
   */
  static getAttractionTypeLabel(attraction: NearbyAttraction): string {
    switch (attraction.attractionType) {
      case 'drive_in': return 'Drive-In Theater';
      case 'attraction': return 'Major Attraction';
      case 'hidden_gem': return 'Hidden Gem';
      case 'waypoint': return 'Route 66 Waypoint';
      default: return 'Attraction';
    }
  }

  /**
   * Developer debug method - get detailed information about city matching
   */
  static async debugCitySearch(cityName: string, state: string): Promise<any> {
    try {
      const allStops = await SupabaseDataService.fetchAllStops();
      const destinationCities = allStops.filter(stop => stop.category === 'destination_city');
      
      return {
        searchTerm: `${cityName}, ${state}`,
        totalStops: allStops.length,
        destinationCities: destinationCities.length,
        availableCities: destinationCities.map(city => ({
          name: city.name,
          city_name: city.city_name,
          state: city.state,
          coordinates: { lat: city.latitude, lng: city.longitude }
        })),
        exactMatch: this.findDestinationCity(allStops, cityName, state),
        fallbackCoordinates: FallbackGeocodingService.getFallbackCoordinates(cityName, state)
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        searchTerm: `${cityName}, ${state}`
      };
    }
  }
}
