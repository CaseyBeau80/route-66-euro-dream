
import { ForecastDay } from './WeatherServiceTypes';
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export class WeatherDataProcessor {
  static processEnhancedForecastData(
    forecastData: any,
    targetDate: Date,
    maxDays: number = 5
  ): ForecastDay[] {
    const processed: ForecastDay[] = [];
    
    console.log('🔧 WeatherDataProcessor.processEnhancedForecastData:', {
      forecastDataKeys: Object.keys(forecastData || {}),
      forecastList: forecastData?.list?.length || 0,
      targetDate: targetDate.toISOString(),
      maxDays
    });

    if (!forecastData?.list || !Array.isArray(forecastData.list)) {
      console.warn('❌ WeatherDataProcessor: Invalid forecast data structure');
      return processed;
    }

    // Group forecasts by date
    const forecastsByDate: { [date: string]: any[] } = {};
    
    forecastData.list.forEach((item: any, index: number) => {
      try {
        const itemDate = new Date(item.dt * 1000);
        const dateString = DateNormalizationService.toDateString(itemDate);
        
        if (!forecastsByDate[dateString]) {
          forecastsByDate[dateString] = [];
        }
        
        // Enhanced temperature extraction
        const temperature = this.extractTemperatureFromForecastItem(item);
        
        forecastsByDate[dateString].push({
          ...item,
          itemDate,
          dateString,
          processedTemperature: temperature
        });

        console.log(`📦 Processed forecast item ${index} for ${dateString}:`, {
          original: item,
          processedTemperature: temperature,
          datetime: itemDate.toISOString()
        });
      } catch (error) {
        console.error('❌ Error processing forecast item:', error, item);
      }
    });

    // Create daily summaries
    Object.entries(forecastsByDate).forEach(([dateString, items]) => {
      if (processed.length >= maxDays) return;
      
      const dailySummary = this.createDailySummary(dateString, items);
      processed.push(dailySummary);
      
      console.log(`📊 Created daily summary for ${dateString}:`, dailySummary);
    });

    console.log('✅ WeatherDataProcessor completed:', {
      processedCount: processed.length,
      dates: processed.map(p => p.dateString)
    });

    return processed;
  }

  private static extractTemperatureFromForecastItem(item: any): number | { high: number; low: number } {
    console.log('🌡️ Extracting temperature from forecast item:', {
      item,
      main: item.main,
      temp: item.main?.temp,
      temp_max: item.main?.temp_max,
      temp_min: item.main?.temp_min
    });

    // Try different temperature extraction strategies
    if (item.main?.temp_max !== undefined && item.main?.temp_min !== undefined) {
      return {
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min)
      };
    } else if (item.main?.temp !== undefined) {
      return Math.round(item.main.temp);
    } else if (item.temp !== undefined) {
      return Math.round(item.temp);
    } else {
      console.warn('⚠️ No temperature data found in forecast item:', item);
      return 70; // Fallback temperature
    }
  }

  private static createDailySummary(dateString: string, items: any[]): ForecastDay {
    const firstItem = items[0];
    const date = new Date(dateString + 'T12:00:00');
    
    // Extract temperatures from all items for this day
    const temperatures = items.map(item => item.processedTemperature).filter(Boolean);
    const descriptions = items.map(item => item.weather?.[0]?.description).filter(Boolean);
    const icons = items.map(item => item.weather?.[0]?.icon).filter(Boolean);
    const humidity = items.map(item => item.main?.humidity).filter(h => h !== undefined);
    const windSpeeds = items.map(item => item.wind?.speed).filter(w => w !== undefined);
    
    // Calculate temperature range
    let temperature: number | { high: number; low: number };
    
    if (temperatures.length > 0) {
      const allHighs: number[] = [];
      const allLows: number[] = [];
      
      temperatures.forEach(temp => {
        if (typeof temp === 'object' && temp.high !== undefined && temp.low !== undefined) {
          allHighs.push(temp.high);
          allLows.push(temp.low);
        } else if (typeof temp === 'number') {
          allHighs.push(temp);
          allLows.push(temp);
        }
      });
      
      if (allHighs.length > 0 && allLows.length > 0) {
        temperature = {
          high: Math.round(Math.max(...allHighs)),
          low: Math.round(Math.min(...allLows))
        };
      } else {
        temperature = 70; // Fallback
      }
    } else {
      temperature = 70; // Fallback
    }
    
    const summary: ForecastDay = {
      date,
      dateString,
      temperature,
      description: descriptions[0] || 'Clear',
      icon: icons[0] || '01d',
      humidity: humidity.length > 0 ? Math.round(humidity.reduce((a, b) => a + b) / humidity.length) : 50,
      windSpeed: windSpeeds.length > 0 ? Math.round(windSpeeds.reduce((a, b) => a + b) / windSpeeds.length) : 5,
      precipitationChance: 0
    };

    console.log(`📈 Daily summary created for ${dateString}:`, summary);
    
    return summary;
  }
}
