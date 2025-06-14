
// Weather API Configuration
// Replace 'your_api_key_here' with your actual OpenWeatherMap API key
export const WEATHER_API_KEY = 'your_api_key_here';

// ⚠️ WARNING: Default placeholder API key detected!
// Live weather forecasts will not work until you set a valid API key.
if (WEATHER_API_KEY === 'your_api_key_here') {
  console.warn('🔑 WEATHER CONFIG WARNING: Using placeholder API key. Live weather forecasts disabled.');
  console.warn('📝 To enable live weather:');
  console.warn('   1. Get a free API key from https://openweathermap.org/api');
  console.warn('   2. Replace WEATHER_API_KEY in src/config/weatherConfig.ts');
  console.warn('   3. Or add your key via the weather API key input in the app');
}

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
