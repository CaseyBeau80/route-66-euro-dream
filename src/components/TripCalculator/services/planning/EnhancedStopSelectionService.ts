
// Stub implementation - recommendation system removed
export class EnhancedStopSelectionService {
  static async selectStopsForSegment(
    startCity: string,
    endCity: string,
    segmentDay: number,
    maxStops: number
  ): Promise<any[]> {
    console.log(`🚫 EnhancedStopSelectionService: Stop selection disabled for ${startCity} → ${endCity}`);
    return [];
  }

  static async enhanceStopsWithRecommendations(
    stops: any[],
    context: string
  ): Promise<any[]> {
    console.log('🚫 EnhancedStopSelectionService: Stop enhancement disabled');
    return stops;
  }

  static async auditStopSelection(
    startCity: string,
    endCity: string,
    selectedStops: any[]
  ): Promise<void> {
    console.log(`🚫 EnhancedStopSelectionService: Audit disabled for ${startCity} → ${endCity}`);
  }
}
