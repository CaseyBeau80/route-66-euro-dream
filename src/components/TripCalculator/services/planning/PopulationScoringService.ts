
import { TripStop } from '../../types/TripStop';

export interface PopulationScore {
  rawPopulation: number;
  normalizedScore: number;
  weight: number;
}

export class PopulationScoringService {
  static calculatePopulationScore(stop: TripStop): PopulationScore {
    // Mock population based on category
    let population = 1000;
    
    if (stop.category === 'destination_city') {
      population = 50000;
    } else if (stop.category === 'historic_landmark') {
      population = 5000;
    }

    return {
      rawPopulation: population,
      normalizedScore: Math.min(100, population / 1000),
      weight: 0.3
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
}
