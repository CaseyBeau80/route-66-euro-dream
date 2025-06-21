
export interface SegmentValidationResult {
  isValid: boolean;
  hasDuplicateDestinations: boolean;
  hasZeroDistanceSegments: boolean;
  invalidSegments: number[];
  recommendations: string[];
  shouldTruncate: boolean;
  optimalDays: number;
}

export class TripSegmentValidator {
  /**
   * Validate trip segments to detect issues like duplicate destinations or zero-distance segments
   */
  static validateTripSegments(segments: any[]): SegmentValidationResult {
    console.log('🔍 Validating trip segments for quality issues');
    
    const result: SegmentValidationResult = {
      isValid: true,
      hasDuplicateDestinations: false,
      hasZeroDistanceSegments: false,
      invalidSegments: [],
      recommendations: [],
      shouldTruncate: false,
      optimalDays: segments.length
    };

    if (!segments || segments.length === 0) {
      result.isValid = false;
      result.recommendations.push('No trip segments were created');
      return result;
    }

    // Check for duplicate destinations (same city for consecutive days)
    const destinations = new Set<string>();
    const duplicateIndices: number[] = [];
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const destinationKey = `${segment.endCity || segment.destination?.city}`;
      
      // Check for zero or very low distance segments
      if (segment.distance <= 5 || segment.approximateMiles <= 5) {
        result.hasZeroDistanceSegments = true;
        result.invalidSegments.push(i);
        console.log(`⚠️ Zero/low distance segment detected on day ${segment.day}: ${segment.distance || segment.approximateMiles} miles`);
      }
      
      // Check for duplicate destinations
      if (destinations.has(destinationKey)) {
        result.hasDuplicateDestinations = true;
        duplicateIndices.push(i);
        console.log(`⚠️ Duplicate destination detected on day ${segment.day}: ${destinationKey}`);
      } else {
        destinations.add(destinationKey);
      }
    }

    // Determine if trip should be truncated
    if (result.hasDuplicateDestinations || result.hasZeroDistanceSegments) {
      result.isValid = false;
      result.shouldTruncate = true;
      
      // Find the optimal truncation point (first duplicate or zero-distance segment)
      const firstInvalidIndex = Math.min(
        ...result.invalidSegments,
        ...duplicateIndices
      );
      
      result.optimalDays = Math.max(1, firstInvalidIndex);
      
      console.log(`🎯 Trip should be truncated to ${result.optimalDays} days due to quality issues`);
      
      result.recommendations.push(
        `Trip has been optimized to ${result.optimalDays} days to avoid duplicate destinations and ensure meaningful daily progress.`
      );
      
      if (result.hasDuplicateDestinations) {
        result.recommendations.push(
          'Staying in the same city for multiple days was detected and removed for a better travel experience.'
        );
      }
      
      if (result.hasZeroDistanceSegments) {
        result.recommendations.push(
          'Zero-distance segments were detected and removed to ensure daily progress along Route 66.'
        );
      }
    }

    return result;
  }

  /**
   * Truncate segments based on validation results
   */
  static truncateSegments(segments: any[], validationResult: SegmentValidationResult): any[] {
    if (!validationResult.shouldTruncate) {
      return segments;
    }

    const truncatedSegments = segments.slice(0, validationResult.optimalDays);
    
    console.log(`✂️ Truncated trip from ${segments.length} to ${truncatedSegments.length} days`);
    
    return truncatedSegments.map((segment, index) => ({
      ...segment,
      day: index + 1 // Renumber days after truncation
    }));
  }
}
