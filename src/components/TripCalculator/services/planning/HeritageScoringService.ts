
import { TripStop } from '../../types/TripStop';

export interface HeritageScore {
  heritageScore: number;
  heritageTier: string;
}

export class HeritageScoringService {
  static calculateHeritageScore(stop: TripStop): HeritageScore {
    // Simple heritage scoring based on category and population
    let score = 50; // Base score
    let tier = 'standard';

    if (stop.category === 'destination_city') {
      score += 30;
      tier = 'significant';
    }
    if (stop.category === 'historic_landmark') {
      score += 40;
      tier = 'major';
    }

    return {
      heritageScore: Math.min(100, score),
      heritageTier: tier
    };
  }

  static filterByHeritageTier(stops: TripStop[], minTier: string): TripStop[] {
    return stops.filter(stop => {
      const score = this.calculateHeritageScore(stop);
      return score.heritageScore >= 60; // Simple threshold
    });
  }

  static getHeritageStatistics(stops: TripStop[]): {
    averageHeritageScore: number;
    tierDistribution: Record<string, number>;
    topHeritageCities: Array<{ city: string; score: number }>;
  } {
    const scores = stops.map(stop => this.calculateHeritageScore(stop));
    const avgScore = scores.reduce((sum, s) => sum + s.heritageScore, 0) / scores.length || 0;
    
    const tierDistribution: Record<string, number> = {};
    scores.forEach(score => {
      tierDistribution[score.heritageTier] = (tierDistribution[score.heritageTier] || 0) + 1;
    });

    const topCities = stops
      .map(stop => ({ city: stop.name, score: this.calculateHeritageScore(stop).heritageScore }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return {
      averageHeritageScore: avgScore,
      tierDistribution,
      topHeritageCities: topCities
    };
  }
}
