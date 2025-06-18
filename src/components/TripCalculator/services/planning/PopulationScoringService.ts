
import { TripStop } from '../../types/TripStop';

export interface PopulationScore {
  rawPopulation: number;
  normalizedScore: number;
  weight: number;
  tier: string; // Add missing tier property
}

export class PopulationScoringService {
  static calculatePopulationScore(stop: TripStop): PopulationScore {
    // Mock population based on category
    let population = 1000;
    let tier = 'small';
    
    if (stop.category === 'destination_city') {
      population = 50000;
      tier = 'major';
    } else if (stop.category === 'historic_landmark') {
      population = 5000;
      tier = 'medium';
    }

    return {
      rawPopulation: population,
      normalizedScore: Math.min(100, population / 1000),
      weight: 0.3,
      tier
    };
  }

  static filterByPopulationThreshold(
    stops: TripStop[], 
    style: string, 
    strict: boolean = false
  ): TripStop[] {
    const threshold = strict ? 5000 : 1000;
    return stops.filter(stop => {
      const score = this.calculatePopulationScore(stop);
      return score.rawPopulation >= threshold;
    });
  }

  static calculateWeightedScore(
    stop: TripStop,
    baseScore: number,
    populationWeight: number
  ): number {
    const popScore = this.calculatePopulationScore(stop);
    return baseScore * (1 - populationWeight) + popScore.normalizedScore * populationWeight;
  }

  static getPopulationStatistics(stops: TripStop[]): {
    average: number;
    range: { min: number; max: number };
    total: number;
  } {
    if (stops.length === 0) {
      return { average: 0, range: { min: 0, max: 0 }, total: 0 };
    }

    const populations = stops.map(stop => this.calculatePopulationScore(stop).rawPopulation);
    const total = populations.reduce((sum, pop) => sum + pop, 0);
    const average = total / populations.length;
    const min = Math.min(...populations);
    const max = Math.max(...populations);

    return {
      average,
      range: { min, max },
      total
    };
  }
}
