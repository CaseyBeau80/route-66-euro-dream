
import { TripStop } from '../../types/TripStop';
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
  private static readonly TIMEOUT_MS = 6000;
  private static readonly MAX_ATTRACTIONS = 8;

  /**
   * SIMPLIFIED: Attraction search disabled - returns empty results
   */
  static async findAttractionsNearCity(
    cityName: string,
    state: string,
    maxDistance: number = 50
  ): Promise<AttractionSearchResult> {
    console.log(`🚫 GeographicAttractionService: Attraction search disabled for "${cityName}, ${state}"`);
    
    return {
      status: AttractionSearchStatus.NO_ATTRACTIONS,
      attractions: [],
      message: `Attraction search disabled - recommended stops functionality removed`,
      citySearched: cityName,
      stateSearched: state
    };
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
    return {
      searchTerm: `${cityName}, ${state}`,
      message: 'Debug functionality disabled - recommendation system removed',
      totalStops: 0,
      destinationCities: 0,
      availableStates: []
    };
  }
}
