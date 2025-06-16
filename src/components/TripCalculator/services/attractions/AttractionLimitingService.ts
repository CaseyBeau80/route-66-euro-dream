
/**
 * Centralized service for enforcing consistent 3-attraction limits across all views
 * This service ensures that no matter where attractions are displayed, the limit is enforced
 */

import { NearbyAttraction } from './GeographicAttractionService';

export interface AttractionLimitResult {
  limitedAttractions: NearbyAttraction[];
  totalAttractions: number;
  hasMoreAttractions: boolean;
  remainingCount: number;
  limitApplied: number;
  context: string;
}

export class AttractionLimitingService {
  // CRITICAL: Absolute maximum attractions - never change this value
  private static readonly ABSOLUTE_MAX_ATTRACTIONS = 3;
  
  /**
   * Apply strict 3-attraction limit with comprehensive logging and validation
   */
  static limitAttractions(
    attractions: NearbyAttraction[], 
    context: string,
    requestedMax?: number
  ): AttractionLimitResult {
    // Validate input
    if (!Array.isArray(attractions)) {
      console.error(`🚨 AttractionLimitingService: Invalid attractions array in ${context}`, attractions);
      return {
        limitedAttractions: [],
        totalAttractions: 0,
        hasMoreAttractions: false,
        remainingCount: 0,
        limitApplied: this.ABSOLUTE_MAX_ATTRACTIONS,
        context
      };
    }

    const totalAttractions = attractions.length;
    
    // CRITICAL: Triple enforcement of 3-attraction limit
    const enforcedMax = Math.min(
      requestedMax ?? this.ABSOLUTE_MAX_ATTRACTIONS,
      this.ABSOLUTE_MAX_ATTRACTIONS
    );
    
    // Quadruple safety: slice twice to be absolutely sure
    const firstSlice = attractions.slice(0, enforcedMax);
    const limitedAttractions = firstSlice.slice(0, this.ABSOLUTE_MAX_ATTRACTIONS);
    
    const actualCount = limitedAttractions.length;
    const hasMoreAttractions = totalAttractions > actualCount;
    const remainingCount = Math.max(0, totalAttractions - actualCount);
    
    // Comprehensive logging
    console.log(`🔍 AttractionLimitingService: ${context} ENFORCED limiting:`, {
      context,
      totalAttractions,
      requestedMax,
      enforcedMax,
      absoluteMax: this.ABSOLUTE_MAX_ATTRACTIONS,
      firstSliceLength: firstSlice.length,
      finalCount: actualCount,
      hasMoreAttractions,
      remainingCount,
      limitingWorking: actualCount <= this.ABSOLUTE_MAX_ATTRACTIONS
    });
    
    // Final emergency validation
    if (actualCount > this.ABSOLUTE_MAX_ATTRACTIONS) {
      console.error(`🚨 CRITICAL: Attraction limit breach detected in ${context}!`, {
        actualCount,
        absoluteMax: this.ABSOLUTE_MAX_ATTRACTIONS,
        context
      });
      
      // Emergency slice as absolute last resort
      const emergencySlice = limitedAttractions.slice(0, this.ABSOLUTE_MAX_ATTRACTIONS);
      return {
        limitedAttractions: emergencySlice,
        totalAttractions,
        hasMoreAttractions: true,
        remainingCount: totalAttractions - emergencySlice.length,
        limitApplied: this.ABSOLUTE_MAX_ATTRACTIONS,
        context: `${context}-EMERGENCY`
      };
    }
    
    return {
      limitedAttractions,
      totalAttractions,
      hasMoreAttractions,
      remainingCount,
      limitApplied: this.ABSOLUTE_MAX_ATTRACTIONS,
      context
    };
  }
  
  /**
   * Get the absolute maximum attractions allowed
   */
  static getMaxAttractions(): number {
    return this.ABSOLUTE_MAX_ATTRACTIONS;
  }
  
  /**
   * Validate that attractions don't exceed the limit
   */
  static validateAttractionLimit(attractions: any[], context: string): boolean {
    if (!Array.isArray(attractions)) {
      console.warn(`⚠️ AttractionLimitingService: Invalid attractions in ${context}`);
      return false;
    }
    
    const isValid = attractions.length <= this.ABSOLUTE_MAX_ATTRACTIONS;
    
    if (!isValid) {
      console.error(`🚨 AttractionLimitingService: Limit violation in ${context}:`, {
        count: attractions.length,
        max: this.ABSOLUTE_MAX_ATTRACTIONS,
        context
      });
    }
    
    return isValid;
  }
}
