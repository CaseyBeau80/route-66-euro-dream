
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherRequest {
  cityName: string;
  targetDate: string;
  segmentDay: number;
}

interface WeatherResponse {
  temperature: number;
  highTemp: number;
  lowTemp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
  cityName: string;
  isActualForecast: boolean;
  source: 'live_forecast' | 'historical_fallback';
  forecastDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cityName, targetDate, segmentDay }: WeatherRequest = await req.json();
    
    console.log('🌤️ PUBLIC-WEATHER: Request received:', { cityName, targetDate, segmentDay });

    // Get API key from Supabase secrets
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    
    if (!apiKey || apiKey.includes('your_api_key') || apiKey.length < 20) {
      console.log('❌ PUBLIC-WEATHER: No valid API key, returning fallback');
      return createFallbackResponse(cityName, targetDate, segmentDay);
    }

    const targetDateObj = new Date(targetDate);
    const daysFromNow = Math.ceil((targetDateObj.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    // Only attempt live weather if within reasonable range
    if (daysFromNow >= -1 && daysFromNow <= 7) {
      try {
        const liveWeather = await fetchLiveWeather(cityName, targetDateObj, apiKey);
        if (liveWeather) {
          console.log('✅ PUBLIC-WEATHER: Live weather success for', cityName);
          return new Response(JSON.stringify(liveWeather), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
      } catch (error) {
        console.warn('⚠️ PUBLIC-WEATHER: Live weather failed:', error);
      }
    }

    // Fall back to seasonal estimate
    console.log('🔄 PUBLIC-WEATHER: Using fallback for', cityName);
    return createFallbackResponse(cityName, targetDate, segmentDay);

  } catch (error) {
    console.error('❌ PUBLIC-WEATHER: Error:', error);
    return new Response(
      JSON.stringify({ error: 'Weather service temporarily unavailable' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

async function fetchLiveWeather(cityName: string, targetDate: Date, apiKey: string): Promise<WeatherResponse | null> {
  try {
    // Get coordinates
    const coords = await getCoordinates(cityName, apiKey);
    if (!coords) return null;

    // Get forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    const response = await fetch(forecastUrl);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data.list || data.list.length === 0) return null;

    // Find best match for target date
    const targetDateString = targetDate.toISOString().split('T')[0];
    const bestMatch = data.list.find((item: any) => {
      const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
      return itemDate === targetDateString;
    }) || data.list[0];

    return {
      temperature: Math.round(bestMatch.main.temp),
      highTemp: Math.round(bestMatch.main.temp_max),
      lowTemp: Math.round(bestMatch.main.temp_min),
      description: bestMatch.weather[0]?.description || 'Partly Cloudy',
      icon: bestMatch.weather[0]?.icon || '02d',
      humidity: bestMatch.main.humidity || 50,
      windSpeed: Math.round(bestMatch.wind?.speed || 0),
      precipitationChance: Math.round((bestMatch.pop || 0) * 100),
      cityName,
      isActualForecast: true,
      source: 'live_forecast' as const,
      forecastDate: targetDate.toISOString()
    };
  } catch (error) {
    console.error('❌ fetchLiveWeather error:', error);
    return null;
  }
}

async function getCoordinates(cityName: string, apiKey: string) {
  try {
    const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)},US&limit=1&appid=${apiKey}`;
    
    const response = await fetch(geocodingUrl);
    if (!response.ok) return null;

    const data = await response.json();
    if (!data || data.length === 0) return null;

    return { lat: data[0].lat, lng: data[0].lon };
  } catch (error) {
    console.error('❌ getCoordinates error:', error);
    return null;
  }
}

function createFallbackResponse(cityName: string, targetDate: string, segmentDay: number): Response {
  const targetDateObj = new Date(targetDate);
  const month = targetDateObj.getMonth();
  
  // Seasonal temperature calculation
  const seasonalTemps = [
    45, 48, 58, 68, 78, 88, 92, 90, 82, 70, 58, 48
  ];
  
  // City-specific variations
  const cityHash = cityName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const variation = (Math.abs(cityHash) % 20) - 10;
  const baseTemp = seasonalTemps[month] + variation;
  
  const fallbackWeather: WeatherResponse = {
    temperature: baseTemp,
    highTemp: baseTemp + 8,
    lowTemp: baseTemp - 8,
    description: getSeasonalDescription(month),
    icon: getSeasonalIcon(month),
    humidity: 45 + (Math.abs(cityHash) % 30),
    windSpeed: 5 + (Math.abs(cityHash) % 10),
    precipitationChance: getSeasonalPrecipitation(month),
    cityName,
    isActualForecast: false,
    source: 'historical_fallback' as const,
    forecastDate: targetDate
  };
  
  return new Response(JSON.stringify(fallbackWeather), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

function getSeasonalDescription(month: number): string {
  const descriptions = [
    'Partly Cloudy', 'Partly Cloudy', 'Mostly Sunny', 'Sunny', 'Sunny', 'Hot',
    'Hot', 'Hot', 'Warm', 'Pleasant', 'Cool', 'Partly Cloudy'
  ];
  return descriptions[month];
}

function getSeasonalIcon(month: number): string {
  const icons = [
    '02d', '02d', '01d', '01d', '01d', '01d',
    '01d', '01d', '01d', '02d', '02d', '02d'
  ];
  return icons[month];
}

function getSeasonalPrecipitation(month: number): number {
  const precipitation = [
    30, 25, 20, 15, 10, 5, 5, 5, 10, 15, 20, 25
  ];
  return precipitation[month];
}

serve(handler);
