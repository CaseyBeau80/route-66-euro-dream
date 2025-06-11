
import { SupabaseDataService, TripStop } from '../data/SupabaseDataService';
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
  private static readonly TIMEOUT_MS = 8000;
  private static readonly MAX_ATTRACTIONS = 8;

  /**
   * Find attractions near a destination city with enhanced error recovery
   */
  static async findAttractionsNearCity(
    cityName: string,
    state: string,
    maxDistance: number = 50
  ): Promise<AttractionSearchResult> {
    const searchId = `${cityName}-${state}-${Date.now()}`;
    
    AttractionSearchLogger.logAttractionSearch('findAttractionsNearCity_start', {
      searchId,
      cityName,
      state,
      maxDistance
    });

    try {
      const result = await TimeoutUtility.withTimeout(
        this.performAttractionSearch(cityName, state, maxDistance, searchId),
        this.TIMEOUT_MS,
        `Attraction search timed out after ${this.TIMEOUT_MS}ms for ${cityName}, ${state}`
      );

      AttractionSearchLogger.logAttractionSearch('findAttractionsNearCity_success', {
        searchId,
        status: result.status,
        attractionsFound: result.attractions.length,
        cityName,
        state
      });

      return result;

    } catch (error) {
      AttractionSearchLogger.logAttractionSearch('findAttractionsNearCity_error', {
        searchId,
        cityName,
        state,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      }, 'error');

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
    
    const fallbackCoords = FallbackCoordinatesService.getFallbackCoordinates(cityName, state);
    
    if (fallbackCoords) {
      try {
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
