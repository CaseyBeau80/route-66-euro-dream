
// Stub implementation - recommendation system removed
export class StopScoringService {
  static scoreStop(stop: any): number {
    console.log('🚫 StopScoringService: Scoring system disabled');
    return 0;
  }

  static rankStops(stops: any[]): any[] {
    console.log('🚫 StopScoringService: Ranking system disabled');
    return [];
  }

  static filterByScore(stops: any[], minScore: number): any[] {
    console.log('🚫 StopScoringService: Score filtering disabled');
    return [];
  }
}
