
import { ExtractedTemperatures } from '../services/TemperatureExtractor';

export class TemperatureValidation {
  /**
   * TEMPERATURE FIX: Validation that preserves real API data without artificial manipulation
   */
  static validateTemperatureRange(temperatures: ExtractedTemperatures, cityName: string): boolean {
    const { current, high, low } = temperatures;
    
    console.log('🌡️ REAL DATA ONLY: TemperatureValidation.validateTemperatureRange for', cityName, {
      current,
      high,
      low,
      preservingRealData: true
    });

    // Check that we have at least one valid temperature from real API data
    const hasValidCurrent = !isNaN(current) && current > -150 && current < 150;
    const hasValidHigh = !isNaN(high) && high > -150 && high < 150;
    const hasValidLow = !isNaN(low) && low > -150 && low < 150;

    console.log('🌡️ REAL DATA ONLY: Individual temperature validation:', {
      cityName,
      hasValidCurrent,
      hasValidHigh,
      hasValidLow,
      usingOnlyRealData: true
    });

    // Must have at least one real temperature value
    const hasAnyValid = hasValidCurrent || hasValidHigh || hasValidLow;
    
    if (!hasAnyValid) {
      console.warn('❌ REAL DATA ONLY: No valid real temperature data for', cityName);
      return false;
    }

    console.log('✅ REAL DATA ONLY: Using real temperature data for', cityName, {
      availableData: { hasValidCurrent, hasValidHigh, hasValidLow }
    });

    return true;
  }

  /**
   * Check if we have any valid temperature to display
   */
  static hasAnyValidTemperature(temperatures: ExtractedTemperatures): boolean {
    const { current, high, low } = temperatures;
    
    const hasValid = (!isNaN(current) && current > -150 && current < 150) ||
                     (!isNaN(high) && high > -150 && high < 150) ||
                     (!isNaN(low) && low > -150 && low < 150);

    console.log('🌡️ REAL DATA ONLY: hasAnyValidTemperature check:', {
      current,
      high,
      low,
      hasValid,
      usingOnlyRealData: true
    });

    return hasValid;
  }

  /**
   * REAL DATA ONLY: Return temperatures exactly as received from API - NO artificial manipulation
   */
  static normalizeTemperatures(temperatures: ExtractedTemperatures, cityName: string): ExtractedTemperatures {
    const { current, high, low } = temperatures;

    console.log('🌡️ REAL DATA ONLY: Preserving exact API temperatures for', cityName, {
      input: { current, high, low },
      noArtificialManipulation: true
    });

    // Return temperatures exactly as they came from the API
    // Do NOT create artificial estimates
    // Do NOT enforce logical ordering that would change real data
    const result = {
      current: current, // Keep exact API value or NaN
      high: high,       // Keep exact API value or NaN  
      low: low,         // Keep exact API value or NaN
      isValid: this.hasAnyValidTemperature({ current, high, low, isValid: true })
    };

    console.log('✅ REAL DATA ONLY: Preserved exact API temperatures for', cityName, {
      output: result,
      preservedRealData: true,
      noArtificialEstimates: true
    });

    return result;
  }
}
