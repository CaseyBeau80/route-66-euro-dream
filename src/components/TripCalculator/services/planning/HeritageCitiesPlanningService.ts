import { TripStop } from '../../types/TripStop';
import { TripPlan, DailySegment } from './TripPlanTypes';
import { CityDisplayService } from '../utils/CityDisplayService';
import { Route66SequenceEnforcer } from './Route66SequenceEnforcer';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';

export class HeritageCitiesPlanningService {
  private static readonly MAX_HERITAGE_DRIVE_TIME = 10; // Allow longer drives for heritage
  private static readonly HERITAGE_PRIORITY_THRESHOLD = 70; // Heritage score threshold

  // Define iconic Route 66 heritage cities with their heritage scores
  private static readonly HERITAGE_CITIES = new Map([
    ['Chicago', { score: 100, tier: 'iconic' }],
    ['Springfield', { score: 85, tier: 'major' }],
    ['St. Louis', { score: 95, tier: 'iconic' }],
    ['Lebanon', { score: 75, tier: 'major' }],
    ['Joplin', { score: 80, tier: 'major' }],
    ['Oklahoma City', { score: 90, tier: 'iconic' }],
    ['Amarillo', { score: 85, tier: 'major' }],
    ['Tucumcari', { score: 75, tier: 'major' }],
    ['Santa Fe', { score: 85, tier: 'major' }],
    ['Albuquerque', { score: 90, tier: 'iconic' }],
    ['Gallup', { score: 75, tier: 'major' }],
    ['Winslow', { score: 80, tier: 'major' }],
    ['Flagstaff', { score: 85, tier: 'major' }],
    ['Kingman', { score: 75, tier: 'major' }],
    ['Barstow', { score: 70, tier: 'significant' }],
    ['Needles', { score: 70, tier: 'significant' }],
    ['Los Angeles', { score: 100, tier: 'iconic' }],
    ['Santa Monica', { score: 95, tier: 'iconic' }]
  ]);

  static async planHeritageCitiesTrip(
    startCityName: string,
    endCityName: string,
    tripDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🏛️ HERITAGE CITIES PLANNING: ${startCityName} to ${endCityName} in ${tripDays} days`);
    
    // Use enhanced city finding
    const startStop = CityDisplayService.findCityInStops(startCityName, allStops);
    const endStop = CityDisplayService.findCityInStops(endCityName, allStops);
    
    if (!startStop || !endStop) {
      throw new Error(`Could not find start (${startCityName}) or end (${endCityName}) locations`);
    }

    console.log(`✅ FOUND: ${startStop.name} → ${endStop.name}`);

    // Filter to heritage cities and major destinations
    const heritageCities = this.filterToHeritageCities(allStops);
    console.log(`🏛️ Found ${heritageCities.length} heritage cities from ${allStops.length} total stops`);

    // Enforce Route 66 sequence
    const sequenceResult = Route66SequenceEnforcer.enforceSequenceDirection(
      startStop, endStop, heritageCities
    );

    if (!sequenceResult.isValidRoute) {
      throw new Error('Invalid Route 66 sequence');
    }

    // Select heritage destinations (prioritizes heritage value over distance)
    const intermediateDestinations = this.selectHeritageDestinations(
      startStop, endStop, sequenceResult.validStops, tripDays - 1
    );

    // Build segments allowing longer drives for heritage cities
    const segments = this.buildHeritageSegments(
      startStop, endStop, intermediateDestinations, tripDays
    );

    const totalDistance = this.calculateTotalDistance(startStop, endStop);
    const totalDrivingTime = segments.reduce((total, seg) => total + seg.driveTimeHours, 0);

    return {
      id: `trip-${Date.now()}`,
      startCity: startCityName,
      endCity: endCityName,
      startDate: new Date(),
      totalDays: tripDays,
      totalDistance,
      totalMiles: Math.round(totalDistance),
      totalDrivingTime,
      segments,
      dailySegments: segments,
      lastUpdated: new Date()
    };
  }

  /**
   * Filter stops to heritage cities with high heritage value
   */
  private static filterToHeritageCities(allStops: TripStop[]): TripStop[] {
    return allStops.filter(stop => {
      // Check if it's a recognized heritage city
      const heritage = this.getHeritageInfo(stop.name);
      if (heritage && heritage.score >= this.HERITAGE_PRIORITY_THRESHOLD) {
        return true;
      }
      
      // Also include stops marked as major heritage destinations
      if (stop.is_major_stop && stop.category === 'destination_city') {
        return true;
      }
      
      // Include stops with heritage keywords in description
      if (stop.description && this.hasHeritageKeywords(stop.description)) {
        return true;
      }
      
      return false;
    });
  }

  /**
   * Get heritage information for a city
   */
  private static getHeritageInfo(cityName: string): { score: number; tier: string } | null {
    const cleanName = cityName.replace(/,.*$/, '').trim();
    return this.HERITAGE_CITIES.get(cleanName) || null;
  }

  /**
   * Check if description contains heritage keywords
   */
  private static hasHeritageKeywords(description: string): boolean {
    const keywords = [
      'historic', 'heritage', 'route 66', 'mother road', 'iconic', 
      'landmark', 'birthplace', 'original', 'classic', 'famous'
    ];
    const lowerDesc = description.toLowerCase();
    return keywords.some(keyword => lowerDesc.includes(keyword));
  }

  /**
   * Select heritage destinations prioritizing heritage value over distance
   */
  private static selectHeritageDestinations(
    startStop: TripStop,
    endStop: TripStop,
    heritageCities: TripStop[],
    neededDestinations: number
  ): TripStop[] {
    console.log(`🏛️ SELECTING HERITAGE DESTINATIONS: ${neededDestinations} from ${heritageCities.length} heritage cities`);
    
    if (heritageCities.length === 0) return [];

    // Score all heritage cities by heritage value and route position
    const scoredCities = heritageCities.map(city => {
      const heritage = this.getHeritageInfo(city.name);
      const heritageScore = heritage ? heritage.score : 50;
      
      // Calculate position score (prefer cities that are well-distributed along route)
      const distanceFromStart = this.calculateTotalDistance(startStop, city);
      const totalRouteDistance = this.calculateTotalDistance(startStop, endStop);
      const positionScore = this.calculatePositionScore(distanceFromStart, totalRouteDistance, neededDestinations);
      
      // Heritage cities get priority, but position matters too
      const totalScore = (heritageScore * 0.7) + (positionScore * 0.3);
      
      return {
        city,
        heritageScore,
        positionScore,
        totalScore,
        tier: heritage?.tier || 'standard'
      };
    });

    // Sort by total score and select top destinations
    scoredCities.sort((a, b) => b.totalScore - a.totalScore);
    
    console.log(`🏛️ Top heritage candidates:`);
    scoredCities.slice(0, Math.min(5, scoredCities.length)).forEach((candidate, index) => {
      console.log(`   ${index + 1}. ${candidate.city.name}: heritage=${candidate.heritageScore} (${candidate.tier}), position=${candidate.positionScore.toFixed(1)}, total=${candidate.totalScore.toFixed(1)}`);
    });

    // Select the best heritage destinations
    const selectedDestinations = scoredCities
      .slice(0, neededDestinations)
      .map(scored => scored.city);

    // Sort selected destinations by route order
    return this.sortByRouteOrder(startStop, endStop, selectedDestinations);
  }

  /**
   * Calculate position score for even distribution along route
   */
  private static calculatePositionScore(
    distanceFromStart: number,
    totalDistance: number,
    totalDestinations: number
  ): number {
    if (totalDestinations === 0) return 50;
    
    const idealSegmentLength = totalDistance / (totalDestinations + 1);
    const idealPositions = Array.from({ length: totalDestinations }, (_, i) => 
      idealSegmentLength * (i + 1)
    );
    
    // Find closest ideal position
    const closestIdealDistance = Math.min(...idealPositions.map(pos => 
      Math.abs(distanceFromStart - pos)
    ));
    
    // Score based on how close to an ideal position
    const maxDeviation = idealSegmentLength * 0.5;
    return Math.max(0, 100 - (closestIdealDistance / maxDeviation) * 100);
  }

  /**
   * Sort destinations by route order (west to east or east to west)
   */
  private static sortByRouteOrder(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[]
  ): TripStop[] {
    const direction = endStop.longitude < startStop.longitude ? 'west' : 'east';
    
    return destinations.sort((a, b) => {
      if (direction === 'west') {
        return b.longitude - a.longitude; // Descending longitude (westward)
      } else {
        return a.longitude - b.longitude; // Ascending longitude (eastward)
      }
    });
  }

  /**
   * Build segments optimized for heritage cities (allows longer drives)
   */
  private static buildHeritageSegments(
    startStop: TripStop,
    endStop: TripStop,
    intermediateDestinations: TripStop[],
    tripDays: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    const allStops = [startStop, ...intermediateDestinations, endStop];
    
    console.log(`🏗️ BUILDING HERITAGE SEGMENTS: ${allStops.length} stops for ${tripDays} days`);

    for (let i = 0; i < allStops.length - 1; i++) {
      const currentStop = allStops[i];
      const nextStop = allStops[i + 1];
      const day = i + 1;

      const distance = this.calculateTotalDistance(currentStop, nextStop);
      // Allow longer drives for heritage cities, but cap at 10 hours
      const driveTimeHours = Math.min(distance / 50, this.MAX_HERITAGE_DRIVE_TIME);
      
      const heritage = this.getHeritageInfo(nextStop.name);
      const heritageInfo = heritage ? ` (Heritage: ${heritage.score}/100, ${heritage.tier})` : '';

      console.log(`🏛️ Day ${day}: ${currentStop.name} → ${nextStop.name} = ${distance.toFixed(0)}mi, ${driveTimeHours.toFixed(1)}h${heritageInfo}`);

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(nextStop)}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(nextStop),
        distance,
        driveTimeHours,
        drivingTime: driveTimeHours,
        approximateMiles: Math.round(distance),
        destination: {
          city: nextStop.city_name || nextStop.name,
          state: nextStop.state
        },
        recommendedStops: [{
          stopId: nextStop.id,
          id: nextStop.id,
          name: nextStop.name,
          description: nextStop.description || `Visit ${nextStop.name}`,
          latitude: nextStop.latitude,
          longitude: nextStop.longitude,
          category: nextStop.category,
          city_name: nextStop.city_name,
          state: nextStop.state,
          city: nextStop.city || nextStop.city_name || nextStop.name
        }],
        attractions: [],
        notes: `Day ${day}: Heritage city drive from ${currentStop.name} to ${nextStop.name}${heritageInfo}`,
        recommendations: []
      };

      segments.push(segment);
    }

    return segments;
  }

  private static calculateTotalDistance(startStop: TripStop, endStop: TripStop): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(endStop.latitude - startStop.latitude);
    const dLon = this.toRad(endStop.longitude - startStop.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(startStop.latitude)) * Math.cos(this.toRad(endStop.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance);
  }

  private static toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
