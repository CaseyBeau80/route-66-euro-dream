
import { WeatherData, ForecastDay, WeatherWithForecast, OpenWeatherResponse, ForecastResponse } from './WeatherServiceTypes';

export class WeatherDataProcessor {
  static processCurrentWeather(data: OpenWeatherResponse, cityName: string): WeatherData {
    console.log('🔄 WeatherDataProcessor: Processing current weather data for', cityName);
    console.log('🌤️ Raw weather data:', {
      temp: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind?.speed,
      description: data.weather[0].description
    });
    
    const processedWeather = {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind?.speed || 0),
      cityName: cityName
    };
    
    console.log('✅ Processed current weather:', processedWeather);
    return processedWeather;
  }

  static processForecastData(forecastData: ForecastResponse): ForecastDay[] {
    // Update legacy method to use 5-day default for consistency
    return this.processEnhancedForecastData(forecastData, null, 5);
  }

  static processEnhancedForecastData(
    forecastData: ForecastResponse, 
    targetDate?: Date | null, 
    maxDays: number = 5
  ): ForecastDay[] {
    console.log(`🔄 WeatherDataProcessor: Processing enhanced forecast data (${maxDays} days max)`);
    
    // Group forecast data by UTC date for consistent matching
    const forecastByDay: { [key: string]: any[] } = {};
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      // Use UTC date for consistent timezone handling
      const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      const dateKey = utcDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!forecastByDay[dateKey]) {
        forecastByDay[dateKey] = [];
      }
      forecastByDay[dateKey].push(item);
    });

    const sortedDates = Object.keys(forecastByDay).sort();
    console.log(`📅 WeatherDataProcessor: Grouped forecast by ${sortedDates.length} days:`, sortedDates);

    if (targetDate) {
      const targetDateString = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
        .toISOString().split('T')[0];
      console.log(`🎯 Target date for enhanced processing: ${targetDateString}`);
    }

    // Process up to maxDays worth of forecast data (now defaults to 5)
    return sortedDates
      .slice(0, maxDays)
      .map((dateKey, index) => {
        const dayData = forecastByDay[dateKey];
        console.log(`📅 Processing enhanced day ${index} (${dateKey}) with ${dayData.length} data points`);
        
        // Enhanced temperature calculation with better range detection
        const allTemps = dayData.map(item => item.main.temp);
        const tempMinValues = dayData.map(item => item.main.temp_min);
        const tempMaxValues = dayData.map(item => item.main.temp_max);
        
        // Use the most accurate temperature range available
        const minTemp = Math.min(...tempMinValues, ...allTemps);
        const maxTemp = Math.max(...tempMaxValues, ...allTemps);
        
        let highTemp = Math.round(maxTemp);
        let lowTemp = Math.round(minTemp);
        
        // Ensure realistic temperature variation (at least 3 degrees)
        if (highTemp - lowTemp < 3) {
          const avgTemp = Math.round((highTemp + lowTemp) / 2);
          lowTemp = avgTemp - 5;
          highTemp = avgTemp + 5;
        }
        
        console.log(`🌡️ Enhanced temperature calculation for ${dateKey}:`, {
          rawTemps: allTemps.map(t => Math.round(t)),
          tempMinValues: tempMinValues.map(t => Math.round(t)),
          tempMaxValues: tempMaxValues.map(t => Math.round(t)),
          finalHigh: highTemp,
          finalLow: lowTemp,
          difference: highTemp - lowTemp
        });
        
        // Enhanced precipitation calculation
        const precipChances = dayData.map(item => {
          const popValue = item.pop || 0;
          return popValue * 100;
        }).filter(chance => chance > 0);
        
        const precipitationChance = precipChances.length > 0 
          ? Math.round(Math.max(...precipChances))
          : 0;
        
        console.log(`🌧️ Enhanced precipitation for ${dateKey}:`, {
          rawChances: precipChances,
          finalChance: precipitationChance + '%'
        });
        
        // Calculate enhanced averages
        const humidities = dayData.map(item => item.main.humidity);
        const avgHumidity = humidities.length > 0
          ? Math.round(humidities.reduce((sum, humidity) => sum + humidity, 0) / humidities.length)
          : 50;
        
        const windSpeeds = dayData.map(item => item.wind?.speed || 0);
        const avgWindSpeed = windSpeeds.length > 0
          ? Math.round(windSpeeds.reduce((sum, speed) => sum + speed, 0) / windSpeeds.length)
          : 0;
        
        // Find most representative forecast (closest to midday)
        const midDayForecast = dayData.reduce((closest, current) => {
          const currentHour = new Date(current.dt * 1000).getHours();
          const closestHour = new Date(closest.dt * 1000).getHours();
          return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
        });
        
        const processedDay: ForecastDay = {
          date: new Date(dateKey + 'T12:00:00Z').toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          dateString: dateKey, // Add explicit date string for matching
          temperature: {
            high: highTemp,
            low: lowTemp
          },
          description: midDayForecast.weather[0].description,
          icon: midDayForecast.weather[0].icon,
          precipitationChance: precipitationChance.toString(),
          humidity: avgHumidity,
          windSpeed: avgWindSpeed
        };
        
        console.log(`✅ Enhanced processed day ${index} (${dateKey}):`, {
          dateString: dateKey,
          high: highTemp, 
          low: lowTemp, 
          precipitation: precipitationChance + '%',
          humidity: avgHumidity + '%',
          wind: avgWindSpeed + ' mph',
          tempDifference: highTemp - lowTemp + '°F'
        });
        
        return processedDay;
      });
  }

  static processWeatherWithForecast(
    currentData: OpenWeatherResponse, 
    forecastData: ForecastResponse, 
    cityName: string
  ): WeatherWithForecast {
    console.log('🔄 WeatherDataProcessor: Processing weather with forecast data for', cityName);
    
    const currentWeather = this.processCurrentWeather(currentData, cityName);
    const forecast = this.processForecastData(forecastData);
    
    console.log('✅ WeatherDataProcessor: Final processed data for', cityName, {
      current: currentWeather,
      forecastCount: forecast.length,
      firstForecastDay: forecast[0] ? {
        dateString: forecast[0].dateString,
        high: forecast[0].temperature.high,
        low: forecast[0].temperature.low,
        difference: forecast[0].temperature.high - forecast[0].temperature.low
      } : 'none'
    });
    
    return {
      ...currentWeather,
      forecast
    };
  }
}
