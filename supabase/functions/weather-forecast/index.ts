import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WeatherRequest {
  lat: number;
  lng: number;
  cityName: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { lat, lng, cityName }: WeatherRequest = await req.json()
    
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
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