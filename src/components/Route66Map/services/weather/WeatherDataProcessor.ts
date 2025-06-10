
import { WeatherData, ForecastDay, WeatherWithForecast } from './WeatherServiceTypes';
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export class WeatherDataProcessor {
  static processCurrentWeather(data: any, cityName: string): WeatherData {
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind?.speed || 0),
      precipitationChance: 0,
      cityName: cityName
    };
  }

  static processWeatherData(data: any, cityName: string): WeatherData {
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind?.speed || 0),
      precipitationChance: 0,
      cityName: cityName
    };
  }

  static processWeatherWithForecast(
    currentData: any,
    forecastData: any,
    cityName: string
  ): WeatherWithForecast {
    const currentWeather = this.processCurrentWeather(currentData, cityName);
    const forecast = this.processEnhancedForecastData(forecastData, new Date(), 5);
    
    return {
      ...currentWeather,
      forecast: forecast
    };
  }

  /**
   * Normalize date to UTC midnight for exact matching
   */
  private static normalizeToUtcMidnight(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  static processEnhancedForecastData(
    forecastData: any, 
    targetDate: Date, 
    maxDays: number = 5
  ): ForecastDay[] {
    if (!forecastData?.list) {
      console.warn('⚠️ WeatherDataProcessor: No forecast list found');
      return [];
    }

    console.log(`📊 WeatherDataProcessor: Processing forecast for target date ${targetDate.toISOString()}`);
    
    const processedForecasts: ForecastDay[] = [];
    const seenDates = new Set<string>();

    for (const item of forecastData.list) {
      if (!item.dt_txt) continue;

      // Parse the forecast date
      const forecastDate = new Date(item.dt_txt);
      if (isNaN(forecastDate.getTime())) continue;

      // Normalize to UTC midnight for consistent comparison
      const normalizedForecastDate = this.normalizeToUtcMidnight(forecastDate);
      const forecastDateString = DateNormalizationService.toDateString(normalizedForecastDate);
      
      // Skip if we've already processed this date
      if (seenDates.has(forecastDateString)) continue;
      seenDates.add(forecastDateString);

      // Create forecast entry
      const forecastEntry: ForecastDay = {
        date: forecastDateString, // Use string instead of Date
        dateString: forecastDateString,
        temperature: {
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min)
        },
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        precipitationChance: Math.round((item.pop || 0) * 100).toString(),
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind?.speed || 0)
      };

      processedForecasts.push(forecastEntry);
      
      console.log(`📅 Processed forecast for ${forecastDateString}:`, {
        high: forecastEntry.temperature.high,
        low: forecastEntry.temperature.low,
        description: forecastEntry.description
      });

      // Stop once we have enough days
      if (processedForecasts.length >= maxDays) break;
    }

    console.log(`✅ WeatherDataProcessor: Processed ${processedForecasts.length} forecast days`);
    return processedForecasts;
  }

  /**
   * Find forecast for exact date match with fallback to closest within 12 hours
   */
  static findForecastForDate(forecasts: ForecastDay[], targetDate: Date): ForecastDay | null {
    const normalizedTargetDate = this.normalizeToUtcMidnight(targetDate);
    const targetDateString = DateNormalizationService.toDateString(normalizedTargetDate);
    
    console.log(`🎯 WeatherDataProcessor: Looking for exact match for ${targetDateString}`);
    
    // First try exact date match
    for (const forecast of forecasts) {
      if (forecast.dateString === targetDateString) {
        console.log(`✅ Found exact date match for ${targetDateString}`);
        return forecast;
      }
    }

    // Fallback: Find closest date within ±12 hours
    let closestForecast: ForecastDay | null = null;
    let smallestOffset = Infinity;

    for (const forecast of forecasts) {
      if (!forecast.dateString) continue;
      
      const forecastDate = new Date(forecast.dateString + 'T00:00:00Z');
      const offsetHours = Math.abs((forecastDate.getTime() - normalizedTargetDate.getTime()) / (60 * 60 * 1000));
      
      // Only consider forecasts within 12 hours (0.5 days)
      if (offsetHours <= 12 && offsetHours < smallestOffset) {
        closestForecast = forecast;
        smallestOffset = offsetHours;
      }
    }

    if (closestForecast) {
      console.log(`📍 Found closest match for ${targetDateString}: ${closestForecast.dateString} (${smallestOffset.toFixed(1)} hours offset)`);
    } else {
      console.log(`❌ No suitable forecast found within 12 hours for ${targetDateString}`);
    }

    return closestForecast;
  }
}
