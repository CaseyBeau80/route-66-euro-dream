
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface SourceVerificationResult {
  isValid: boolean;
  expectedSource: 'live_forecast' | 'historical_fallback';
  actualSource: string;
  isActualForecast: boolean;
  withinForecastRange: boolean;
  daysFromNow: number;
  issues: string[];
  recommendations: string[];
}

export class WeatherSourceVerifier {
  static verifyWeatherSource(
    weather: ForecastWeatherData,
    targetDate: Date,
    hasApiKey: boolean
  ): SourceVerificationResult {
    const today = new Date();
    const daysFromNow = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const withinForecastRange = daysFromNow >= 0 && daysFromNow <= 5;
    
    const expectedSource = withinForecastRange && hasApiKey ? 'live_forecast' : 'historical_fallback';
    const actualSource = weather.source || 'unknown';
    const isActualForecast = weather.isActualForecast === true;
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    console.log('🔍 PLAN: WeatherSourceVerifier checking source validity:', {
      cityName: weather.cityName,
      daysFromNow,
      withinForecastRange,
      hasApiKey,
      expectedSource,
      actualSource,
      isActualForecast
    });

    // Check for source mismatches
    if (expectedSource === 'live_forecast' && actualSource !== 'live_forecast') {
      issues.push(`Expected live forecast but got ${actualSource}`);
      recommendations.push('Check API key configuration and live forecast logic');
    }

    if (expectedSource === 'live_forecast' && !isActualForecast) {
      issues.push('Expected actual forecast but isActualForecast is false');
      recommendations.push('Verify live forecast API response processing');
    }

    if (actualSource === 'live_forecast' && !withinForecastRange) {
      issues.push('Live forecast source used outside forecast range');
      recommendations.push('Use historical fallback for dates beyond 5 days');
    }

    // Check for inconsistent flags
    if (actualSource === 'live_forecast' && !isActualForecast) {
      issues.push('Source is live_forecast but isActualForecast is false');
      recommendations.push('Ensure consistent flag setting in weather data');
    }

    if (actualSource === 'historical_fallback' && isActualForecast) {
      issues.push('Source is historical_fallback but isActualForecast is true');
      recommendations.push('Set isActualForecast to false for fallback data');
    }

    const isValid = issues.length === 0;

    const result: SourceVerificationResult = {
      isValid,
      expectedSource,
      actualSource,
      isActualForecast,
      withinForecastRange,
      daysFromNow,
      issues,
      recommendations
    };

    if (!isValid) {
      console.warn('⚠️ PLAN: Weather source verification failed:', result);
    } else {
      console.log('✅ PLAN: Weather source verification passed:', {
        cityName: weather.cityName,
        source: actualSource,
        isActualForecast
      });
    }

    return result;
  }

  static logVerificationResult(result: SourceVerificationResult, cityName: string): void {
    const logLevel = result.isValid ? 'info' : 'warn';
    const emoji = result.isValid ? '✅' : '⚠️';
    
    console[logLevel](`${emoji} PLAN: Source verification for ${cityName}:`, {
      isValid: result.isValid,
      expected: result.expectedSource,
      actual: result.actualSource,
      daysFromNow: result.daysFromNow,
      issues: result.issues,
      recommendations: result.recommendations
    });
  }
}
