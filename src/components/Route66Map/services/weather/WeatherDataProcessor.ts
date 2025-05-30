
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
    
    // Group forecast data by day
    const forecastByDay: { [key: string]: any[] } = {};
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!forecastByDay[dateKey]) {
        forecastByDay[dateKey] = [];
      }
      forecastByDay[dateKey].push(item);
    });

    // Process next 2 days (skip today, get tomorrow and day after)
    return Object.entries(forecastByDay)
      .slice(1, 3) // Skip today (index 0), get next 2 days
      .map(([dateKey, dayData], index) => {
        const temps = dayData.map(item => item.main.temp);
        const date = new Date(dateKey);
        
        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          temperature: {
            high: Math.round(Math.max(...temps)),
            low: Math.round(Math.min(...temps))
          },
          description: dayData[Math.floor(dayData.length / 2)].weather[0].description,
          icon: dayData[Math.floor(dayData.length / 2)].weather[0].icon
        };
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
    
    return {
      ...currentWeather,
      forecast
    };
  }
}
