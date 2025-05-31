
export interface WeatherWidgetProps {
  lat: number;
  lng: number;
  cityName: string;
  compact?: boolean;
  collapsible?: boolean;
}

export interface ForecastDay {
  date: string;
  temperature: {
    high: number;
    low: number;
  };
  description: string;
  icon: string;
  precipitationChance?: string;
}

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  cityName: string;
  forecast?: ForecastDay[];
}
