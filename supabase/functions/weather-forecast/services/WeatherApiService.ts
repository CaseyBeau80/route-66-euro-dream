
export interface WeatherApiResponse {
  temperature: number;
  highTemp: number;
  lowTemp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
  cityName: string;
  forecastDate: Date;
  isActualForecast: boolean;
  source: 'live_forecast' | 'historical_fallback';
}

export class WeatherApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCoordinates(cityName: string): Promise<{ lat: number; lon: number } | null> {
    try {
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${this.apiKey}`;
      const geoResponse = await fetch(geocodingUrl);
      
      if (!geoResponse.ok) {
        throw new Error(`Geocoding failed: ${geoResponse.status}`);
      }
      
      const geoData = await geoResponse.json();
      if (!geoData || geoData.length === 0) {
        throw new Error(`City not found: ${cleanCityName}`);
      }

      const location = geoData.find((r: any) => r.country === 'US') || geoData[0];
      return { lat: location.lat, lon: location.lon };
    } catch (error) {
      console.error('❌ Geocoding error:', error);
      return null;
    }
  }

  async getCurrentWeather(lat: number, lon: number, cityName: string): Promise<WeatherApiResponse | null> {
    try {
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
      const currentResponse = await fetch(currentWeatherUrl);
      
      if (!currentResponse.ok) {
        throw new Error(`Current weather API failed: ${currentResponse.status}`);
      }
      
      const currentData = await currentResponse.json();
      
      return {
        temperature: Math.round(currentData.main.temp),
        highTemp: Math.round(currentData.main.temp_max),
        lowTemp: Math.round(currentData.main.temp_min),
        description: currentData.weather[0]?.description || 'Clear',
        icon: currentData.weather[0]?.icon || '01d',
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind?.speed || 0),
        precipitationChance: 0,
        cityName: cityName,
        forecastDate: new Date(),
        isActualForecast: true,
        source: 'live_forecast'
      };
    } catch (error) {
      console.error('❌ Current weather fetch failed:', error);
      return null;
    }
  }

  async getForecastWeather(lat: number, lon: number, cityName: string, targetDateString: string): Promise<WeatherApiResponse | null> {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
      const weatherResponse = await fetch(weatherUrl);
      
      if (!weatherResponse.ok) {
        throw new Error(`Weather forecast API failed: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();
      if (!weatherData.list || weatherData.list.length === 0) {
        throw new Error('No forecast data available');
      }

      const targetDateIntervals = weatherData.list.filter((item: any) => {
        const itemDate = new Date(item.dt * 1000);
        const itemDateString = itemDate.toISOString().split('T')[0];
        return itemDateString === targetDateString;
      });

      if (targetDateIntervals.length === 0) {
        throw new Error('No forecast data for target date');
      }

      // Calculate daily aggregated values
      const allTemperatures = targetDateIntervals.flatMap((item: any) => [
        item.main.temp,
        item.main.temp_max,
        item.main.temp_min
      ]).filter(temp => temp !== undefined && !isNaN(temp));

      const allMainTemps = targetDateIntervals.map((item: any) => item.main.temp);
      const dailyHigh = Math.max(...allTemperatures);
      const dailyLow = Math.min(...allTemperatures);
      const dailyAverage = allMainTemps.reduce((sum, temp) => sum + temp, 0) / allMainTemps.length;

      // Select representative interval (afternoon preferred)
      const representativeInterval = targetDateIntervals.find((item: any) => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour >= 12 && hour <= 15;
      }) || targetDateIntervals[Math.floor(targetDateIntervals.length / 2)] || targetDateIntervals[0];

      return {
        temperature: Math.round(dailyAverage),
        highTemp: Math.round(dailyHigh),
        lowTemp: Math.round(dailyLow),
        description: representativeInterval.weather[0]?.description || 'Partly Cloudy',
        icon: representativeInterval.weather[0]?.icon || '02d',
        humidity: representativeInterval.main.humidity,
        windSpeed: Math.round(representativeInterval.wind?.speed || 0),
        precipitationChance: Math.round((representativeInterval.pop || 0) * 100),
        cityName: cityName,
        forecastDate: new Date(representativeInterval.dt * 1000),
        isActualForecast: true,
        source: 'live_forecast'
      };
    } catch (error) {
      console.error('❌ Forecast weather fetch failed:', error);
      return null;
    }
  }
}
