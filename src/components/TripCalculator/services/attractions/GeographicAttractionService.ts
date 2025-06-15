
import { TripStop } from '../../types/TripStop';
import { SupabaseDataService } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { AttractionSearchResult, AttractionSearchStatus } from './AttractionSearchResult';
import { FallbackCoordinatesService } from './FallbackCoordinatesService';
import { AttractionValidationService } from './AttractionValidationService';
import { AttractionSearchLogger } from './AttractionSearchLogger';
import { TimeoutUtility } from './TimeoutUtility';

export interface NearbyAttraction extends TripStop {
  distanceFromCity: number;
  attractionType: 'attraction' | 'hidden_gem' | 'drive_in' | 'waypoint';
}

export class GeographicAttractionService {
  private static readonly TIMEOUT_MS = 6000; // Reduced from 8000ms
  private static readonly MAX_ATTRACTIONS = 8;

  /**
   * Find attractions near a destination city with enhanced error recovery and data verification
   */
  static async findAttractionsNearCity(
    cityName: string,
    state: string,
    maxDistance: number = 50
  ): Promise<AttractionSearchResult> {
    const searchId = `${cityName}-${state}-${Date.now()}`;
    
    console.log(`🔍 Starting attraction search for "${cityName}, ${state}" (Search ID: ${searchId})`);
    
    AttractionSearchLogger.logAttractionSearch('findAttractionsNearCity_start', {
      searchId,
      cityName,
      state,
      maxDistance,
      timeout: this.TIMEOUT_MS
    });

    try {
      const result = await TimeoutUtility.withTimeout(
        this.performEnhancedAttractionSearch(cityName, state, maxDistance, searchId),
        this.TIMEOUT_MS,
        `Attraction search timed out after ${this.TIMEOUT_MS}ms for ${cityName}, ${state}`
      );

      console.log(`✅ Attraction search completed for "${cityName}, ${state}":`, {
        status: result.status,
        attractionsFound: result.attractions.length,
        message: result.message
      });

      AttractionSearchLogger.logAttractionSearch('findAttractionsNearCity_success', {
        searchId,
        status: result.status,
        attractionsFound: result.attractions.length,
        cityName,
        state
      });

      return result;

    } catch (error) {
      console.error(`❌ Attraction search failed for "${cityName}, ${state}":`, error);
      
      AttractionSearchLogger.logAttractionSearch('findAttractionsNearCity_error', {
        searchId,
        cityName,
        state,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      }, 'error');

      // Enhanced fallback handling
      if (error instanceof Error && error.message.includes('timeout')) {
        console.log(`🔄 Attempting fallback search for "${cityName}, ${state}"`);
        try {
          const fallbackResult = await this.tryFallbackSearch(cityName, state, maxDistance, searchId);
          if (fallbackResult) {
            console.log(`✅ Fallback search succeeded for "${cityName}, ${state}"`);
            return fallbackResult;
          }
        } catch (fallbackError) {
          console.warn(`⚠️ Fallback search also failed for "${cityName}, ${state}":`, fallbackError);
        }
      }

      return {
        status: AttractionSearchStatus.ERROR,
        attractions: [],
        message: error instanceof Error ? error.message : 'Unknown error occurred during search',
        citySearched: cityName,
        stateSearched: state
      };
    }
  }

  private static async performEnhancedAttractionSearch(
    cityName: string,
    state: string,
    maxDistance: number,
    searchId: string
  ): Promise<AttractionSearchResult> {
    console.log(`📊 Fetching all stops from database for search "${searchId}"`);
    
    const allStops = await TimeoutUtility.withTimeout(
      SupabaseDataService.fetchAllStops(),
      4000, // 4 second timeout for database fetch
      'Database fetch timeout'
    );

    console.log(`📊 Database fetch complete for search "${searchId}":`, {
      totalStops: allStops.length,
      destinationCities: allStops.filter(stop => stop.category === 'destination_city').length,
      attractions: allStops.filter(stop => this.isAttractionType(stop)).length
    });

    AttractionSearchLogger.logAttractionSearch('database_fetch_complete', {
      searchId,
      totalStops: allStops.length,
      destinationCities: allStops.filter(stop => stop.category === 'destination_city').length
    });

    // Enhanced city search with better normalization
    const destinationCity = this.findDestinationCityEnhanced(allStops, cityName, state, searchId);
    
    if (!destinationCity) {
      console.warn(`🔍 No destination city found for "${cityName}, ${state}" - trying fallback coordinates`);
      
      const fallbackCoords = FallbackCoordinatesService.getFallbackCoordinates(cityName, state);
      
      if (fallbackCoords) {
        console.log(`🔄 Using fallback coordinates for "${cityName}, ${state}":`, fallbackCoords);
        
        AttractionSearchLogger.logAttractionSearch('using_fallback_coordinates', {
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
            `Found ${attractions.length} attractions using fallback coordinates for ${cityName}` :
            `No attractions found within ${maxDistance} miles of ${cityName} using fallback coordinates`,
          citySearched: cityName,
          stateSearched: state
        };
      }

      // Log available cities for debugging
      const availableCities = allStops
        .filter(stop => stop.category === 'destination_city')
        .map(stop => `${stop.city_name || stop.name}, ${stop.state}`)
        .sort();

      console.warn(`🔍 Available destination cities in database:`, availableCities.slice(0, 10));

      AttractionSearchLogger.logAttractionSearch('destination_city_not_found', {
        searchId,
        cityName,
        state,
        availableCitiesCount: availableCities.length,
        sampleCities: availableCities.slice(0, 5)
      }, 'warn');

      return {
        status: AttractionSearchStatus.CITY_NOT_FOUND,
        attractions: [],
        message: `City "${cityName}, ${state}" not found in database. Available cities: ${availableCities.length}`,
        citySearched: cityName,
        stateSearched: state
      };
    }

    console.log(`✅ Destination city found for "${cityName}, ${state}":`, {
      foundCity: destinationCity.name,
      cityName: destinationCity.city_name,
      state: destinationCity.state,
      coordinates: { lat: destinationCity.latitude, lng: destinationCity.longitude }
    });

    // Enhanced validation
    const validation = AttractionValidationService.validateDestinationCity(destinationCity, cityName);
    if (!validation.isValid) {
      console.error(`❌ Invalid destination city data for "${cityName}, ${state}":`, validation.issues);
      
      AttractionSearchLogger.logAttractionSearch('destination_city_invalid', {
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

    AttractionSearchLogger.logAttractionSearch('destination_city_found', {
      searchId,
      city: destinationCity.name,
      coordinates: {
        lat: destinationCity.latitude,
        lng: destinationCity.longitude
      }
    });

    console.log(`🎯 Searching for attractions near coordinates (${destinationCity.latitude}, ${destinationCity.longitude})`);

    const attractions = this.findAttractionsNearCoordinates(
      destinationCity.latitude,
      destinationCity.longitude,
      allStops,
      maxDistance,
      cityName,
      searchId,
      destinationCity.id
    );

    console.log(`🎯 Attraction search completed for "${cityName}, ${state}":`, {
      attractionsFound: attractions.length,
      searchRadius: maxDistance,
      destinationCoords: { lat: destinationCity.latitude, lng: destinationCity.longitude }
    });

    return {
      status: attractions.length > 0 ? AttractionSearchStatus.SUCCESS : AttractionSearchStatus.NO_ATTRACTIONS,
      attractions,
      message: attractions.length > 0 ? 
        `Found ${attractions.length} attractions within ${maxDistance} miles of ${cityName}` :
        `No attractions found within ${maxDistance} miles of ${cityName}`,
      citySearched: cityName,
      stateSearched: state
    };
  }

  private static findDestinationCityEnhanced(
    allStops: TripStop[], 
    cityName: string, 
    state: string, 
    searchId: string
  ): TripStop | undefined {
    const normalizedCityName = cityName.toLowerCase().trim().replace(/[.,]/g, '');
    const normalizedState = state.toLowerCase().trim();

    console.log(`🔍 Enhanced city search for "${cityName}, ${state}" (normalized: "${normalizedCityName}, ${normalizedState}")`);

    const destinationCities = allStops.filter(stop => stop.category === 'destination_city');
    console.log(`📊 Searching among ${destinationCities.length} destination cities`);

    // 1. Exact match - city name and state
    let destinationCity = destinationCities.find(stop => {
      const stopCityName = (stop.city_name || stop.name || '').toLowerCase().trim().replace(/[.,]/g, '');
      const stopState = (stop.state || '').toLowerCase().trim();
      return stopCityName === normalizedCityName && stopState === normalizedState;
    });

    if (destinationCity) {
      console.log(`✅ Exact match found: ${destinationCity.name} (${destinationCity.city_name}, ${destinationCity.state})`);
      return destinationCity;
    }

    // 2. Partial match within same state
    destinationCity = destinationCities.find(stop => {
      const stopCityName = (stop.city_name || stop.name || '').toLowerCase().trim().replace(/[.,]/g, '');
      const stopState = (stop.state || '').toLowerCase().trim();
      return stopState === normalizedState && (
        stopCityName.includes(normalizedCityName) || 
        normalizedCityName.includes(stopCityName)
      );
    });

    if (destinationCity) {
      console.log(`✅ Partial match found in state: ${destinationCity.name} (${destinationCity.city_name}, ${destinationCity.state})`);
      return destinationCity;
    }

    // 3. Name-only match (any state)
    destinationCity = destinationCities.find(stop => {
      const stopCityName = (stop.city_name || stop.name || '').toLowerCase().trim().replace(/[.,]/g, '');
      return stopCityName === normalizedCityName;
    });

    if (destinationCity) {
      console.log(`✅ Name-only match found: ${destinationCity.name} (${destinationCity.city_name}, ${destinationCity.state})`);
      return destinationCity;
    }

    // 4. Log closest matches for debugging
    const closeMatches = destinationCities
      .filter(stop => {
        const stopCityName = (stop.city_name || stop.name || '').toLowerCase().trim();
        return stopCityName.includes(normalizedCityName.slice(0, 4)) || 
               normalizedCityName.includes(stopCityName.slice(0, 4));
      })
      .slice(0, 5);

    console.warn(`🔍 No exact match found. Close matches:`, closeMatches.map(stop => 
      `${stop.name} (${stop.city_name}, ${stop.state})`
    ));

    return undefined;
  }

  private static async tryFallbackSearch(
    cityName: string,
    state: string,
    maxDistance: number,
    searchId: string
  ): Promise<AttractionSearchResult | null> {
    console.log(`🔄 Attempting fallback search for ${cityName}, ${state}`);
    
    const fallbackCoords = FallbackCoordinatesService.getFallbackCoordinates(cityName, state);
    
    if (fallbackCoords) {
      try {
        const allStops = await TimeoutUtility.withTimeout(
          SupabaseDataService.fetchAllStops(),
          2000, // Shorter timeout for fallback
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
    const allStops = await TimeoutUtility.withTimeout(
      SupabaseDataService.fetchAllStops(),
      5000,
      'Database fetch timeout'
    );

    AttractionSearchLogger.logAttractionSearch('database_fetch_complete', {
      searchId,
      totalStops: allStops.length
    });

    const destinationCity = this.findDestinationCity(allStops, cityName, state);
    
    if (!destinationCity) {
      const fallbackCoords = FallbackCoordinatesService.getFallbackCoordinates(cityName, state);
      
      if (fallbackCoords) {
        AttractionSearchLogger.logAttractionSearch('using_fallback_coordinates', {
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

      AttractionSearchLogger.logAttractionSearch('destination_city_not_found', {
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

    const validation = AttractionValidationService.validateDestinationCity(destinationCity, cityName);
    if (!validation.isValid) {
      AttractionSearchLogger.logAttractionSearch('destination_city_invalid', {
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

    AttractionSearchLogger.logAttractionSearch('destination_city_found', {
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
      if (excludeStopId && stop.id === excludeStopId) continue;

      const validation = AttractionValidationService.validateStopData(stop);
      if (!validation.isValid) {
        invalidStopsCount++;
        continue;
      }
      validStopsCount++;

      const distance = DistanceCalculationService.calculateDistance(
        latitude,
        longitude,
        stop.latitude,
        stop.longitude
      );

      if (distance <= maxDistance && this.isAttractionType(stop)) {
        nearbyAttractions.push({
          ...stop,
          distanceFromCity: distance,
          attractionType: this.categorizeAttraction(stop)
        });
      }
    }

    console.log(`🎯 Attraction filtering complete for "${cityName}":`, {
      searchId,
      validStops: validStopsCount,
      invalidStops: invalidStopsCount,
      attractionsInRange: nearbyAttractions.length,
      radius: maxDistance
    });

    AttractionSearchLogger.logAttractionSearch('attraction_filtering_complete', {
      searchId,
      validStops: validStopsCount,
      invalidStops: invalidStopsCount,
      attractionsInRange: nearbyAttractions.length,
      cityName
    });

    const sortedAttractions = nearbyAttractions.sort((a, b) => {
      const aScore = (a.is_major_stop ? -10 : 0) + a.distanceFromCity;
      const bScore = (b.is_major_stop ? -10 : 0) + b.distanceFromCity;
      return aScore - bScore;
    });

    const finalResult = sortedAttractions.slice(0, this.MAX_ATTRACTIONS);

    AttractionSearchLogger.logAttractionSearch('attraction_search_complete', {
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
  
  private static categorizeAttraction(stop: TripStop): 'attraction' | 'hidden_gem' | 'drive_in' | 'waypoint' {
    if (stop.category === 'drive_in') return 'drive_in';
    if (stop.category === 'roadside_attraction' || stop.is_major_stop) return 'attraction';
    return 'hidden_gem';
  }
  
  static getAttractionIcon(attraction: NearbyAttraction): string {
    switch (attraction.attractionType) {
      case 'drive_in': return '🎬';
      case 'attraction': return '🏛️';
      case 'hidden_gem': return '💎';
      case 'waypoint': return '📍';
      default: return '🎯';
    }
  }
  
  static getAttractionTypeLabel(attraction: NearbyAttraction): string {
    switch (attraction.attractionType) {
      case 'drive_in': return 'Drive-In Theater';
      case 'attraction': return 'Major Attraction';
      case 'hidden_gem': return 'Hidden Gem';
      case 'waypoint': return 'Route 66 Waypoint';
      default: return 'Attraction';
    }
  }

  static async debugCitySearch(cityName: string, state: string): Promise<any> {
    try {
      const allStops = await SupabaseDataService.fetchAllStops();
      const destinationCities = allStops.filter(stop => stop.category === 'destination_city');
      
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
        
        fallbackCoordinates: FallbackCoordinatesService.getFallbackCoordinates(cityName, state),
        
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
