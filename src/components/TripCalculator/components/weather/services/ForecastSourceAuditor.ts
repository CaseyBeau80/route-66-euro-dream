
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { DateNormalizationService } from '../DateNormalizationService';

export interface ForecastAuditResult {
  cityName: string;
  segmentDay: number;
  requestedDate: string;
  daysFromNow: number;
  isWithinForecastRange: boolean;
  liveForecastAttempted: boolean;
  liveForecastSuccess: boolean;
  finalSource: 'live' | 'historical' | 'unknown';
  isActualForecast: boolean;
  fallbackReason?: string;
  temperature?: {
    high: number;
    low: number;
    average: number;
  };
  timestamp: string;
}

export class ForecastSourceAuditor {
  private static auditResults: Map<string, ForecastAuditResult> = new Map();

  static startAudit(cityName: string, segmentDay: number, segmentDate: Date): void {
    const key = `${cityName}-${segmentDay}`;
    const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    const auditResult: ForecastAuditResult = {
      cityName,
      segmentDay,
      requestedDate: DateNormalizationService.toDateString(segmentDate),
      daysFromNow,
      isWithinForecastRange: daysFromNow >= 0 && daysFromNow <= 5,
      liveForecastAttempted: false,
      liveForecastSuccess: false,
      finalSource: 'unknown',
      isActualForecast: false,
      timestamp: new Date().toISOString()
    };

    this.auditResults.set(key, auditResult);
    
    console.log(`🔍 [FORECAST AUDIT] Started audit for ${cityName} Day ${segmentDay}:`, auditResult);
  }

  static recordLiveForecastAttempt(cityName: string, segmentDay: number): void {
    const key = `${cityName}-${segmentDay}`;
    const audit = this.auditResults.get(key);
    
    if (audit) {
      audit.liveForecastAttempted = true;
      console.log(`📡 [FORECAST AUDIT] Live forecast attempt recorded for ${cityName} Day ${segmentDay}`);
    }
  }

  static recordLiveForecastResult(
    cityName: string, 
    segmentDay: number, 
    success: boolean, 
    weather?: ForecastWeatherData,
    failureReason?: string
  ): void {
    const key = `${cityName}-${segmentDay}`;
    const audit = this.auditResults.get(key);
    
    if (audit) {
      audit.liveForecastSuccess = success;
      
      if (success && weather) {
        audit.finalSource = 'live';
        audit.isActualForecast = weather.isActualForecast || false;
        audit.temperature = {
          high: weather.highTemp || weather.temperature || 0,
          low: weather.lowTemp || weather.temperature || 0,
          average: weather.temperature || 0
        };
      } else {
        audit.fallbackReason = failureReason || 'live_forecast_failed';
      }
      
      console.log(`📡 [FORECAST AUDIT] Live forecast result recorded for ${cityName} Day ${segmentDay}:`, {
        success,
        finalSource: audit.finalSource,
        isActualForecast: audit.isActualForecast,
        failureReason
      });
    }
  }

  static recordFallbackUsed(cityName: string, segmentDay: number, reason: string): void {
    const key = `${cityName}-${segmentDay}`;
    const audit = this.auditResults.get(key);
    
    if (audit) {
      audit.finalSource = 'historical';
      audit.isActualForecast = false;
      audit.fallbackReason = reason;
      
      console.log(`📊 [FORECAST AUDIT] Fallback used for ${cityName} Day ${segmentDay}:`, {
        reason,
        finalSource: audit.finalSource
      });
    }
  }

  static recordFinalWeatherSet(cityName: string, segmentDay: number, weather: ForecastWeatherData): void {
    const key = `${cityName}-${segmentDay}`;
    const audit = this.auditResults.get(key);
    
    if (audit) {
      // Determine final source based on weather data
      if (weather.isActualForecast === true && 
          (weather.dateMatchInfo?.source === 'api-forecast' || weather.dateMatchInfo?.source === 'forecast')) {
        audit.finalSource = 'live';
      } else {
        audit.finalSource = 'historical';
      }
      
      audit.isActualForecast = weather.isActualForecast || false;
      audit.temperature = {
        high: weather.highTemp || weather.temperature || 0,
        low: weather.lowTemp || weather.temperature || 0,
        average: weather.temperature || 0
      };
      
      console.log(`✅ [FORECAST AUDIT] Final weather set for ${cityName} Day ${segmentDay}:`, {
        finalSource: audit.finalSource,
        isActualForecast: audit.isActualForecast,
        temperature: audit.temperature,
        source: weather.dateMatchInfo?.source
      });
    }
  }

  static getAuditSummary(): ForecastAuditResult[] {
    const results = Array.from(this.auditResults.values()).sort((a, b) => a.segmentDay - b.segmentDay);
    
    console.log('📋 [FORECAST AUDIT] Complete audit summary:');
    results.forEach(result => {
      const status = result.finalSource === 'live' ? '📡 LIVE' : 
                   result.finalSource === 'historical' ? '📊 HISTORICAL' : '❓ UNKNOWN';
      
      console.log(`${status} Day ${result.segmentDay} - ${result.cityName}:`, {
        requestedDate: result.requestedDate,
        daysFromNow: result.daysFromNow,
        withinRange: result.isWithinForecastRange,
        attempted: result.liveForecastAttempted,
        success: result.liveForecastSuccess,
        finalSource: result.finalSource,
        isActualForecast: result.isActualForecast,
        fallbackReason: result.fallbackReason,
        temperature: result.temperature
      });
    });
    
    return results;
  }

  static clearAudit(): void {
    this.auditResults.clear();
    console.log('🧹 [FORECAST AUDIT] Audit results cleared');
  }
}
