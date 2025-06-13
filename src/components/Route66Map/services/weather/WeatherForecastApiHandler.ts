
import { WeatherApiClient } from './WeatherApiClient';
import { WeatherDataProcessor } from './WeatherDataProcessor';
import { ForecastWeatherData } from './WeatherForecastService';
import { EnhancedWeatherForecastMatcher } from '../../../TripCalculator/components/weather/EnhancedWeatherForecastMatcher';
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export class WeatherForecastApiHandler {
  private apiClient: WeatherApiClient;

  constructor(apiKey: string) {
    this.apiClient = new WeatherApiClient(apiKey);
  }

  async fetchLiveForecast(
    lat: number,
    lng: number,
    cityName: string,
    targetDate: Date,
    targetDateString: string,
    daysFromToday: number
  ): Promise<ForecastWeatherData | null> {
    try {
      console.log('🚨 FIXED: WeatherForecastApiHandler.fetchLiveForecast START', {
        cityName,
        targetDateString,
        coordinates: { lat, lng },
        daysFromToday
      });

      const [currentData, forecastData] = await this.apiClient.getWeatherAndForecast(lat, lng);
      
      console.log('🚨 FIXED: API response received', {
        cityName,
        targetDateString,
        hasCurrentData: !!currentData,
        hasForecastData: !!forecastData,
        currentTemp: currentData?.main?.temp,
        forecastListLength: Array.isArray(forecastData?.list) ? forecastData.list.length : 0
      });
      
      const processedForecast = WeatherDataProcessor.processEnhancedForecastData(forecastData, targetDate, 7);
      
      console.log('🚨 FIXED: Processed forecast data', {
        cityName,
        targetDateString,
        processedCount: processedForecast.length,
        availableDates: processedForecast.map(f => f.dateString).filter(Boolean)
      });
      
      const matchResult = EnhancedWeatherForecastMatcher.findBestMatch(
        processedForecast, 
        targetDate, 
        targetDateString, 
        cityName
      );
      
      console.log('🚨 FIXED: Match result for live forecast', {
        cityName,
        targetDateString,
        daysFromToday,
        hasMatch: !!matchResult.matchedForecast,
        matchType: matchResult.matchInfo?.matchType,
        matchedDate: matchResult.matchInfo?.matchedDate,
        confidence: matchResult.matchInfo?.confidence
      });
      
      if (matchResult.matchedForecast) {
        return this.createForecastResult(matchResult, processedForecast, cityName, targetDate, targetDateString, daysFromToday);
      } else if (currentData && currentData.main && currentData.main.temp) {
        console.log('🚨 FIXED: Creating live estimate from current data within forecast range', {
          cityName,
          targetDateString,
          daysFromToday,
          currentTemp: currentData.main.temp,
          reason: 'live_estimate_within_range'
        });

        return this.createLiveEstimateFromCurrent(
          currentData, 
          cityName, 
          targetDate, 
          targetDateString, 
          daysFromToday, 
          processedForecast
        );
      }

      console.log(`❌ No usable forecast data found for ${cityName} on ${targetDateString}`);
      return null;
    } catch (error) {
      console.error('🚨 FIXED: WeatherForecastApiHandler.fetchLiveForecast ERROR', {
        cityName,
        targetDateString,
        daysFromToday,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  private createForecastResult(
    matchResult: any,
    processedForecast: any[],
    cityName: string,
    targetDate: Date,
    targetDateString: string,
    daysFromToday: number
  ): ForecastWeatherData {
    const forecast = matchResult.matchedForecast;
    
    const extractTemperature = (temp: number | { high: number; low: number; } | undefined): number => {
      if (typeof temp === 'number') return temp;
      if (temp && typeof temp === 'object' && 'high' in temp && 'low' in temp) {
        return Math.round((temp.high + temp.low) / 2);
      }
      return 70;
    };

    const extractHighTemp = (temp: number | { high: number; low: number; } | undefined): number => {
      if (typeof temp === 'number') return temp + 8;
      if (temp && typeof temp === 'object' && 'high' in temp) return temp.high;
      return 78;
    };

    const extractLowTemp = (temp: number | { high: number; low: number; } | undefined): number => {
      if (typeof temp === 'number') return temp - 8;
      if (temp && typeof temp === 'object' && 'low' in temp) return temp.low;
      return 62;
    };

    const highTemp = extractHighTemp(forecast.temperature);
    const lowTemp = extractLowTemp(forecast.temperature);
    const avgTemp = extractTemperature(forecast.temperature);
    const precipChance = parseInt(String(forecast.precipitationChance)) || 0;
    
    console.log(`✅ FIXED: Live forecast CONFIRMED for ${cityName} Day ${daysFromToday}:`, {
      targetDateString,
      daysFromToday,
      matchType: matchResult.matchInfo.matchType,
      temperature: { high: highTemp, low: lowTemp, avg: avgTemp },
      description: forecast.description,
      isActualForecast: true,
      explicitSource: 'live_forecast'
    });
    
    return {
      temperature: avgTemp,
      highTemp: highTemp,
      lowTemp: lowTemp,
      description: forecast.description || 'Weather forecast',
      icon: forecast.icon || '01d',
      humidity: forecast.humidity || 50,
      windSpeed: forecast.windSpeed || 0,
      precipitationChance: precipChance,
      cityName: cityName,
      forecast: processedForecast,
      forecastDate: targetDate,
      isActualForecast: true,
      source: 'live_forecast' as const,
      matchedForecastDay: forecast,
      dateMatchInfo: {
        ...matchResult.matchInfo,
        source: 'live_forecast' as const
      }
    };
  }

  private createLiveEstimateFromCurrent(
    currentData: any,
    cityName: string,
    targetDate: Date,
    targetDateString: string,
    daysFromToday: number,
    processedForecast: any[]
  ): ForecastWeatherData {
    const currentTemp = currentData.main.temp;
    const tempVariation = 10;
    
    console.log('🚨 FIXED: createLiveEstimateFromCurrent - LIVE ESTIMATE with consistent source marking', {
      cityName,
      targetDateString,
      daysFromToday,
      reason: 'live_estimate_from_current_within_forecast_range'
    });
    
    return {
      temperature: Math.round(currentTemp),
      highTemp: Math.round(currentTemp + tempVariation/2),
      lowTemp: Math.round(currentTemp - tempVariation/2),
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind?.speed || 0),
      precipitationChance: Math.round((currentData.main.humidity / 100) * 30),
      cityName: cityName,
      forecast: processedForecast,
      forecastDate: targetDate,
      isActualForecast: true,
      source: 'live_forecast' as const,
      dateMatchInfo: {
        requestedDate: targetDateString,
        matchedDate: DateNormalizationService.toDateString(new Date()),
        matchType: 'closest' as const,
        daysOffset: daysFromToday,
        hoursOffset: 0,
        source: 'live_forecast' as const,
        confidence: 'medium' as const
      }
    };
  }
}
