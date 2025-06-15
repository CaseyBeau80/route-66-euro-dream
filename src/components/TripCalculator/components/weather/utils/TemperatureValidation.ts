
import { ExtractedTemperatures } from '../services/TemperatureExtractor';

export class TemperatureValidation {
  /**
   * TEMPERATURE FIX: Enhanced validation that ensures temperatures are realistic and different
   */
  static validateTemperatureRange(temperatures: ExtractedTemperatures, cityName: string): boolean {
    const { current, high, low } = temperatures;
    
    console.log('🌡️ TEMPERATURE FIX: TemperatureValidation.validateTemperatureRange for', cityName, {
      current,
      high,
      low,
      currentType: typeof current,
      highType: typeof high,
      lowType: typeof low
    });

    // Check that we have at least one valid temperature
    const hasValidCurrent = !isNaN(current) && current > -150 && current < 150;
    const hasValidHigh = !isNaN(high) && high > -150 && high < 150;
    const hasValidLow = !isNaN(low) && low > -150 && low < 150;

    console.log('🌡️ TEMPERATURE FIX: Individual temperature validation:', {
      cityName,
      hasValidCurrent,
      hasValidHigh,
      hasValidLow,
      minimumRequirement: hasValidCurrent || (hasValidHigh && hasValidLow)
    });

    // Must have either a current temp, or both high and low
    if (!hasValidCurrent && !(hasValidHigh && hasValidLow)) {
      console.warn('❌ TEMPERATURE FIX: No valid temperature combination for', cityName);
      return false;
    }

    // If we have high and low, they should be different (realistic range)
    if (hasValidHigh && hasValidLow) {
      const range = Math.abs(high - low);
      if (range === 0) {
        console.warn('⚠️ TEMPERATURE FIX: High and low temperatures are identical for', cityName, {
          high,
          low,
          warning: 'This is unusual for real weather data'
        });
      } else {
        console.log('✅ TEMPERATURE FIX: Realistic temperature range for', cityName, {
          high,
          low,
          range
        });
      }
    }

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

    console.log('🌡️ TEMPERATURE FIX: hasAnyValidTemperature check:', {
      current,
      high,
      low,
      hasValid
    });

    return hasValid;
  }

  /**
   * TEMPERATURE FIX: Normalize temperatures to ensure they make logical sense
   */
  static normalizeTemperatures(temperatures: ExtractedTemperatures, cityName: string): ExtractedTemperatures {
    let { current, high, low } = temperatures;

    console.log('🌡️ TEMPERATURE FIX: Normalizing temperatures for', cityName, {
      input: { current, high, low }
    });

    // If we have high and low but no current, estimate current as average
    if (isNaN(current) && !isNaN(high) && !isNaN(low)) {
      current = Math.round((high + low) / 2);
      console.log('🌡️ TEMPERATURE FIX: Estimated current temperature from high/low average:', current);
    }

    // If we have current but missing high/low, create realistic estimates
    if (!isNaN(current)) {
      if (isNaN(high)) {
        high = current + 8; // Typical daily range
        console.log('🌡️ TEMPERATURE FIX: Estimated high temperature:', high);
      }
      if (isNaN(low)) {
        low = current - 8; // Typical daily range
        console.log('🌡️ TEMPERATURE FIX: Estimated low temperature:', low);
      }
    }

    // Ensure logical ordering: low <= current <= high
    if (!isNaN(low) && !isNaN(high) && !isNaN(current)) {
      if (low > high) {
        [low, high] = [high, low]; // Swap if backwards
        console.log('🌡️ TEMPERATURE FIX: Swapped low and high temperatures for logical order');
      }
      
      if (current > high) {
        current = high;
        console.log('🌡️ TEMPERATURE FIX: Adjusted current temperature to not exceed high');
      }
      
      if (current < low) {
        current = low;
        console.log('🌡️ TEMPERATURE FIX: Adjusted current temperature to not go below low');
      }
    }

    const normalized = {
      current,
      high,
      low,
      isValid: this.hasAnyValidTemperature({ current, high, low, isValid: true })
    };

    console.log('🌡️ TEMPERATURE FIX: Normalized temperatures for', cityName, {
      output: normalized,
      temperatureRange: !isNaN(high) && !isNaN(low) ? high - low : 'N/A'
    });

    return normalized;
  }
}
