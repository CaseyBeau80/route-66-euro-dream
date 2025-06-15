
export interface AttractionLimitResult {
  limitedAttractions: any[];
  hasMoreAttractions: boolean;
  totalAttractions: number;
  remainingCount: number;
  limitApplied: number;
}

export class AttractionLimitingService {
  private static readonly MAX_ATTRACTIONS = 8;

  static getMaxAttractions(): number {
    return this.MAX_ATTRACTIONS;
  }

  static limitAttractions(
    attractions: any[],
    context: string,
    requestedMax?: number
  ): AttractionLimitResult {
    const effectiveMax = Math.min(requestedMax || this.MAX_ATTRACTIONS, this.MAX_ATTRACTIONS);
    const limitedAttractions = attractions.slice(0, effectiveMax);
    
    console.log(`🎯 AttractionLimitingService: Limiting attractions for ${context}`, {
      total: attractions.length,
      limited: limitedAttractions.length,
      effectiveMax
    });

    return {
      limitedAttractions,
      hasMoreAttractions: attractions.length > effectiveMax,
      totalAttractions: attractions.length,
      remainingCount: Math.max(0, attractions.length - effectiveMax),
      limitApplied: effectiveMax
    };
  }

  static validateAttractionLimit(attractions: any[], context: string): boolean {
    const isValid = attractions.length <= this.MAX_ATTRACTIONS;
    if (!isValid) {
      console.error(`🚨 Attraction limit validation failed for ${context}: ${attractions.length} > ${this.MAX_ATTRACTIONS}`);
    }
    return isValid;
  }
}
