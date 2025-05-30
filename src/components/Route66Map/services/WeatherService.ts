
interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  cityName: string;
}

export class WeatherService {
  private static instance: WeatherService;
  private apiKey: string | null = null;

  private constructor() {
    this.refreshApiKey();
  }

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  private refreshApiKey(): void {
    this.apiKey = localStorage.getItem('openweathermap_api_key');
    console.log('🔑 WeatherService: API key refreshed from localStorage:', this.apiKey ? 'Present' : 'Missing');
  }

  setApiKey(apiKey: string): void {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      throw new Error('API key cannot be empty');
    }
    
    this.apiKey = trimmedKey;
    localStorage.setItem('openweathermap_api_key', trimmedKey);
    console.log('🔑 WeatherService: API key set and saved to localStorage');
  }

  hasApiKey(): boolean {
    // Always refresh from localStorage to ensure we have the latest key
    this.refreshApiKey();
    return !!this.apiKey;
  }

  private validateApiKey(): boolean {
    if (!this.apiKey) {
      console.warn('❌ WeatherService: No API key available');
      return false;
    }
    
    // Basic validation - OpenWeatherMap API keys are typically 32 characters
    if (this.apiKey.length < 10) {
      console.warn('❌ WeatherService: API key appears to be too short');
      return false;
    }
    
    return true;
  }

  async getWeatherData(lat: number, lng: number, cityName: string): Promise<WeatherData | null> {
    console.log(`🌤️ WeatherService: Fetching weather for ${cityName} (${lat}, ${lng})`);
    
    // Refresh API key from localStorage before making request
    this.refreshApiKey();
    
    if (!this.validateApiKey()) {
      console.warn('❌ WeatherService: Invalid or missing API key');
      return null;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=imperial`;
      console.log('🌐 WeatherService: Making API request to OpenWeatherMap');
      
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 401) {
          console.error('❌ WeatherService: Invalid API key (401 Unauthorized)');
          throw new Error('Invalid API key');
        } else if (response.status === 404) {
          console.error('❌ WeatherService: Location not found (404)');
          throw new Error('Location not found');
        } else {
          console.error(`❌ WeatherService: API error ${response.status}: ${response.statusText}`);
          throw new Error(`Weather API error: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('✅ WeatherService: Successfully received weather data');
      
      const weatherData = {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind?.speed || 0),
        cityName: cityName
      };
      
      console.log('🌤️ WeatherService: Processed weather data:', weatherData);
      return weatherData;
    } catch (error) {
      console.error('❌ WeatherService: Error fetching weather data:', error);
      return null;
    }
  }
}
