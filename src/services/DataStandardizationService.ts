import { UnitConversionService } from './unitConversion';
import { UnitPreferences } from '@/types/units';

export interface StandardizedDistance {
  miles: number;
  formatted: string;
  displayValue: number;
  unit: string;
}

export interface StandardizedTemperature {
  fahrenheit: number;
  formatted: string;
  displayValue: number;
  unit: string;
}

export interface StandardizedSegmentData {
  distance: StandardizedDistance;
  driveTime: {
    hours: number;
    formatted: string;
  };
  temperatures?: {
    current?: StandardizedTemperature;
    high?: StandardizedTemperature;
    low?: StandardizedTemperature;
  };
}

export class DataStandardizationService {
  /**
   * Standardize distance formatting across all views
   */
  static standardizeDistance(miles: number, preferences?: UnitPreferences): StandardizedDistance {
    // Ensure we have a valid number
    const safeMiles = Math.max(0, Number(miles) || 0);
    
    if (preferences) {
      const formatted = UnitConversionService.formatDistance(safeMiles, preferences.distance);
      const converted = UnitConversionService.convertDistance(safeMiles, preferences.distance);
      
      return {
        miles: safeMiles,
        formatted,
        displayValue: Math.round(converted),
        unit: preferences.distance === 'kilometers' ? 'km' : 'mi'
      };
    }
    
    // Default to Imperial/miles
    return {
      miles: safeMiles,
      formatted: `${Math.round(safeMiles)} mi`,
      displayValue: Math.round(safeMiles),
      unit: 'mi'
    };
  }

  /**
   * Standardize temperature formatting across all views
   */
  static standardizeTemperature(fahrenheit: number, preferences?: UnitPreferences): StandardizedTemperature {
    // Ensure we have a valid number
    const safeFahrenheit = Number(fahrenheit) || 0;
    
    if (preferences) {
      const formatted = UnitConversionService.formatTemperature(safeFahrenheit, preferences.temperature);
      const converted = UnitConversionService.convertTemperature(safeFahrenheit, preferences.temperature);
      
      return {
        fahrenheit: safeFahrenheit,
        formatted,
        displayValue: Math.round(converted),
        unit: preferences.temperature === 'celsius' ? '°C' : '°F'
      };
    }
    
    // Default to Fahrenheit
    return {
      fahrenheit: safeFahrenheit,
      formatted: `${Math.round(safeFahrenheit)}°F`,
      displayValue: Math.round(safeFahrenheit),
      unit: '°F'
    };
  }

  /**
   * Standardize drive time formatting
   */
  static standardizeDriveTime(hours: number): { hours: number; formatted: string } {
    const safeHours = Math.max(0, Number(hours) || 0);
    const wholeHours = Math.floor(safeHours);
    const minutes = Math.round((safeHours - wholeHours) * 60);
    
    if (minutes === 0) {
      return {
        hours: safeHours,
        formatted: `${wholeHours}h`
      };
    }
    
    return {
      hours: safeHours,
      formatted: `${wholeHours}h ${minutes}m`
    };
  }

  /**
   * Standardize a complete segment's data with Google Maps integration
   */
  static standardizeSegmentData(
    segment: any,
    preferences?: UnitPreferences
  ): StandardizedSegmentData & {
    isGoogleMapsData?: boolean;
    dataAccuracy?: string;
    enhancedMetadata?: any;
  } {
    const distance = this.standardizeDistance(
      segment.distance || segment.approximateMiles || 0,
      preferences
    );
    
    const driveTime = this.standardizeDriveTime(
      segment.driveTimeHours || segment.drivingTime || 0
    );
    
    // Handle weather temperatures if available
    let temperatures: StandardizedSegmentData['temperatures'];
    
    if (segment.weather || segment.weatherData) {
      const weather = segment.weather || segment.weatherData;
      temperatures = {};
      
      if (weather.temperature !== undefined) {
        temperatures.current = this.standardizeTemperature(weather.temperature, preferences);
      }
      
      if (weather.highTemp !== undefined || weather.temp?.max !== undefined) {
        const highTemp = weather.highTemp || weather.temp?.max || weather.main?.temp_max;
        if (highTemp !== undefined) {
          temperatures.high = this.standardizeTemperature(highTemp, preferences);
        }
      }
      
      if (weather.lowTemp !== undefined || weather.temp?.min !== undefined) {
        const lowTemp = weather.lowTemp || weather.temp?.min || weather.main?.temp_min;
        if (lowTemp !== undefined) {
          temperatures.low = this.standardizeTemperature(lowTemp, preferences);
        }
      }
    }
    
    // Enhanced metadata for Google Maps integration
    const enhancedMetadata = {
      isGoogleMapsData: segment.isGoogleMapsData || false,
      dataAccuracy: segment.dataAccuracy || 'estimated',
      lastUpdated: segment.lastUpdated || new Date().toISOString(),
      calculationMethod: segment.isGoogleMapsData ? 'Google Maps API' : 'Haversine Formula'
    };
    
    return {
      distance,
      driveTime,
      temperatures,
      isGoogleMapsData: enhancedMetadata.isGoogleMapsData,
      dataAccuracy: enhancedMetadata.dataAccuracy,
      enhancedMetadata
    };
  }

  /**
   * Validate segment data consistency
   */
  static validateSegmentData(segment: any): {
    isValid: boolean;
    issues: string[];
    warnings: string[];
  } {
    const issues: string[] = [];
    const warnings: string[] = [];
    
    // Check for required fields
    if (!segment.distance && !segment.approximateMiles) {
      issues.push('Missing distance data');
    }
    
    if (!segment.driveTimeHours && !segment.drivingTime) {
      issues.push('Missing drive time data');
    }
    
    if (!segment.endCity) {
      issues.push('Missing destination city');
    }
    
    // Check for reasonable values
    const distance = segment.distance || segment.approximateMiles || 0;
    const driveTime = segment.driveTimeHours || segment.drivingTime || 0;
    
    if (distance > 500) {
      warnings.push(`Unusually long distance: ${distance} miles`);
    }
    
    if (driveTime > 10) {
      warnings.push(`Unusually long drive time: ${driveTime} hours`);
    }
    
    if (distance > 0 && driveTime > 0) {
      const avgSpeed = distance / driveTime;
      if (avgSpeed > 80) {
        warnings.push(`High average speed: ${avgSpeed.toFixed(1)} mph`);
      } else if (avgSpeed < 30) {
        warnings.push(`Low average speed: ${avgSpeed.toFixed(1)} mph`);
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      warnings
    };
  }

  /**
   * Get display preferences from context or default to Imperial
   */
  static getDisplayPreferences(unitPreferences?: UnitPreferences): UnitPreferences {
    return unitPreferences || {
      system: 'imperial',
      distance: 'miles',
      speed: 'mph',
      temperature: 'fahrenheit'
    };
  }
}
