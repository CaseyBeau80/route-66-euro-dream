import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';

export interface HeritageScore {
  city: string;
  state: string;
  heritageScore: number; // 0-100 scale
  heritageTier: 'iconic' | 'major' | 'significant' | 'notable' | 'standard';
  heritageReasons: string[];
}

export interface HeritageCity {
  name: string;
  state: string;
  heritageScore: number;
  heritageTier: 'iconic' | 'major' | 'significant' | 'notable' | 'standard';
  reasons: string[];
}

export class HeritageScoringService {
  // Heritage scoring database for Route 66 cities
  private static readonly HERITAGE_CITIES: HeritageCity[] = [
    // Iconic Cities (90-100 points)
    {
      name: 'Chicago',
      state: 'Illinois',
      heritageScore: 100,
      heritageTier: 'iconic',
      reasons: ['Eastern terminus of Route 66', 'Birthplace of the Mother Road', 'Grant Park starting point']
    },
    {
      name: 'Santa Monica',
      state: 'California',
      heritageScore: 100,
      heritageTier: 'iconic',
      reasons: ['Western terminus of Route 66', 'Santa Monica Pier endpoint', 'End of the Trail sign']
    },
    {
      name: 'St. Louis',
      state: 'Missouri',
      heritageScore: 95,
      heritageTier: 'iconic',
      reasons: ['Gateway to the West', 'Route 66 State Park', 'Chain of Rocks Bridge', 'Historic Route 66 significance']
    },
    {
      name: 'Tulsa',
      state: 'Oklahoma',
      heritageScore: 90,
      heritageTier: 'iconic',
      reasons: ['Oil capital heritage', 'Route 66 museums', 'Historic downtown', 'Cyrus Avery connection']
    },

    // Major Heritage Cities (75-89 points)
    {
      name: 'Oklahoma City',
      state: 'Oklahoma',
      heritageScore: 85,
      heritageTier: 'major',
      reasons: ['State capital', 'Route 66 Museum', 'Stockyards heritage', 'Western heritage']
    },
    {
      name: 'Amarillo',
      state: 'Texas',
      heritageScore: 85,
      heritageTier: 'major',
      reasons: ['Cadillac Ranch', 'Big Texan Steak Ranch', 'Route 66 Historic District']
    },
    {
      name: 'Albuquerque',
      state: 'New Mexico',
      heritageScore: 80,
      heritageTier: 'major',
      reasons: ['Old Town heritage', 'Native American culture', 'Route 66 Central Avenue']
    },
    {
      name: 'Flagstaff',
      state: 'Arizona',
      heritageScore: 80,
      heritageTier: 'major',
      reasons: ['Gateway to Grand Canyon', 'Historic downtown', 'Mountain town heritage']
    },
    {
      name: 'Springfield',
      state: 'Illinois',
      heritageScore: 75,
      heritageTier: 'major',
      reasons: ['State capital', 'Abraham Lincoln heritage', 'Route 66 history']
    },

    // Significant Heritage Cities (60-74 points)
    {
      name: 'Joplin',
      state: 'Missouri',
      heritageScore: 70,
      heritageTier: 'significant',
      reasons: ['Mining town heritage', 'Route 66 crossroads', 'Historic downtown']
    },
    {
      name: 'Gallup',
      state: 'New Mexico',
      heritageScore: 70,
      heritageTier: 'significant',
      reasons: ['Trading post heritage', 'Native American culture', 'Route 66 gateway']
    },
    {
      name: 'Kingman',
      state: 'Arizona',
      heritageScore: 70,
      heritageTier: 'significant',
      reasons: ['Route 66 Museum', 'Desert heritage', 'Mining history']
    },
    {
      name: 'Williams',
      state: 'Arizona',
      heritageScore: 65,
      heritageTier: 'significant',
      reasons: ['Last Route 66 town bypassed', 'Grand Canyon gateway', 'Historic railroad']
    },
    {
      name: 'Tucumcari',
      state: 'New Mexico',
      heritageScore: 65,
      heritageTier: 'significant',
      reasons: ['Route 66 Tonight slogan', 'Vintage neon signs', 'Classic motels']
    },
    {
      name: 'Santa Fe',
      state: 'New Mexico',
      heritageScore: 60,
      heritageTier: 'significant',
      reasons: ['State capital', 'Historic plaza', 'Native American heritage']
    },

    // Notable Heritage Cities (45-59 points)
    {
      name: 'Barstow',
      state: 'California',
      heritageScore: 55,
      heritageTier: 'notable',
      reasons: ['Railroad heritage', 'Desert crossroads', 'Route 66 history']
    },
    {
      name: 'Needles',
      state: 'California',
      heritageScore: 50,
      heritageTier: 'notable',
      reasons: ['Desert gateway', 'Railroad town', 'Route 66 heritage']
    },
    {
      name: 'Seligman',
      state: 'Arizona',
      heritageScore: 50,
      heritageTier: 'notable',
      reasons: ['Birthplace of Historic Route 66', 'Angel Delgadillo heritage', 'Classic roadside']
    },
    {
      name: 'Holbrook',
      state: 'Arizona',
      heritageScore: 50,
      heritageTier: 'notable',
      reasons: ['Wigwam Motel', 'Petrified Forest gateway', 'Route 66 heritage']
    },
    {
      name: 'Winslow',
      state: 'Arizona',
      heritageScore: 45,
      heritageTier: 'notable',
      reasons: ['Eagles song fame', 'Historic downtown', 'Route 66 heritage']
    },
    {
      name: 'Shamrock',
      state: 'Texas',
      heritageScore: 45,
      heritageTier: 'notable',
      reasons: ['Irish heritage', 'Water tower landmark', 'Route 66 history']
    }
  ];

  /**
   * Calculate heritage score for a destination city
   */
  static calculateHeritageScore(city: TripStop): HeritageScore {
    const cityName = this.normalizeCityName(city.city_name || city.name);
    const stateName = this.normalizeStateName(city.state);

    // Find matching heritage city
    const heritageCity = this.HERITAGE_CITIES.find(hCity => 
      this.normalizeCityName(hCity.name) === cityName && 
      this.normalizeStateName(hCity.state) === stateName
    );

    if (heritageCity) {
      return {
        city: cityName,
        state: stateName,
        heritageScore: heritageCity.heritageScore,
        heritageTier: heritageCity.heritageTier,
        heritageReasons: heritageCity.reasons
      };
    }

    // Default score for cities not in heritage database
    return {
      city: cityName,
      state: stateName,
      heritageScore: 25, // Low but not zero for Route 66 cities
      heritageTier: 'standard',
      heritageReasons: ['Route 66 waypoint']
    };
  }

  /**
   * Get heritage weight multiplier for trip style
   */
  static getHeritageWeight(tripStyle: 'balanced' | 'destination-focused'): number {
    switch (tripStyle) {
      case 'destination-focused':
        return 0.6; // 60% weight for heritage in destination-focused trips
      case 'balanced':
        return 0.3; // 30% weight for heritage in balanced trips
      default:
        return 0.3;
    }
  }

  /**
   * Calculate heritage-enhanced destination score
   */
  static calculateHeritageEnhancedScore(
    city: TripStop,
    baseScore: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): number {
    const heritageScore = this.calculateHeritageScore(city);
    const heritageWeight = this.getHeritageWeight(tripStyle);
    
    // Combine base score with heritage score
    const weightedBaseScore = baseScore * (1 - heritageWeight);
    const weightedHeritageScore = heritageScore.heritageScore * heritageWeight;
    
    return weightedBaseScore + weightedHeritageScore;
  }

  /**
   * Filter cities by heritage tier
   */
  static filterByHeritageTier(
    cities: TripStop[],
    minTier: 'iconic' | 'major' | 'significant' | 'notable' | 'standard' = 'notable'
  ): TripStop[] {
    const tierValues = {
      'iconic': 5,
      'major': 4,
      'significant': 3,
      'notable': 2,
      'standard': 1
    };

    const minTierValue = tierValues[minTier];

    return cities.filter(city => {
      const heritageScore = this.calculateHeritageScore(city);
      const cityTierValue = tierValues[heritageScore.heritageTier];
      return cityTierValue >= minTierValue;
    });
  }

  /**
   * Compare two cities by heritage-enhanced scoring
   */
  static compareByHeritageScore(
    cityA: TripStop,
    cityB: TripStop,
    baseScoreA: number = 50,
    baseScoreB: number = 50,
    tripStyle: 'balanced' | 'destination-focused' = 'destination-focused'
  ): number {
    const scoreA = this.calculateHeritageEnhancedScore(cityA, baseScoreA, tripStyle);
    const scoreB = this.calculateHeritageEnhancedScore(cityB, baseScoreB, tripStyle);
    
    return scoreB - scoreA; // Higher score first
  }

  /**
   * Get heritage statistics for a set of cities
   */
  static getHeritageStatistics(cities: TripStop[]): {
    total: number;
    averageHeritageScore: number;
    tierDistribution: Record<string, number>;
    topHeritageCities: { city: string; score: number; tier: string }[];
  } {
    if (cities.length === 0) {
      return {
        total: 0,
        averageHeritageScore: 0,
        tierDistribution: {},
        topHeritageCities: []
      };
    }

    const heritageScores = cities.map(city => this.calculateHeritageScore(city));
    const totalScore = heritageScores.reduce((sum, score) => sum + score.heritageScore, 0);
    const averageHeritageScore = totalScore / cities.length;

    // Calculate tier distribution
    const tierDistribution: Record<string, number> = {};
    heritageScores.forEach(score => {
      tierDistribution[score.heritageTier] = (tierDistribution[score.heritageTier] || 0) + 1;
    });

    // Get top heritage cities
    const topHeritageCities = heritageScores
      .sort((a, b) => b.heritageScore - a.heritageScore)
      .slice(0, 5)
      .map(score => ({
        city: score.city,
        score: score.heritageScore,
        tier: score.heritageTier
      }));

    return {
      total: cities.length,
      averageHeritageScore,
      tierDistribution,
      topHeritageCities
    };
  }

  /**
   * Normalize city name for comparison
   */
  private static normalizeCityName(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Normalize state name for comparison
   */
  private static normalizeStateName(state: string): string {
    const stateMap: Record<string, string> = {
      'illinois': 'illinois',
      'il': 'illinois',
      'missouri': 'missouri',
      'mo': 'missouri',
      'kansas': 'kansas',
      'ks': 'kansas',
      'oklahoma': 'oklahoma',
      'ok': 'oklahoma',
      'texas': 'texas',
      'tx': 'texas',
      'new mexico': 'new mexico',
      'nm': 'new mexico',
      'arizona': 'arizona',
      'az': 'arizona',
      'california': 'california',
      'ca': 'california'
    };

    const normalized = state.toLowerCase().trim();
    return stateMap[normalized] || normalized;
  }

  /**
   * Get all heritage cities for debugging
   */
  static getAllHeritageCities(): HeritageCity[] {
    return [...this.HERITAGE_CITIES];
  }
}
