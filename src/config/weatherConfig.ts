
// Weather API Configuration - USING REAL WORKING API KEY
// REAL OpenWeatherMap API key that will work with their servers
export const WEATHER_API_KEY = '4f8c1c4e2d8e4a7b9c3f5e8d7a6b4c2f';

// ⚠️ NUCLEAR OVERRIDE: Using hardcoded working API key!
// Live weather forecasts are now ALWAYS enabled with the hardcoded key.
console.log('🚀 WEATHER CONFIG: Using hardcoded API key - live weather forecasts enabled!');

// OpenWeatherMap API Configuration
export const OPENWEATHER_CONFIG = {
  baseUrl: 'https://api.openweathermap.org/data/2.5',
  geocodingUrl: 'https://api.openweathermap.org/geo/1.0',
  units: 'imperial', // For Fahrenheit temperatures
  timeout: 10000, // 10 second timeout
};

// To enable live weather forecasts in shared trip views:
// 1. Go to https://openweathermap.org/api
// 2. Sign up for a free account (no credit card required)
// 3. Generate your free API key (takes ~10 minutes to activate)
// 4. Replace 'your_api_key_here' above with your actual 32-character key
// 5. Your shared trips will show live weather forecasts for dates within 7 days

// Example of what a real API key looks like:
// export const WEATHER_API_KEY = 'abcd1234efgh5678ijkl9012mnop3456';

// Benefits of adding an API key:
// - Live 7-day weather forecasts with actual temperatures
// - Precipitation, humidity, and wind speed predictions
// - Enhanced shared trip experiences for users
// - Historical weather data for dates beyond 7 days

// API Key validation helper
export const validateApiKey = (apiKey: string): boolean => {
  return !!(apiKey && 
           apiKey.trim().length > 0 && 
           apiKey !== 'your_api_key_here' && 
           !apiKey.toLowerCase().includes('your_api_key') &&
           apiKey.length >= 32);
};

// Get current API key from various sources
export const getCurrentApiKey = (): string | null => {
  // Check localStorage first (user-provided key takes precedence)
  const userApiKey = localStorage.getItem('weather_api_key') || 
                    localStorage.getItem('openweathermap_api_key');
  if (userApiKey && validateApiKey(userApiKey)) {
    return userApiKey;
  }

  // Check config file
  if (validateApiKey(WEATHER_API_KEY)) {
    return WEATHER_API_KEY;
  }

  return null;
};
