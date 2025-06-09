
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface WeatherValidationResult {
  isValid: boolean;
  isLiveForecast: boolean;
  isSeasonalEstimate: boolean;
  hasError: boolean;
  debugInfo: string;
}

export const validateWeatherData = (weather: any, segmentEndCity: string): WeatherValidationResult => {
  console.log(`🔍 WeatherValidation: Validating data for ${segmentEndCity}:`, weather);

  // Check if weather data exists at all
  if (!weather) {
    console.log(`❌ WeatherValidation: No weather data for ${segmentEndCity}`);
    return {
      isValid: false,
      isLiveForecast: false,
      isSeasonalEstimate: false,
      hasError: true,
      debugInfo: "No weather data provided"
    };
  }

  // Check if this is forecast data structure
  if (weather.isActualForecast !== undefined) {
    const forecastWeather = weather as ForecastWeatherData;
    
    // Validate live forecast data
    if (forecastWeather.isActualForecast) {
      const hasValidTemps = forecastWeather.highTemp !== undefined && 
                           forecastWeather.lowTemp !== undefined &&
                           forecastWeather.highTemp > 0 && 
                           forecastWeather.lowTemp > 0;
      
      const hasDescription = forecastWeather.description && 
                           forecastWeather.description.trim() !== '';
      
      if (hasValidTemps && hasDescription) {
        console.log(`✅ WeatherValidation: Valid live forecast for ${segmentEndCity}`);
        return {
          isValid: true,
          isLiveForecast: true,
          isSeasonalEstimate: false,
          hasError: false,
          debugInfo: "Valid live forecast with complete data"
        };
      } else {
        console.log(`⚠️ WeatherValidation: Partial live forecast data for ${segmentEndCity}:`, {
          hasValidTemps,
          hasDescription,
          highTemp: forecastWeather.highTemp,
          lowTemp: forecastWeather.lowTemp,
          description: forecastWeather.description
        });
        return {
          isValid: false,
          isLiveForecast: false,
          isSeasonalEstimate: false,
          hasError: true,
          debugInfo: "Partial forecast data - missing required fields"
        };
      }
    } else {
      // This is seasonal/historical data
      console.log(`📊 WeatherValidation: Seasonal estimate for ${segmentEndCity}`);
      return {
        isValid: true,
        isLiveForecast: false,
        isSeasonalEstimate: true,
        hasError: false,
        debugInfo: "Seasonal estimate based on historical data"
      };
    }
  } else {
    // Regular current weather data
    const hasTemp = weather.temperature !== undefined && weather.temperature > 0;
    const hasDescription = weather.description && weather.description.trim() !== '';
    const hasCityName = weather.cityName && weather.cityName.trim() !== '';
    
    if (hasTemp && hasDescription && hasCityName) {
      console.log(`✅ WeatherValidation: Valid current weather for ${segmentEndCity}`);
      return {
        isValid: true,
        isLiveForecast: false,
        isSeasonalEstimate: false,
        hasError: false,
        debugInfo: "Valid current weather data"
      };
    } else {
      console.log(`⚠️ WeatherValidation: Invalid current weather for ${segmentEndCity}:`, {
        hasTemp,
        hasDescription,
        hasCityName,
        weather
      });
      return {
        isValid: false,
        isLiveForecast: false,
        isSeasonalEstimate: false,
        hasError: true,
        debugInfo: "Invalid current weather data"
      };
    }
  }
};

export const getWeatherDisplayType = (
  validation: WeatherValidationResult,
  error: string | null,
  retryCount: number
): 'live-forecast' | 'seasonal-estimate' | 'service-unavailable' | 'loading' => {
  // Priority 1: If there's an error and invalid data, show service unavailable
  if (error && !validation.isValid) {
    console.log(`❌ WeatherDisplayType: Service unavailable due to error and invalid data`);
    return 'service-unavailable';
  }
  
  // Priority 2: If data is valid and it's a live forecast, show live forecast
  if (validation.isValid && validation.isLiveForecast) {
    console.log(`🔮 WeatherDisplayType: Live forecast available`);
    return 'live-forecast';
  }
  
  // Priority 3: If data is valid but seasonal, show seasonal estimate
  if (validation.isValid && validation.isSeasonalEstimate) {
    console.log(`📊 WeatherDisplayType: Seasonal estimate available`);
    return 'seasonal-estimate';
  }
  
  // Priority 4: If there's an error or invalid data after retries, show service unavailable
  if (error || (!validation.isValid && retryCount >= 1)) {
    console.log(`❌ WeatherDisplayType: Service unavailable after retries`);
    return 'service-unavailable';
  }
  
  // Default: Loading state
  console.log(`⏳ WeatherDisplayType: Loading state`);
  return 'loading';
};
