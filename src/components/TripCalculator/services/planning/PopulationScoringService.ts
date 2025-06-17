
import { TripStop } from '../../types/TripStop';

export interface PopulationScore {
  rawPopulation: number;
  normalizedScore: number; // 0-100 scale
  tier: 'major' | 'medium' | 'small' | 'minor';
  weight: number; // Multiplier for scoring
}

export interface PopulationTierConfig {
  tier: 'major' | 'medium' | 'small' | 'minor';
  minPopulation: number;
  maxPopulation: number;
  weight: number;
  description: string;
}

export class PopulationScoringService {
  // Population tiers based on typical Route 66 city sizes
  private static readonly POPULATION_TIERS: PopulationTierConfig[] = [
    {
      tier: 'major',
      minPopulation: 100000,
      maxPopulation: Number.MAX_VALUE,
      weight: 2.0,
      description: 'Major metropolitan areas (100k+)'
    },
    {
      tier: 'medium',
      minPopulation: 25000,
      maxPopulation: 99999,
      weight: 1.5,
      description: 'Medium cities (25k-100k)'
    },
    {
      tier: 'small',
      minPopulation: 5000,
      maxPopulation: 24999,
      weight: 1.0,
      description: 'Small cities (5k-25k)'
    },
    {
      tier: 'minor',
      minPopulation: 0,
      maxPopulation: 4999,
      weight: 0.7,
      description: 'Small towns (under 5k)'
    }
  ];

  // Reference populations for normalization (based on Route 66 cities)
  private static readonly REFERENCE_POPULATIONS = {
    chicago: 2700000,      // Largest Route 66 city
    losAngeles: 4000000,   // Largest terminus
    stLouis: 300000,       // Major heritage city
    oklahomacity: 700000,  // Major central city
    albuquerque: 560000,   // Major southwestern city
    flagstaff: 76000,      // Medium mountain city
    amarillo: 200000,      // Medium plains city
    gallup: 22000,         // Small heritage town
    williams: 3000,        // Small historic town
    seligman: 456          // Minor historic town
  };

  /**
   * Calculate population score for a destination city
   */
  static calculatePopulationScore(city: TripStop): PopulationScore {
    const population = city.population || 0;
    
    // Determine tier
    const tier = this.getPopulationTier(population);
    const tierConfig = this.POPULATION_TIERS.find(t => t.tier === tier)!;
    
    // Calculate normalized score (0-100)
    const normalizedScore = this.normalizePopulationScore(population);
    
    return {
      rawPopulation: population,
      normalizedScore,
      tier,
      weight: tierConfig.weight
    };
  }

  /**
   * Get population tier for a given population
   */
  private static getPopulationTier(population: number): 'major' | 'medium' | 'small' | 'minor' {
    for (const config of this.POPULATION_TIERS) {
      if (population >= config.minPopulation && population <= config.maxPopulation) {
        return config.tier;
      }
    }
    return 'minor'; // Default fallback
  }

  /**
   * Normalize population to 0-100 scale using logarithmic scaling
   */
  private static normalizePopulationScore(population: number): number {
    if (population <= 0) return 0;
    
    // Use logarithmic scaling to handle wide population ranges
    const maxRef = this.REFERENCE_POPULATIONS.losAngeles;
    const minRef = this.REFERENCE_POPULATIONS.seligman;
    
    // Logarithmic normalization
    const logPop = Math.log10(Math.max(population, 1));
    const logMax = Math.log10(maxRef);
    const logMin = Math.log10(minRef);
    
    const normalized = ((logPop - logMin) / (logMax - logMin)) * 100;
    
    return Math.max(0, Math.min(100, normalized));
  }

  /**
   * Calculate weighted population score for destination selection
   */
  static calculateWeightedScore(
    city: TripStop,
    baseScore: number,
    populationWeight: number = 0.3
  ): number {
    const popScore = this.calculatePopulationScore(city);
    
    // Combine base score with population score
    const weightedPopulationContribution = popScore.normalizedScore * popScore.weight * populationWeight;
    const weightedBaseScore = baseScore * (1 - populationWeight);
    
    return weightedBaseScore + weightedPopulationContribution;
  }

  /**
   * Compare two cities by population-enhanced scoring
   */
  static compareByPopulationScore(
    cityA: TripStop,
    cityB: TripStop,
    baseScoreA: number = 50,
    baseScoreB: number = 50,
    populationWeight: number = 0.3
  ): number {
    const scoreA = this.calculateWeightedScore(cityA, baseScoreA, populationWeight);
    const scoreB = this.calculateWeightedScore(cityB, baseScoreB, populationWeight);
    
    return scoreB - scoreA; // Higher score first
  }

  /**
   * FIXED: Filter cities by minimum population threshold for trip style with graceful fallbacks
   */
  static filterByPopulationThreshold(
    cities: TripStop[],
    tripStyle: 'balanced' | 'destination-focused',
    strictMode: boolean = false
  ): TripStop[] {
    console.log('🔍 POPULATION FILTER: Starting filter', {
      totalCities: cities.length,
      tripStyle,
      strictMode,
      citiesWithPopulation: cities.filter(c => c.population && c.population > 0).length
    });

    const thresholds = this.getPopulationThresholds(tripStyle, strictMode);
    
    // First, try to filter by population threshold
    const filteredCities = cities.filter(city => {
      const population = city.population || 0;
      const meetsThreshold = population >= thresholds.minimum;
      
      if (!meetsThreshold && population > 0) {
        console.log(`📊 POPULATION FILTER: ${city.name} excluded (${population} < ${thresholds.minimum})`);
      }
      
      return meetsThreshold;
    });
    
    console.log('🔍 POPULATION FILTER: After threshold filtering', {
      originalCount: cities.length,
      filteredCount: filteredCities.length,
      threshold: thresholds.minimum
    });
    
    // GRACEFUL FALLBACK: If filtering removes too many cities, be more lenient
    if (filteredCities.length < 3) {
      console.warn('⚠️ POPULATION FILTER: Too few cities after filtering, applying graceful fallback');
      
      // Try with a lower threshold first
      const lowerThreshold = Math.max(500, thresholds.minimum / 2);
      const fallbackCities = cities.filter(city => {
        const population = city.population || 0;
        return population >= lowerThreshold;
      });
      
      if (fallbackCities.length >= 3) {
        console.log(`✅ POPULATION FILTER: Using lower threshold (${lowerThreshold})`, {
          resultCount: fallbackCities.length
        });
        return fallbackCities;
      }
      
      // If still too few, include cities without population data (assume they're valid)
      const allValidCities = cities.filter(city => {
        const population = city.population || 0;
        return population >= lowerThreshold || !city.population; // Include cities without population data
      });
      
      console.log('✅ POPULATION FILTER: Using fallback with missing data inclusion', {
        resultCount: allValidCities.length,
        explanation: 'Including cities without population data to ensure trip planning works'
      });
      
      return allValidCities;
    }
    
    console.log('✅ POPULATION FILTER: Normal filtering successful', {
      resultCount: filteredCities.length
    });
    
    return filteredCities;
  }

  /**
   * Get population thresholds for different trip styles
   */
  private static getPopulationThresholds(
    tripStyle: 'balanced' | 'destination-focused',
    strictMode: boolean
  ): { minimum: number; preferred: number } {
    const baseThresholds = {
      'balanced': { minimum: 1000, preferred: 10000 },
      'destination-focused': { minimum: 5000, preferred: 25000 }
    };
    
    const thresholds = baseThresholds[tripStyle];
    
    if (strictMode) {
      return {
        minimum: thresholds.preferred,
        preferred: thresholds.preferred * 2
      };
    }
    
    return thresholds;
  }

  /**
   * Get population tier configuration for debugging
   */
  static getPopulationTiers(): PopulationTierConfig[] {
    return [...this.POPULATION_TIERS];
  }

  static getPopulationStatistics(cities: TripStop[]): {
    total: number;
    average: number;
    median: number;
    range: { min: number; max: number };
    tierDistribution: Record<string, number>;
  } {
    const populations = cities.map(city => city.population || 0).sort((a, b) => a - b);
    
    if (populations.length === 0) {
      return {
        total: 0,
        average: 0,
        median: 0,
        range: { min: 0, max: 0 },
        tierDistribution: {}
      };
    }
    
    const total = cities.length;
    const average = populations.reduce((sum, pop) => sum + pop, 0) / total;
    const median = populations[Math.floor(populations.length / 2)];
    const range = { min: populations[0], max: populations[populations.length - 1] };
    
    // Calculate tier distribution
    const tierDistribution: Record<string, number> = {};
    cities.forEach(city => {
      const score = this.calculatePopulationScore(city);
      tierDistribution[score.tier] = (tierDistribution[score.tier] || 0) + 1;
    });
    
    return {
      total,
      average,
      median,
      range,
      tierDistribution
    };
  }
}
