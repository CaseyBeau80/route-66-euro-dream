
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
    const requestBody = await req.json()
    console.log('🌤️ FIXED DATE CALC: Enhanced request processing:', {
      method: req.method,
      hasBody: !!requestBody,
      bodyKeys: requestBody ? Object.keys(requestBody) : [],
      receivedCityName: requestBody?.cityName,
      receivedTargetDate: requestBody?.targetDate,
      requestBodyFull: requestBody,
      fixedDateCalculation: true
    });

    // Handle both old and new parameter formats for compatibility
    const cityName = requestBody?.cityName || requestBody?.city;
    const targetDate = requestBody?.targetDate;
    
    if (!cityName) {
      console.error('❌ FIXED DATE CALC: Missing city name in request:', requestBody);
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
      console.error('❌ FIXED DATE CALC: OpenWeatherMap API key not configured');
      return new Response(
        JSON.stringify({ 
          temperature: 75,
          highTemp: 82,
          lowTemp: 68,
          description: 'Partly Cloudy',
          icon: '02d',
          humidity: 65,
          windSpeed: 8,
          precipitationChance: 20,
          cityName: cityName,
          forecastDate: targetDate ? new Date(targetDate) : new Date(),
          isActualForecast: false,
          source: 'historical_fallback'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // FIXED DATE CALC: Corrected date processing to properly handle trip days
    const today = new Date()
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    const requestDate = targetDate ? new Date(targetDate) : new Date()
    const normalizedRequestDate = new Date(requestDate.getFullYear(), requestDate.getMonth(), requestDate.getDate())
    
    // FIXED: Use proper date difference calculation 
    const timeDifference = normalizedRequestDate.getTime() - normalizedToday.getTime()
    const daysFromToday = Math.round(timeDifference / (24 * 60 * 60 * 1000))
    
    // FIXED DATE CALC: Correct forecast range validation - 0-4 days for reliable forecasts
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 4
    const targetDateString = normalizedRequestDate.toISOString().split('T')[0]
    
    console.log('🌤️ FIXED DATE CALC: Corrected weather forecast request with proper day calculation:', {
      cityName,
      targetDate: requestDate.toISOString(),
      targetDateLocal: requestDate.toLocaleDateString(),
      normalizedTargetDate: normalizedRequestDate.toISOString(),
      normalizedToday: normalizedToday.toISOString(),
      targetDateString,
      timeDifference,
      daysFromToday,
      isWithinForecastRange,
      correctForecastRange: '0-4 days only',
      willAttemptLiveForecast: isWithinForecastRange,
      apiKeyConfigured: !!apiKey,
      dateCalculationFixed: true,
      dayZeroIsToday: daysFromToday === 0 ? 'TODAY_SHOULD_GET_LIVE_WEATHER' : 'not_today'
    })

    // Clean city name for geocoding
    const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim()

    let forecast = null
    let actuallyGotLiveData = false

    // FIXED DATE CALC: Only attempt live forecast for dates strictly within range
    if (isWithinForecastRange) {
      try {
        // Get coordinates with enhanced error handling
        console.log('🗺️ FIXED DATE CALC: Getting coordinates for:', cleanCityName)
        const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`
        const geoResponse = await fetch(geocodingUrl)
        
        if (!geoResponse.ok) {
          throw new Error(`Geocoding failed: ${geoResponse.status}`)
        }
        
        const geoData = await geoResponse.json()
        if (!geoData || geoData.length === 0) {
          throw new Error(`City not found: ${cleanCityName}`)
        }

        // Prefer US results, fallback to first result
        const location = geoData.find((r: any) => r.country === 'US') || geoData[0]
        const { lat, lon } = location

        console.log('🗺️ FIXED DATE CALC: Coordinates found:', {
          cityName: cleanCityName,
          lat,
          lon,
          country: location.country,
          state: location.state
        })

        // Get current weather for today (day 0) or forecast for future days
        let weatherData
        if (daysFromToday === 0) {
          // FIXED: For today (day 0), get current weather
          console.log('🌡️ FIXED DATE CALC: Getting current weather for TODAY (day 0)')
          const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
          const currentResponse = await fetch(currentWeatherUrl)
          
          if (!currentResponse.ok) {
            throw new Error(`Current weather API failed: ${currentResponse.status}`)
          }
          
          const currentData = await currentResponse.json()
          
          forecast = {
            temperature: Math.round(currentData.main.temp),
            highTemp: Math.round(currentData.main.temp_max),
            lowTemp: Math.round(currentData.main.temp_min),
            description: currentData.weather[0]?.description || 'Clear',
            icon: currentData.weather[0]?.icon || '01d',
            humidity: currentData.main.humidity,
            windSpeed: Math.round(currentData.wind?.speed || 0),
            precipitationChance: 0, // Current weather doesn't have precipitation chance
            cityName: cityName,
            forecastDate: targetDate ? new Date(targetDate) : new Date(),
            isActualForecast: true,
            source: 'live_forecast'
          }
          
          actuallyGotLiveData = true
          console.log('✅ FIXED DATE CALC: Got current weather for TODAY (day 0):', {
            city: cityName,
            temperature: forecast.temperature,
            source: 'current_weather_api',
            isActualForecast: true,
            dayZeroLiveWeather: true
          })
          
        } else {
          // For future days (1-4), get forecast
          console.log('🔮 FIXED DATE CALC: Getting forecast for future day:', daysFromToday)
          const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
          const weatherResponse = await fetch(weatherUrl)
          
          if (!weatherResponse.ok) {
            throw new Error(`Weather forecast API failed: ${weatherResponse.status}`)
          }
          
          weatherData = await weatherResponse.json()
          if (!weatherData.list || weatherData.list.length === 0) {
            throw new Error('No forecast data available')
          }

          // Filter all intervals for the target date
          const targetDateIntervals = weatherData.list.filter((item: any) => {
            const itemDate = new Date(item.dt * 1000)
            const itemDateString = itemDate.toISOString().split('T')[0]
            return itemDateString === targetDateString
          })

          if (targetDateIntervals.length > 0) {
            // Calculate daily aggregated values
            const allTemperatures = targetDateIntervals.flatMap((item: any) => [
              item.main.temp,
              item.main.temp_max,
              item.main.temp_min
            ]).filter(temp => temp !== undefined && !isNaN(temp))

            const allMainTemps = targetDateIntervals.map((item: any) => item.main.temp)

            const dailyHigh = Math.max(...allTemperatures)
            const dailyLow = Math.min(...allTemperatures)
            const dailyAverage = allMainTemps.reduce((sum, temp) => sum + temp, 0) / allMainTemps.length

            // Select representative interval (afternoon preferred)
            const representativeInterval = targetDateIntervals.find((item: any) => {
              const hour = new Date(item.dt * 1000).getHours()
              return hour >= 12 && hour <= 15
            }) || targetDateIntervals[Math.floor(targetDateIntervals.length / 2)] || targetDateIntervals[0]

            forecast = {
              temperature: Math.round(dailyAverage),
              highTemp: Math.round(dailyHigh),
              lowTemp: Math.round(dailyLow),
              description: representativeInterval.weather[0]?.description || 'Partly Cloudy',
              icon: representativeInterval.weather[0]?.icon || '02d',
              humidity: representativeInterval.main.humidity,
              windSpeed: Math.round(representativeInterval.wind?.speed || 0),
              precipitationChance: Math.round((representativeInterval.pop || 0) * 100),
              cityName: cityName,
              forecastDate: targetDate ? new Date(targetDate) : new Date(representativeInterval.dt * 1000),
              isActualForecast: true,
              source: 'live_forecast'
            }

            actuallyGotLiveData = true
            console.log('✅ FIXED DATE CALC: Got live forecast data:', {
              city: cityName,
              daysFromToday,
              temperature: forecast.temperature,
              highTemp: forecast.highTemp,
              lowTemp: forecast.lowTemp,
              source: 'forecast_api',
              isActualForecast: true
            })
          } else {
            throw new Error('No forecast data for target date')
          }
        }

      } catch (error) {
        console.error('❌ FIXED DATE CALC: Live weather fetch failed for', cityName, error)
        actuallyGotLiveData = false
      }
    } else {
      console.log('📅 FIXED DATE CALC: Date outside strict forecast range, using historical estimate:', {
        cityName,
        daysFromToday,
        targetDate: targetDateString,
        strictRange: '0-4 days',
        isWithinRange: false
      })
    }

    // FIXED DATE CALC: Create historical estimate if no live data was obtained
    if (!forecast || !actuallyGotLiveData) {
      // Create estimated forecast based on seasonal patterns
      const month = requestDate.getMonth() + 1
      const day = requestDate.getDate()
      
      // Simple seasonal temperature estimation
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
        isActualForecast: false, // FIXED DATE CALC: FALSE for historical estimates
        source: 'historical_fallback' // FIXED DATE CALC: Proper source for estimates
      }

      console.log('📊 FIXED DATE CALC: Created historical estimate:', {
        city: cityName,
        daysFromToday,
        isActualForecast: false,
        source: 'historical_fallback',
        temperature: forecast.temperature,
        reason: isWithinForecastRange ? 'api_failure_fallback' : 'beyond_forecast_range'
      })
    }

    console.log('🎯 FIXED DATE CALC: Final response validation:', {
      cityName,
      daysFromToday,
      source: forecast.source,
      isActualForecast: forecast.isActualForecast,
      temperature: forecast.temperature,
      actuallyGotLiveData,
      withinCorrectRange: isWithinForecastRange,
      shouldDisplayAsLive: forecast.source === 'live_forecast' && forecast.isActualForecast === true,
      shouldDisplayAsHistorical: forecast.source === 'historical_fallback' && forecast.isActualForecast === false,
      dateCalculationFixed: true,
      dayZeroCheck: daysFromToday === 0 ? 'TODAY_SHOULD_BE_LIVE' : 'future_day'
    });

    return new Response(
      JSON.stringify(forecast),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ FIXED DATE CALC: Weather forecast error:', error)
    
    // Always return a fallback response
    return new Response(
      JSON.stringify({ 
        temperature: 75,
        highTemp: 82,
        lowTemp: 68,
        description: 'Partly Cloudy',
        icon: '02d',
        humidity: 50,
        windSpeed: 8,
        precipitationChance: 20,
        cityName: 'Unknown',
        forecastDate: new Date(),
        isActualForecast: false,
        source: 'historical_fallback'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
