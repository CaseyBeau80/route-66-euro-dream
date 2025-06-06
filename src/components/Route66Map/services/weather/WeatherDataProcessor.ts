
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
      humidity: data.main.humidity, // Real humidity from API
      windSpeed: Math.round(data.wind?.speed || 0), // Real wind speed from API
      cityName: cityName
    };
    
    console.log('✅ Processed current weather:', processedWeather);
    return processedWeather;
  }

  static processForecastData(forecastData: ForecastResponse): ForecastDay[] {
    console.log('🔄 WeatherDataProcessor: Processing forecast data');
    
    // Group forecast data by day using consistent date formatting
    const forecastByDay: { [key: string]: any[] } = {};
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      // Use a more reliable date key format
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      if (!forecastByDay[dateKey]) {
        forecastByDay[dateKey] = [];
      }
      forecastByDay[dateKey].push(item);
    });

    console.log('📅 WeatherDataProcessor: Grouped forecast by day:', Object.keys(forecastByDay));

    // Process 3 days: today, tomorrow, and day after
    return Object.entries(forecastByDay)
      .slice(0, 3) // Get today, tomorrow, and day after
      .map(([dateKey, dayData], index) => {
        console.log(`📅 Processing day ${index} (${dateKey}) with ${dayData.length} data points`);
        
        const temps = dayData.map(item => item.main.temp);
        const date = new Date(dateKey + 'T12:00:00'); // Use noon to avoid timezone issues
        
        // Calculate precipitation chance (average of all forecasts for the day)
        const precipChances = dayData.map(item => (item.pop || 0) * 100);
        const avgPrecipChance = precipChances.length > 0 
          ? Math.round(precipChances.reduce((sum, chance) => sum + chance, 0) / precipChances.length)
          : 0;
        
        // Calculate average humidity for the day
        const humidities = dayData.map(item => item.main.humidity);
        const avgHumidity = humidities.length > 0
          ? Math.round(humidities.reduce((sum, humidity) => sum + humidity, 0) / humidities.length)
          : 50;
        
        // Calculate average wind speed for the day
        const windSpeeds = dayData.map(item => item.wind?.speed || 0);
        const avgWindSpeed = windSpeeds.length > 0
          ? Math.round(windSpeeds.reduce((sum, speed) => sum + speed, 0) / windSpeeds.length)
          : 0;
        
        // Find the most representative forecast (closest to midday)
        const midDayForecast = dayData.reduce((closest, current) => {
          const currentHour = new Date(current.dt * 1000).getHours();
          const closestHour = new Date(closest.dt * 1000).getHours();
          return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
        });
        
        const highTemp = Math.round(Math.max(...temps));
        const lowTemp = Math.round(Math.min(...temps));
        
        const processedDay = {
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          temperature: {
            high: highTemp,
            low: lowTemp
          },
          description: midDayForecast.weather[0].description,
          icon: midDayForecast.weather[0].icon,
          precipitationChance: avgPrecipChance.toString(),
          humidity: avgHumidity, // Real humidity data
          windSpeed: avgWindSpeed // Real wind speed data
        };
        
        console.log(`✅ Processed day ${index} with weather:`, { 
          high: highTemp, 
          low: lowTemp, 
          precipitation: avgPrecipChance + '%',
          humidity: avgHumidity + '%',
          wind: avgWindSpeed + ' mph'
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
      forecastCount: forecast.length
    });
    
    return {
      ...currentWeather,
      forecast
    };
  }
}
