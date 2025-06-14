
// Weather API Configuration
// Replace 'your_api_key_here' with your actual OpenWeatherMap API key
export const WEATHER_API_KEY = 'your_api_key_here';

// Note: The app will automatically check for API keys in localStorage first,
// then fall back to this config file. Users can set their API key through
// the weather widget in the app, or you can set it here for deployment.

// To enable live weather forecasts:
// 1. Go to https://openweathermap.org/api
// 2. Sign up for a free account (no credit card required)  
// 3. Generate your free API key (takes ~10 minutes to activate)
// 4. Either:
//    - Replace 'your_api_key_here' above with your actual 32-character key
//    - Or add your key via the weather API key input in the app

// Example of what a real API key looks like:
// export const WEATHER_API_KEY = 'abcd1234efgh5678ijkl9012mnop3456';

// Benefits of adding an API key:
// - Live 7-day weather forecasts with actual temperatures
// - Precipitation, humidity, and wind speed predictions  
// - Enhanced shared trip experiences for users
// - Historical weather data for dates beyond 7 days
