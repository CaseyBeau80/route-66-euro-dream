
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cityName, targetDate } = await req.json()
    
    if (!cityName) {
      return new Response(
        JSON.stringify({ error: 'City name is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the API key from Supabase secrets
    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY')
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Weather service not configured' }),
        { 
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Calculate days from today to determine if forecast is reliable
    const today = new Date()
    const requestDate = targetDate ? new Date(targetDate) : new Date()
    const daysFromToday = Math.ceil((requestDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
    
    // OpenWeatherMap's free API provides reliable forecasts for 0-6 days from today
    const isWithinReliableForecastRange = daysFromToday >= 0 && daysFromToday <= 6
    
    console.log('Weather forecast request:', {
      cityName,
      targetDate: requestDate.toISOString(),
      daysFromToday,
      isWithinReliableForecastRange,
      apiKeyConfigured: !!apiKey
    })

    // Clean city name for geocoding
    const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim()
    
    // Get coordinates
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`
    const geoResponse = await fetch(geocodingUrl)
    
    if (!geoResponse.ok) {
      throw new Error('Geocoding failed')
    }
    
    const geoData = await geoResponse.json()
    if (!geoData || geoData.length === 0) {
      throw new Error('City not found')
    }

    // Prefer US results, fallback to first result
    const location = geoData.find((r: any) => r.country === 'US') || geoData[0]
    const { lat, lon } = location

    let forecast
    let isActualLiveForecast = false

    if (isWithinReliableForecastRange) {
      try {
        // Get weather forecast for reliable range
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
        const weatherResponse = await fetch(weatherUrl)
        
        if (!weatherResponse.ok) {
          throw new Error('Weather API failed')
        }
        
        const weatherData = await weatherResponse.json()
        if (!weatherData.list || weatherData.list.length === 0) {
          throw new Error('No weather data available')
        }

        // Find best match for target date if provided
        let bestMatch = weatherData.list[0]
        if (targetDate) {
          const targetDateString = new Date(targetDate).toISOString().split('T')[0]
          const dateMatch = weatherData.list.find((item: any) => {
            const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0]
            return itemDate === targetDateString
          })
          if (dateMatch) {
            bestMatch = dateMatch
            isActualLiveForecast = true
          }
        }

        forecast = {
          temperature: Math.round(bestMatch.main.temp),
          highTemp: Math.round(bestMatch.main.temp_max),
          lowTemp: Math.round(bestMatch.main.temp_min),
          description: bestMatch.weather[0]?.description || 'Partly Cloudy',
          icon: bestMatch.weather[0]?.icon || '02d',
          humidity: bestMatch.main.humidity,
          windSpeed: Math.round(bestMatch.wind?.speed || 0),
          precipitationChance: Math.round((bestMatch.pop || 0) * 100),
          cityName: cityName,
          forecastDate: targetDate ? new Date(targetDate) : new Date(bestMatch.dt * 1000),
          isActualForecast: isActualLiveForecast,
          source: 'live_forecast'
        }

        console.log('Live forecast returned:', {
          city: cityName,
          daysFromToday,
          isActualLiveForecast,
          temperature: forecast.temperature,
          withinReliableRange: true
        })

      } catch (error) {
        console.warn('Live forecast failed, creating estimated forecast:', error)
        isActualLiveForecast = false
      }
    }

    // If we're outside reliable range or live forecast failed, create estimated forecast
    if (!forecast || !isActualLiveForecast) {
      // Create estimated forecast based on seasonal patterns
      const month = requestDate.getMonth() + 1
      const day = requestDate.getDate()
      
      // Simple seasonal temperature estimation (this is just an example)
      let baseTemp = 70 // Default moderate temperature
      if (month >= 6 && month <= 8) baseTemp = 80 // Summer
      else if (month >= 12 || month <= 2) baseTemp = 45 // Winter
      else if (month >= 3 && month <= 5) baseTemp = 65 // Spring
      else if (month >= 9 && month <= 11) baseTemp = 60 // Fall
      
      // Add some variation
      const variation = Math.sin((day / 30) * Math.PI) * 10
      const estimatedTemp = Math.round(baseTemp + variation)

      forecast = {
        temperature: estimatedTemp,
        highTemp: estimatedTemp + 5,
        lowTemp: estimatedTemp - 8,
        description: 'Partly Cloudy',
        icon: '02d',
        humidity: 50,
        windSpeed: 8,
        precipitationChance: 20,
        cityName: cityName,
        forecastDate: requestDate,
        isActualForecast: false, // Always false for estimates
        source: isWithinReliableForecastRange ? 'live_forecast' : 'historical_fallback'
      }

      console.log('Estimated forecast returned:', {
        city: cityName,
        daysFromToday,
        isActualForecast: false,
        temperature: forecast.temperature,
        withinReliableRange: isWithinReliableForecastRange,
        reason: isWithinReliableForecastRange ? 'api_failure_fallback' : 'beyond_reliable_range'
      })
    }

    return new Response(
      JSON.stringify(forecast),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Weather forecast error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Weather service temporarily unavailable',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
