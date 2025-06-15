
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';

export class RouteGeographyService {
  // Define Route 66 states in geographic order from east to west
  private static readonly ROUTE_66_STATES = [
    { code: 'il', name: 'illinois' },
    { code: 'mo', name: 'missouri' },
    { code: 'ks', name: 'kansas' },
    { code: 'ok', name: 'oklahoma' },
    { code: 'tx', name: 'texas' },
    { code: 'nm', name: 'new mexico' },
    { code: 'az', name: 'arizona' },
    { code: 'ca', name: 'california' }
  ];

  /**
   * Check if a stop is geographically between two cities on Route 66
   */
  static isStopBetweenCities(
    stop: TripStop,
    startCity: string,
    endCity: string
  ): boolean {
    const startState = this.extractStateFromCity(startCity);
    const endState = this.extractStateFromCity(endCity);
    const stopState = stop.state?.toLowerCase();

    if (!startState || !endState || !stopState) {
      return false;
    }

    const startIndex = this.getRoute66StateIndex(startState);
    const endIndex = this.getRoute66StateIndex(endState);
    const stopIndex = this.getRoute66StateIndex(stopState);

    if (startIndex === -1 || endIndex === -1 || stopIndex === -1) {
      return false;
    }

    // Check if stop is between start and end states
    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    return stopIndex >= minIndex && stopIndex <= maxIndex;
  }

  /**
   * Calculate geographic relevance score for a stop relative to a route segment
   */
  static calculateGeographicRelevance(
    stop: TripStop,
    segment: DailySegment
  ): number {
    let score = 0;

    const stopCity = stop.city_name?.toLowerCase() || '';
    const startCity = segment.startCity?.toLowerCase() || '';
    const endCity = segment.endCity?.toLowerCase() || '';

    // Exact city matches get highest score
    if (stopCity === startCity || stopCity === endCity) {
      score += 50;
    }

    // Partial city matches get good score
    if (stopCity.includes(startCity) || startCity.includes(stopCity) ||
        stopCity.includes(endCity) || endCity.includes(stopCity)) {
      score += 30;
    }

    // Route corridor bonus
    if (this.isStopBetweenCities(stop, segment.startCity, segment.endCity || '')) {
      score += 20;
    }

    // Same state bonus
    const startState = this.extractStateFromCity(segment.startCity);
    const endState = this.extractStateFromCity(segment.endCity || '');
    const stopState = stop.state?.toLowerCase();

    if ((startState && stopState === startState) || (endState && stopState === endState)) {
      score += 15;
    }

    return score;
  }

  /**
   * Extract state code from city string
   */
  private static extractStateFromCity(cityString: string): string | null {
    if (!cityString || !cityString.includes(',')) {
      return null;
    }

    const parts = cityString.split(',');
    if (parts.length < 2) {
      return null;
    }

    const stateString = parts[1].trim().toLowerCase();
    
    // Try to match against known Route 66 states
    for (const state of this.ROUTE_66_STATES) {
      if (stateString === state.code || stateString === state.name) {
        return state.code;
      }
    }

    return stateString;
  }

  /**
   * Get the index of a state in the Route 66 progression
   */
  private static getRoute66StateIndex(stateCode: string): number {
    return this.ROUTE_66_STATES.findIndex(state => 
      state.code === stateCode.toLowerCase() || state.name === stateCode.toLowerCase()
    );
  }

  /**
   * Check if a state is on the Route 66 corridor
   */
  static isRoute66State(stateCode: string): boolean {
    return this.getRoute66StateIndex(stateCode) !== -1;
  }
}
