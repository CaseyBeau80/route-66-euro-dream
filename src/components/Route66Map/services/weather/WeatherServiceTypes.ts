
export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  cityName: string;
  precipitationChance?: number;
}

export interface ForecastDay {
  date: string;
  dateString?: string; // Add explicit ISO date string for enhanced matching
  temperature: {
    high: number;
    low: number;
  };
  description: string;
  icon: string;
  precipitationChance: string;
  humidity: number;
  windSpeed: number;
}

export interface WeatherWithForecast extends WeatherData {
  forecast: ForecastDay[];
}

export interface OpenWeatherResponse {
  main: {
    temp: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind?: {
    speed: number;
  };
}

export interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    wind?: {
      speed: number;
    };
    pop?: number; // Probability of precipitation (0-1)
  }>;
}
