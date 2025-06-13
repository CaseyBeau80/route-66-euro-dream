
export class WeatherApiClient {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    console.log('🔧 FIXED: WeatherApiClient initialized', {
      hasApiKey: !!apiKey,
      baseUrl: this.baseUrl
    });
  }

  hasApiKey(): boolean {
    return !!this.apiKey && this.apiKey.trim().length > 0;
  }

  async getForecast(lat: number, lng: number): Promise<any> {
    if (!this.hasApiKey()) {
      throw new Error('No API key configured');
    }

    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=imperial`;
    
    console.log('🔧 FIXED: WeatherApiClient.getForecast - Making API call', {
      url: url.replace(this.apiKey, '[API_KEY]'),
      coordinates: { lat, lng }
    });

    try {
      const response = await fetch(url);
      
      console.log('🔧 FIXED: WeatherApiClient.getForecast - API response', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('🔧 FIXED: WeatherApiClient.getForecast - API data received', {
        hasData: !!data,
        hasList: !!data?.list,
        listLength: data?.list?.length || 0,
        hasCity: !!data?.city
      });

      return data;
    } catch (error) {
      console.error('🔧 FIXED: WeatherApiClient.getForecast - API call failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async getCurrentWeather(lat: number, lng: number): Promise<any> {
    if (!this.hasApiKey()) {
      throw new Error('No API key configured');
    }

    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=imperial`;
    
    console.log('🔧 FIXED: WeatherApiClient.getCurrentWeather - Making API call', {
      url: url.replace(this.apiKey, '[API_KEY]'),
      coordinates: { lat, lng }
    });

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getWeatherAndForecast(lat: number, lng: number): Promise<[any, any]> {
    console.log('🔧 FIXED: WeatherApiClient.getWeatherAndForecast - Making parallel API calls');
    
    const [currentData, forecastData] = await Promise.all([
      this.getCurrentWeather(lat, lng),
      this.getForecast(lat, lng)
    ]);

    return [currentData, forecastData];
  }
}
