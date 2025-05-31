
import { WeatherData, ForecastDay, WeatherWithForecast, OpenWeatherResponse, ForecastResponse } from './WeatherServiceTypes';

export class WeatherDataProcessor {
  static processCurrentWeather(data: OpenWeatherResponse, cityName: string): WeatherData {
    console.log('🔄 WeatherDataProcessor: Processing current weather data');
    
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind?.speed || 0),
      cityName: cityName
    };
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
        
        // Find the most representative forecast (closest to midday)
        const midDayForecast = dayData.reduce((closest, current) => {
          const currentHour = new Date(current.dt * 1000).getHours();
          const closestHour = new Date(closest.dt * 1000).getHours();
          return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
        });
        
        const processedDay = {
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          temperature: {
            high: Math.round(Math.max(...temps)),
            low: Math.round(Math.min(...temps))
          },
          description: midDayForecast.weather[0].description,
          icon: midDayForecast.weather[0].icon,
          precipitationChance: avgPrecipChance.toString()
        };
        
        console.log(`✅ Processed day ${index}:`, processedDay);
        return processedDay;
      });
  }

  static processWeatherWithForecast(
    currentData: OpenWeatherResponse, 
    forecastData: ForecastResponse, 
    cityName: string
  ): WeatherWithForecast {
    console.log('🔄 WeatherDataProcessor: Processing weather with forecast data');
    
    const currentWeather = this.processCurrentWeather(currentData, cityName);
    const forecast = this.processForecastData(forecastData);
    
    console.log('✅ WeatherDataProcessor: Final processed data:', {
      current: currentWeather,
      forecastCount: forecast.length
    });
    
    return {
      ...currentWeather,
      forecast
    };
  }
}
