import { corsHeaders } from '../_shared/cors.ts'

interface WeatherRequest {
  lat: number
  lng: number
  cityName: string
  targetDate?: string
}

interface OpenWeatherResponse {
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg?: number
  }
  visibility?: number
  dt: number
  name: string
}

interface ForecastResponse {
  list: Array<{
    dt: number
    main: {
      temp: number
      feels_like: number
      humidity: number
    }
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
    wind: {
      speed: number
    }
    dt_txt: string
  }>
  city: {
    name: string
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY')
    if (!apiKey) {
      console.error('❌ OPENWEATHERMAP_API_KEY not found in environment')
      return new Response(
        JSON.stringify({ error: 'Weather API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { lat, lng, cityName }: WeatherRequest = await req.json()
    
    console.log(`🌤️ Weather request for ${cityName} (${lat}, ${lng})`)

    // Get current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`
    const currentResponse = await fetch(currentUrl)
    
    if (!currentResponse.ok) {
      throw new Error(`Current weather API error: ${currentResponse.status}`)
    }
    
    const currentData: OpenWeatherResponse = await currentResponse.json()

    // Get 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`
    const forecastResponse = await fetch(forecastUrl)
    
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.status}`)
    }
    
    const forecastData: ForecastResponse = await forecastResponse.json()

    // Process the data
    const weather = {
      current: {
        temperature: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        windSpeed: Math.round(currentData.wind.speed),
        windDirection: currentData.wind.deg,
        visibility: currentData.visibility ? Math.round(currentData.visibility / 1609.34) : null, // Convert to miles
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        cityName: currentData.name,
        timestamp: currentData.dt
      },
      forecast: forecastData.list.slice(0, 8).map(item => ({
        temperature: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        timestamp: item.dt,
        dateTime: item.dt_txt
      }))
    }

    console.log(`✅ Weather data retrieved for ${cityName}`)

    return new Response(
      JSON.stringify(weather),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Weather API error:', error)
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