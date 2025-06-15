
// Stub implementation - recommendation system removed
export interface RecommendedStop {
  id: string;
  name: string;
  relevanceScore: number;
  originalStop?: any;
}

export class StopRecommendationService {
  static async getRecommendedStops(): Promise<RecommendedStop[]> {
    console.log('🚫 StopRecommendationService: Recommendation system disabled');
    return [];
  }
}
