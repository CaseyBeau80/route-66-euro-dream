
import { useMemo, useRef } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { DataValidationService } from '../services/validation/DataValidationService';
import { getValidatedStops, isUserRelevantStop } from '../components/utils/stopValidation';
import { createSegmentHash } from '../utils/segmentStabilizer';

interface ValidationResults {
  validStops: any[];
  userRelevantStops: any[];
  isValid: boolean;
}

/**
 * Optimized validation hook that prevents redundant validation calls
 */
export const useOptimizedValidation = (segment: DailySegment): ValidationResults => {
  const lastHashRef = useRef<string>('');
  const lastResultRef = useRef<ValidationResults | null>(null);
  
  return useMemo(() => {
    // Create hash to detect actual changes
    const currentHash = createSegmentHash(segment);
    
    // Return cached result if hash hasn't changed
    if (currentHash === lastHashRef.current && lastResultRef.current) {
      console.log(`♻️ useOptimizedValidation: Using cached validation for segment ${segment.day}`);
      return lastResultRef.current;
    }
    
    console.log(`🔄 useOptimizedValidation: Running validation for segment ${segment.day}`);
    
    // Validate segment
    const isValid = DataValidationService.validateDailySegment(segment, 'useOptimizedValidation');
    
    if (!isValid) {
      const result = { validStops: [], userRelevantStops: [], isValid: false };
      lastHashRef.current = currentHash;
      lastResultRef.current = result;
      return result;
    }
    
    try {
      const validStops = getValidatedStops(segment);
      const userRelevantStops = validStops.filter(isUserRelevantStop);
      
      const result = { validStops, userRelevantStops, isValid: true };
      lastHashRef.current = currentHash;
      lastResultRef.current = result;
      return result;
    } catch (error) {
      console.error('❌ useOptimizedValidation: Error during validation:', error);
      const result = { validStops: [], userRelevantStops: [], isValid: false };
      lastHashRef.current = currentHash;
      lastResultRef.current = result;
      return result;
    }
  }, [segment]);
};
