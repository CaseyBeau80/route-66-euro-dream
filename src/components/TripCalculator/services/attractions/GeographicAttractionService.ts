import { SupabaseDataService, TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { AttractionSearchResult, AttractionSearchStatus } from './AttractionSearchResult';

export interface NearbyAttraction extends TripStop {
  distanceFromCity: number;
  attractionType: 'attraction' | 'hidden_gem' | 'drive_in' | 'waypoint';
}

// Enhanced timeout utility for async operations
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

// Enhanced fallback geocoding service for missing cities
class FallbackGeocodingService {
  private static readonly ROUTE_66_CITY_COORDINATES: Record<string, { lat: number; lng: number; state: string }> = {
    // Illinois
    'chicago': { lat: 41.8781, lng: -87.6298, state: 'IL' },
    'springfield': { lat: 39.7817, lng: -89.6501, state: 'IL' },
    'joliet': { lat: 41.5250, lng: -88.0817, state: 'IL' },
    'pontiac': { lat: 40.8808, lng: -88.6298, state: 'IL' },
    'bloomington': { lat: 40.4842, lng: -88.9934, state: 'IL' },
    'normal': { lat: 40.5142, lng: -88.9906, state: 'IL' },
    'litchfield': { lat: 39.1753, lng: -89.6542, state: 'IL' },
    
    // Missouri
    'st. louis': { lat: 38.6270, lng: -90.1994, state: 'MO' },
    'saint louis': { lat: 38.6270, lng: -90.1994, state: 'MO' },
    'springfield': { lat: 37.2153, lng: -93.2982, state: 'MO' },
    'joplin': { lat: 37.0842, lng: -94.5133, state: 'MO' },
    'carthage': { lat: 37.1765, lng: -94.3100, state: 'MO' },
    'webb city': { lat: 37.1467, lng: -94.4663, state: 'MO' },
    'rolla': { lat: 37.9514, lng: -91.7735, state: 'MO' },
    'lebanon': { lat: 37.6806, lng: -92.6638, state: 'MO' },
    
    // Kansas
    'galena': { lat: 37.0756, lng: -94.6363, state: 'KS' },
    'riverton': { lat: 37.0967, lng: -94.7052, state: 'KS' },
    'baxter springs': { lat: 37.0267, lng: -94.7360, state: 'KS' },
    
    // Oklahoma
    'tulsa': { lat: 36.1540, lng: -95.9928, state: 'OK' },
    'oklahoma city': { lat: 35.4676, lng: -97.5164, state: 'OK' },
    'sapulpa': { lat: 35.9937, lng: -96.1142, state: 'OK' },
    'stroud': { lat: 35.7487, lng: -96.6572, state: 'OK' },
    'chandler': { lat: 35.7017, lng: -96.8806, state: 'OK' },
    'arcadia': { lat: 35.6576, lng: -97.3239, state: 'OK' },
    'edmond': { lat: 35.6528, lng: -97.4781, state: 'OK' },
    'bethany': { lat: 35.5151, lng: -97.6364, state: 'OK' },
    'yukon': { lat: 35.5067, lng: -97.7625, state: 'OK' },
    'el reno': { lat: 35.5320, lng: -97.9550, state: 'OK' },
    'clinton': { lat: 35.5151, lng: -98.9670, state: 'OK' },
    'elk city': { lat: 35.4112, lng: -99.4043, state: 'OK' },
    'sayre': { lat: 35.2887, lng: -99.6407, state: 'OK' },
    'erick': { lat: 35.2134, lng: -99.8687, state: 'OK' },
    
    // Texas
    'amarillo': { lat: 35.2220, lng: -101.8313, state: 'TX' },
    'shamrock': { lat: 35.2187, lng: -100.2496, state: 'TX' },
    'mclean': { lat: 35.2281, lng: -100.5999, state: 'TX' },
    'groom': { lat: 35.2043, lng: -101.1085, state: 'TX' },
    'vega': { lat: 35.2443, lng: -102.4296, state: 'TX' },
    'adrian': { lat: 35.2742, lng: -102.6769, state: 'TX' },
    'glenrio': { lat: 35.2889, lng: -103.0380, state: 'TX' },
    
    // New Mexico
    'albuquerque': { lat: 35.0844, lng: -106.6504, state: 'NM' },
    'tucumcari': { lat: 35.1719, lng: -103.7249, state: 'NM' },
    'santa rosa': { lat: 34.9387, lng: -104.6819, state: 'NM' },
    'moriarty': { lat: 35.0120, lng: -106.0492, state: 'NM' },
    'grants': { lat: 35.1472, lng: -107.8520, state: 'NM' },
    'gallup': { lat: 35.5281, lng: -108.7426, state: 'NM' },
    
    // Arizona
    'flagstaff': { lat: 35.1983, lng: -111.6513, state: 'AZ' },
    'holbrook': { lat: 34.9011, lng: -110.1662, state: 'AZ' },
    'winslow': { lat: 35.0242, lng: -110.6974, state: 'AZ' },
    'williams': { lat: 35.2494, lng: -112.1910, state: 'AZ' },
    'ash fork': { lat: 35.2242, lng: -112.4829, state: 'AZ' },
    'seligman': { lat: 35.3258, lng: -112.8741, state: 'AZ' },
    'peach springs': { lat: 35.5336, lng: -113.4239, state: 'AZ' },
    'kingman': { lat: 35.1895, lng: -114.0530, state: 'AZ' },
    'oatman': { lat: 35.0239, lng: -114.3825, state: 'AZ' },
    'topock': { lat: 34.7208, lng: -114.4881, state: 'AZ' },
    
    // California
    'los angeles': { lat: 34.0522, lng: -118.2437, state: 'CA' },
    'santa monica': { lat: 34.0089, lng: -118.4973, state: 'CA' },
    'needles': { lat: 34.8481, lng: -114.6147, state: 'CA' },
    'amboy': { lat: 34.5583, lng: -115.7458, state: 'CA' },
    'barstow': { lat: 34.8958, lng: -117.0228, state: 'CA' },
    'victorville': { lat: 34.5362, lng: -117.2911, state: 'CA' },
    'san bernardino': { lat: 34.1083, lng: -117.2898, state: 'CA' },
    'rialto': { lat: 34.1064, lng: -117.3703, state: 'CA' },
    'fontana': { lat: 34.0922, lng: -117.4353, state: 'CA' },
    'rancho cucamonga': { lat: 34.1064, lng: -117.5931, state: 'CA' },
    'upland': { lat: 34.0975, lng: -117.6481, state: 'CA' },
    'claremont': { lat: 34.0967, lng: -117.7197, state: 'CA' },
    'la verne': { lat: 34.1089, lng: -117.7681, state: 'CA' },
    'san dimas': { lat: 34.1067, lng: -117.8067, state: 'CA' },
    'glendora': { lat: 34.1361, lng: -117.8653, state: 'CA' },
    'azusa': { lat: 34.1336, lng: -117.9076, state: 'CA' },
    'duarte': { lat: 34.1394, lng: -117.9773, state: 'CA' },
    'monrovia': { lat: 34.1442, lng: -118.0019, state: 'CA' },
    'arcadia': { lat: 34.1397, lng: -118.0353, state: 'CA' },
    'pasadena': { lat: 34.1478, lng: -118.1445, state: 'CA' }
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
  private static readonly TIMEOUT_MS = 8000; // Reduced to 8 seconds for faster feedback
  private static readonly MAX_ATTRACTIONS = 8;

  /**
   * Find attractions near a destination city with enhanced error recovery
   */
  static async findAttractionsNearCity(
    cityName: string,
    state: string,
    maxDistance: number = 50 // miles
  ): Promise<AttractionSearchResult> {
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
        status: result.status,
        attractionsFound: result.attractions.length,
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

      // Enhanced error recovery - try fallback coordinates
      if (error instanceof Error && error.message.includes('timeout')) {
        try {
          const fallbackResult = await this.tryFallbackSearch(cityName, state, maxDistance, searchId);
          if (fallbackResult) {
            return fallbackResult;
          }
        } catch (fallbackError) {
          console.warn('⚠️ Fallback search also failed:', fallbackError);
        }
      }

      // Return structured error response
      return {
        status: AttractionSearchStatus.ERROR,
        attractions: [],
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        citySearched: cityName,
        stateSearched: state
      };
    }
  }

  private static async tryFallbackSearch(
    cityName: string,
    state: string,
    maxDistance: number,
    searchId: string
  ): Promise<AttractionSearchResult | null> {
    console.log(`🔄 Attempting fallback search for ${cityName}, ${state}`);
    
    const fallbackCoords = FallbackGeocodingService.getFallbackCoordinates(cityName, state);
    
    if (fallbackCoords) {
      try {
        // Quick database fetch with shorter timeout
        const allStops = await TimeoutUtility.withTimeout(
          SupabaseDataService.fetchAllStops(),
          3000,
          'Fallback database fetch timeout'
        );

        const attractions = this.findAttractionsNearCoordinates(
          fallbackCoords.latitude,
          fallbackCoords.longitude,
          allStops,
          maxDistance,
          cityName,
          searchId
        );

        return {
          status: attractions.length > 0 ? AttractionSearchStatus.SUCCESS : AttractionSearchStatus.NO_ATTRACTIONS,
          attractions,
          message: attractions.length > 0 ? 
            `Found ${attractions.length} attractions using fallback coordinates (recovered from timeout)` :
            `No attractions found within ${maxDistance} miles using fallback coordinates`,
          citySearched: cityName,
          stateSearched: state
        };
      } catch (fallbackError) {
        console.error('❌ Fallback search failed:', fallbackError);
        return null;
      }
    }
    
    return null;
  }

  private static async performAttractionSearch(
    cityName: string,
    state: string,
    maxDistance: number,
    searchId: string
  ): Promise<AttractionSearchResult> {
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

        const attractions = this.findAttractionsNearCoordinates(
          fallbackCoords.latitude,
          fallbackCoords.longitude,
          allStops,
          maxDistance,
          cityName,
          searchId
        );

        return {
          status: attractions.length > 0 ? AttractionSearchStatus.SUCCESS : AttractionSearchStatus.NO_ATTRACTIONS,
          attractions,
          message: attractions.length > 0 ? 
            `Found ${attractions.length} attractions using fallback coordinates` :
            `No attractions found within ${maxDistance} miles using fallback coordinates`,
          citySearched: cityName,
          stateSearched: state
        };
      }

      StructuredLogger.logAttractionSearch('destination_city_not_found', {
        searchId,
        cityName,
        state,
        availableCities: allStops
          .filter(stop => stop.category === 'destination_city')
          .map(stop => `${stop.city_name}, ${stop.state}`)
      }, 'warn');

      return {
        status: AttractionSearchStatus.CITY_NOT_FOUND,
        attractions: [],
        message: `City "${cityName}, ${state}" not found in database`,
        citySearched: cityName,
        stateSearched: state
      };
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
      
      return {
        status: AttractionSearchStatus.ERROR,
        attractions: [],
        message: `Invalid data for ${cityName}: ${validation.issues.join(', ')}`,
        citySearched: cityName,
        stateSearched: state
      };
    }

    StructuredLogger.logAttractionSearch('destination_city_found', {
      searchId,
      city: destinationCity.name,
      coordinates: {
        lat: destinationCity.latitude,
        lng: destinationCity.longitude
      }
    });

    const attractions = this.findAttractionsNearCoordinates(
      destinationCity.latitude,
      destinationCity.longitude,
      allStops,
      maxDistance,
      cityName,
      searchId,
      destinationCity.id
    );

    return {
      status: attractions.length > 0 ? AttractionSearchStatus.SUCCESS : AttractionSearchStatus.NO_ATTRACTIONS,
      attractions,
      message: attractions.length > 0 ? 
        `Found ${attractions.length} attractions near ${cityName}` :
        `No attractions found within ${maxDistance} miles of ${cityName}`,
      citySearched: cityName,
      stateSearched: state
    };
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
   * Enhanced developer debug method with comprehensive city information
   */
  static async debugCitySearch(cityName: string, state: string): Promise<any> {
    try {
      const allStops = await SupabaseDataService.fetchAllStops();
      const destinationCities = allStops.filter(stop => stop.category === 'destination_city');
      
      // Enhanced search matching
      const normalizedCityName = cityName.toLowerCase().trim();
      const normalizedState = state.toLowerCase().trim();

      const exactMatches = destinationCities.filter(city => 
        city.city_name?.toLowerCase() === normalizedCityName &&
        city.state?.toLowerCase() === normalizedState
      );

      const partialMatches = destinationCities.filter(city => 
        city.state?.toLowerCase() === normalizedState &&
        (city.city_name?.toLowerCase().includes(normalizedCityName) ||
         normalizedCityName.includes(city.city_name?.toLowerCase() || ''))
      );

      const nameOnlyMatches = destinationCities.filter(city => 
        city.name?.toLowerCase() === normalizedCityName ||
        city.city_name?.toLowerCase() === normalizedCityName
      );
      
      return {
        searchTerm: `${cityName}, ${state}`,
        normalizedSearch: `${normalizedCityName}, ${normalizedState}`,
        totalStops: allStops.length,
        destinationCities: destinationCities.length,
        
        matchingResults: {
          exactMatches: exactMatches.map(city => ({
            id: city.id,
            name: city.name,
            city_name: city.city_name,
            state: city.state,
            coordinates: { lat: city.latitude, lng: city.longitude }
          })),
          partialMatches: partialMatches.map(city => ({
            id: city.id,
            name: city.name,
            city_name: city.city_name,
            state: city.state,
            coordinates: { lat: city.latitude, lng: city.longitude }
          })),
          nameOnlyMatches: nameOnlyMatches.map(city => ({
            id: city.id,
            name: city.name,
            city_name: city.city_name,
            state: city.state,
            coordinates: { lat: city.latitude, lng: city.longitude }
          }))
        },
        
        fallbackCoordinates: FallbackGeocodingService.getFallbackCoordinates(cityName, state),
        
        availableCitiesInState: destinationCities
          .filter(city => city.state?.toLowerCase() === normalizedState)
          .map(city => ({
            name: city.name,
            city_name: city.city_name,
            state: city.state,
            coordinates: { lat: city.latitude, lng: city.longitude }
          })),
          
        allAvailableStates: [...new Set(destinationCities.map(city => city.state))].sort()
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        searchTerm: `${cityName}, ${state}`
      };
    }
  }
}
