
import { WeatherData, ForecastDay } from './WeatherServiceTypes';
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export class WeatherDataProcessor {
  static processWeatherData(data: any, cityName: string): WeatherData {
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind?.speed || 0),
      precipitationChance: 0,
      cityName: cityName,
      forecast: []
    };
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

      // Normalize to date string for comparison
      const forecastDateString = DateNormalizationService.toDateString(forecastDate);
      
      // Skip if we've already processed this date
      if (seenDates.has(forecastDateString)) continue;
      seenDates.add(forecastDateString);

      // Create forecast entry
      const forecastEntry: ForecastDay = {
        date: forecastDate,
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

  static findForecastForDate(forecasts: ForecastDay[], targetDate: Date): ForecastDay | null {
    const targetDateString = DateNormalizationService.toDateString(targetDate);
    
    console.log(`🎯 WeatherDataProcessor: Looking for forecast matching ${targetDateString}`);
    
    // Try exact date match first
    for (const forecast of forecasts) {
      if (forecast.dateString === targetDateString) {
        console.log(`✅ Found exact date match for ${targetDateString}`);
        return forecast;
      }
    }

    // Find closest date within 2 days
    let closestForecast: ForecastDay | null = null;
    let smallestOffset = Infinity;

    const targetDateObj = new Date(targetDateString + 'T00:00:00Z');
    
    for (const forecast of forecasts) {
      const forecastDateObj = new Date(forecast.dateString + 'T00:00:00Z');
      const offsetDays = Math.abs((forecastDateObj.getTime() - targetDateObj.getTime()) / (24 * 60 * 60 * 1000));
      
      if (offsetDays < smallestOffset && offsetDays <= 2) {
        closestForecast = forecast;
        smallestOffset = offsetDays;
      }
    }

    if (closestForecast) {
      console.log(`📍 Found closest match for ${targetDateString}: ${closestForecast.dateString} (${smallestOffset} days offset)`);
    } else {
      console.log(`❌ No suitable forecast found for ${targetDateString}`);
    }

    return closestForecast;
  }
}
