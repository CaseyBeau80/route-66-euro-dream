
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
    
    // Group forecast items by date to aggregate daily high/low temperatures
    const dailyForecasts = new Map<string, {
      temps: number[],
      descriptions: string[],
      icons: string[],
      humidity: number[],
      windSpeed: number[],
      precipitationChances: number[]
    }>();

    // First pass: collect all forecast items and group by date
    for (const item of forecastData.list) {
      if (!item.dt_txt) continue;

      const forecastDate = new Date(item.dt_txt);
      if (isNaN(forecastDate.getTime())) continue;

      const normalizedForecastDate = this.normalizeToUtcMidnight(forecastDate);
      const forecastDateString = DateNormalizationService.toDateString(normalizedForecastDate);
      
      if (!dailyForecasts.has(forecastDateString)) {
        dailyForecasts.set(forecastDateString, {
          temps: [],
          descriptions: [],
          icons: [],
          humidity: [],
          windSpeed: [],
          precipitationChances: []
        });
      }

      const dayData = dailyForecasts.get(forecastDateString)!;
      
      // Collect all temperature readings for this date
      dayData.temps.push(item.main.temp);
      if (item.main.temp_max) dayData.temps.push(item.main.temp_max);
      if (item.main.temp_min) dayData.temps.push(item.main.temp_min);
      
      dayData.descriptions.push(item.weather[0].description);
      dayData.icons.push(item.weather[0].icon);
      dayData.humidity.push(item.main.humidity);
      dayData.windSpeed.push(item.wind?.speed || 0);
      dayData.precipitationChances.push((item.pop || 0) * 100);

      console.log(`🌡️ COLLECTED TEMPS for ${forecastDateString}:`, {
        itemTemp: item.main.temp,
        itemTempMax: item.main.temp_max,
        itemTempMin: item.main.temp_min,
        allTempsForDay: dayData.temps
      });
    }

    // Second pass: calculate daily aggregates
    const processedForecasts: ForecastDay[] = [];

    for (const [dateString, dayData] of dailyForecasts.entries()) {
      if (dayData.temps.length === 0) continue;

      // Calculate actual daily high and low from all temperature readings
      const highTemp = Math.round(Math.max(...dayData.temps));
      const lowTemp = Math.round(Math.min(...dayData.temps));

      console.log(`🌡️ TEMPERATURE AGGREGATION for ${dateString}:`, {
        allTemps: dayData.temps,
        calculatedHigh: highTemp,
        calculatedLow: lowTemp,
        tempDifference: highTemp - lowTemp,
        validRange: highTemp !== lowTemp ? 'YES' : 'SAME_TEMP'
      });

      // Use the most common description and icon
      const mostCommonDescription = this.getMostCommon(dayData.descriptions);
      const mostCommonIcon = this.getMostCommon(dayData.icons);
      const avgHumidity = Math.round(dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length);
      const avgWindSpeed = Math.round(dayData.windSpeed.reduce((a, b) => a + b, 0) / dayData.windSpeed.length);
      const avgPrecipitationChance = Math.round(dayData.precipitationChances.reduce((a, b) => a + b, 0) / dayData.precipitationChances.length);

      const forecastEntry: ForecastDay = {
        date: dateString,
        dateString: dateString,
        temperature: {
          high: highTemp,
          low: lowTemp
        },
        description: mostCommonDescription,
        icon: mostCommonIcon,
        precipitationChance: avgPrecipitationChance.toString(),
        humidity: avgHumidity,
        windSpeed: avgWindSpeed
      };

      processedForecasts.push(forecastEntry);
      
      console.log(`📅 FINAL PROCESSED forecast for ${dateString}:`, {
        high: forecastEntry.temperature.high,
        low: forecastEntry.temperature.low,
        description: forecastEntry.description,
        tempDifference: forecastEntry.temperature.high - forecastEntry.temperature.low,
        hasRealisticRange: forecastEntry.temperature.high > forecastEntry.temperature.low
      });

      // Stop once we have enough days
      if (processedForecasts.length >= maxDays) break;
    }

    console.log(`✅ WeatherDataProcessor: Processed ${processedForecasts.length} forecast days with aggregated temperatures`);
    return processedForecasts;
  }

  /**
   * Helper method to find the most common value in an array
   */
  private static getMostCommon<T>(arr: T[]): T {
    const counts = new Map<T, number>();
    for (const item of arr) {
      counts.set(item, (counts.get(item) || 0) + 1);
    }
    
    let mostCommon = arr[0];
    let maxCount = 0;
    
    for (const [item, count] of counts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = item;
      }
    }
    
    return mostCommon;
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
        console.log(`✅ Found exact date match for ${targetDateString}:`, {
          high: forecast.temperature.high,
          low: forecast.temperature.low,
          validTemperatureRange: forecast.temperature.high !== forecast.temperature.low
        });
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
      console.log(`📍 Found closest match for ${targetDateString}: ${closestForecast.dateString} (${smallestOffset.toFixed(1)} hours offset):`, {
        high: closestForecast.temperature.high,
        low: closestForecast.temperature.low,
        validTemperatureRange: closestForecast.temperature.high !== closestForecast.temperature.low
      });
    } else {
      console.log(`❌ No suitable forecast found within 12 hours for ${targetDateString}`);
    }

    return closestForecast;
  }
}
