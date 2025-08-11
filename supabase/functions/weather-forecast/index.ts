import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ALLOWED_ORIGINS = new Set<string>([
  'https://ramble66.com',
  'https://www.ramble66.com',
  'http://localhost:5173'
]);

function getCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin'
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}


interface WeatherRequest {
  lat: number;
  lng: number;
  cityName: string;
}

serve(async (req) => {
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    if (!corsHeaders['Access-Control-Allow-Origin']) {
      return new Response('CORS origin not allowed', { status: 403, headers: { 'Vary': 'Origin' } });
    }
    return new Response(null, { headers: { ...corsHeaders, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Max-Age': '86400' } })
  }

  try {
    const { lat, lng, cityName }: WeatherRequest = await req.json()

    // Validate input
    const isNum = (n: any) => typeof n === 'number' && Number.isFinite(n);
    if (!isNum(lat) || !isNum(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180 || typeof cityName !== 'string' || cityName.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid request parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get the OpenWeatherMap API key from Supabase secrets
    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY')
    
    if (!apiKey) {
      console.error('❌ OPENWEATHERMAP_API_KEY not found in environment')
      return new Response(
        JSON.stringify({ error: 'Weather service configuration unavailable' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`🌤️ Fetching weather for ${cityName} at ${lat}, ${lng}`)

    // Fetch current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`
    const currentResponse = await fetch(currentWeatherUrl)
    
    if (!currentResponse.ok) {
      throw new Error(`Current weather API failed: ${currentResponse.status}`)
    }
    
    const currentData = await currentResponse.json()

    // Fetch forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`
    const forecastResponse = await fetch(forecastUrl)
    
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API failed: ${forecastResponse.status}`)
    }
    
    const forecastData = await forecastResponse.json()

    // Format current weather
    const current = {
      cityName: currentData.name || cityName,
      temperature: Math.round(currentData.main.temp),
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind?.speed) || 0 // Imperial units return mph directly
    }

    // Format forecast (next 5 days, taking one reading per day at noon)
    const forecast = forecastData.list
      .filter((_: any, index: number) => index % 8 === 0) // Every 8th item (roughly daily)
      .slice(0, 5)
      .map((item: any) => ({
        dateTime: item.dt_txt,
        temperature: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind?.speed) || 0
      }))

    const result = { current, forecast }
    
    console.log(`✅ Successfully fetched weather for ${cityName}`)
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600' } 
      }
    )

  } catch (error) {
    console.error('❌ Weather forecast error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch weather data',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})