
import { OpenWeatherResponse, ForecastResponse } from './WeatherServiceTypes';

export class WeatherApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(lat: number, lng: number): Promise<OpenWeatherResponse> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=imperial`;
    console.log('🌐 WeatherApiClient: Making current weather API request');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      this.handleApiError(response);
    }

    return response.json();
  }

  async getForecast(lat: number, lng: number): Promise<ForecastResponse> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=imperial`;
    console.log('🌐 WeatherApiClient: Making forecast API request');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      this.handleApiError(response);
    }

    return response.json();
  }

  async getWeatherAndForecast(lat: number, lng: number): Promise<[OpenWeatherResponse, ForecastResponse]> {
    console.log('🌐 WeatherApiClient: Making parallel weather and forecast requests');
    
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=imperial`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=imperial`)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      if (!currentResponse.ok) this.handleApiError(currentResponse);
      if (!forecastResponse.ok) this.handleApiError(forecastResponse);
    }

    const [currentData, forecastData] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json()
    ]);

    return [currentData, forecastData];
  }

  private handleApiError(response: Response): never {
    if (response.status === 401) {
      console.error('❌ WeatherApiClient: Invalid API key (401 Unauthorized)');
      throw new Error('Invalid API key');
    } else if (response.status === 404) {
      console.error('❌ WeatherApiClient: Location not found (404)');
      throw new Error('Location not found');
    } else {
      console.error(`❌ WeatherApiClient: API error ${response.status}: ${response.statusText}`);
      throw new Error(`Weather API error: ${response.status}`);
    }
  }
}
