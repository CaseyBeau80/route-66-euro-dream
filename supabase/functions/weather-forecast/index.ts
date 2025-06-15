
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
    console.log('🌤️ FIXED EDGE FUNCTION: Enhanced request processing:', {
      method: req.method,
      hasBody: !!requestBody,
      bodyKeys: requestBody ? Object.keys(requestBody) : [],
      receivedCityName: requestBody?.cityName,
      receivedTargetDate: requestBody?.targetDate,
      requestBodyFull: requestBody
    });

    // FIXED: Handle both old and new parameter formats for compatibility
    const cityName = requestBody?.cityName || requestBody?.city;
    const targetDate = requestBody?.targetDate;
    
    if (!cityName) {
      console.error('❌ FIXED EDGE FUNCTION: Missing city name in request:', requestBody);
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
      console.error('❌ FIXED EDGE FUNCTION: OpenWeatherMap API key not configured');
      return new Response(
        JSON.stringify({ error: 'Weather service not configured' }),
        { 
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Enhanced date processing with consistent local timezone handling
    const today = new Date()
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    const requestDate = targetDate ? new Date(targetDate) : new Date()
    const normalizedRequestDate = new Date(requestDate.getFullYear(), requestDate.getMonth(), requestDate.getDate())
    
    const daysFromToday = Math.ceil((normalizedRequestDate.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000))
    
    // Reliable forecast range 0-6 days for live weather with aggregation
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 6
    const targetDateString = normalizedRequestDate.toISOString().split('T')[0]
    
    console.log('🌤️ FIXED EDGE FUNCTION: Enhanced weather forecast request with proper parameter handling:', {
      cityName,
      targetDate: requestDate.toISOString(),
      targetDateLocal: requestDate.toLocaleDateString(),
      normalizedTargetDate: normalizedRequestDate.toISOString(),
      targetDateString,
      daysFromToday,
      isWithinForecastRange,
      willAggregateTemperatures: isWithinForecastRange,
      apiKeyConfigured: !!apiKey,
      parameterFormat: 'fixed_cityName_targetDate'
    })

    // Clean city name for geocoding
    const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim()
    
    // Get coordinates with enhanced error handling
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`
    const geoResponse = await fetch(geocodingUrl)
    
    if (!geoResponse.ok) {
      console.error('❌ FIXED EDGE FUNCTION: Geocoding failed:', geoResponse.status, geoResponse.statusText)
      throw new Error('Geocoding failed')
    }
    
    const geoData = await geoResponse.json()
    if (!geoData || geoData.length === 0) {
      console.error('❌ FIXED EDGE FUNCTION: City not found for:', cleanCityName)
      throw new Error('City not found')
    }

    // Prefer US results, fallback to first result
    const location = geoData.find((r: any) => r.country === 'US') || geoData[0]
    const { lat, lon } = location

    console.log('🌤️ FIXED EDGE FUNCTION: Coordinates found:', {
      cityName: cleanCityName,
      lat,
      lon,
      country: location.country,
      state: location.state
    })

    let forecast
    let isActualLiveForecast = false

    if (isWithinForecastRange) {
      try {
        // Get weather forecast for aggregation range
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
        const weatherResponse = await fetch(weatherUrl)
        
        if (!weatherResponse.ok) {
          console.error('❌ FIXED EDGE FUNCTION: Weather API failed:', weatherResponse.status, weatherResponse.statusText)
          throw new Error('Weather API failed')
        }
        
        const weatherData = await weatherResponse.json()
        if (!weatherData.list || weatherData.list.length === 0) {
          console.error('❌ FIXED EDGE FUNCTION: No weather data available for:', cityName)
          throw new Error('No weather data available')
        }

        console.log('🌤️ FIXED EDGE FUNCTION: Weather API response received:', {
          cityName,
          listLength: weatherData.list.length,
          firstItemDate: weatherData.list[0]?.dt_txt,
          lastItemDate: weatherData.list[weatherData.list.length - 1]?.dt_txt,
          targetDateString,
          willPerformAggregation: true
        })

        // 🔥 AGGREGATION LOGIC: Filter all intervals for the target date
        const targetDateIntervals = weatherData.list.filter((item: any) => {
          const itemDate = new Date(item.dt * 1000)
          const itemDateString = itemDate.toISOString().split('T')[0]
          return itemDateString === targetDateString
        })

        console.log('🌡️ FIXED EDGE FUNCTION: Found intervals for target date:', {
          targetDateString,
          intervalCount: targetDateIntervals.length,
          intervals: targetDateIntervals.map((item: any) => ({
            time: new Date(item.dt * 1000).toISOString(),
            temp: item.main.temp,
            tempMax: item.main.temp_max,
            tempMin: item.main.temp_min
          }))
        })

        if (targetDateIntervals.length > 0) {
          // 🔥 TEMPERATURE AGGREGATION: Calculate daily aggregated values
          const allTemperatures = targetDateIntervals.flatMap((item: any) => [
            item.main.temp,
            item.main.temp_max,
            item.main.temp_min
          ]).filter(temp => temp !== undefined && !isNaN(temp))

          const allMainTemps = targetDateIntervals.map((item: any) => item.main.temp)

          // Calculate aggregated values
          const dailyHigh = Math.max(...allTemperatures)
          const dailyLow = Math.min(...allTemperatures)
          const dailyAverage = allMainTemps.reduce((sum, temp) => sum + temp, 0) / allMainTemps.length

          console.log('🌡️ FIXED EDGE FUNCTION: Daily temperature calculations:', {
            cityName,
            targetDateString,
            calculatedHigh: dailyHigh,
            calculatedLow: dailyLow,
            calculatedAverage: dailyAverage,
            intervalCount: targetDateIntervals.length
          })

          // Select representative interval (midday preferably, or first available)
          const representativeInterval = targetDateIntervals.find((item: any) => {
            const hour = new Date(item.dt * 1000).getHours()
            return hour >= 12 && hour <= 15 // Prefer midday intervals
          }) || targetDateIntervals[Math.floor(targetDateIntervals.length / 2)] || targetDateIntervals[0]

          // 🔥 CREATE AGGREGATED FORECAST with daily temperature ranges
          forecast = {
            temperature: Math.round(dailyAverage), // Use calculated average
            highTemp: Math.round(dailyHigh), // Use calculated daily high
            lowTemp: Math.round(dailyLow), // Use calculated daily low
            description: representativeInterval.weather[0]?.description || 'Partly Cloudy',
            icon: representativeInterval.weather[0]?.icon || '02d',
            humidity: representativeInterval.main.humidity,
            windSpeed: Math.round(representativeInterval.wind?.speed || 0),
            precipitationChance: Math.round((representativeInterval.pop || 0) * 100),
            cityName: cityName,
            forecastDate: targetDate ? new Date(targetDate) : new Date(representativeInterval.dt * 1000),
            isActualForecast: true, // TRUE for aggregated live data
            source: 'live_forecast'
          }

          isActualLiveForecast = true

          console.log('✅ FIXED EDGE FUNCTION: Created aggregated live forecast:', {
            city: cityName,
            daysFromToday,
            isActualLiveForecast,
            temperature: forecast.temperature,
            highTemp: forecast.highTemp,
            lowTemp: forecast.lowTemp,
            temperatureRange: `${forecast.lowTemp}°–${forecast.highTemp}°F`,
            aggregatedFromIntervals: targetDateIntervals.length,
            forecastSuccess: true,
            forecastDate: forecast.forecastDate.toISOString(),
            shouldShowGreenBadge: true
          })

        } else {
          // Fallback: use range-based forecast if no exact date match
          console.log('🔄 FIXED EDGE FUNCTION: No exact date match, using range fallback for', cityName)
          
          if (daysFromToday <= 3) {
            const fallbackInterval = weatherData.list[Math.min(daysFromToday * 8, weatherData.list.length - 1)] || weatherData.list[0]
            
            forecast = {
              temperature: Math.round(fallbackInterval.main.temp),
              highTemp: Math.round(fallbackInterval.main.temp_max),
              lowTemp: Math.round(fallbackInterval.main.temp_min),
              description: fallbackInterval.weather[0]?.description || 'Partly Cloudy',
              icon: fallbackInterval.weather[0]?.icon || '02d',
              humidity: fallbackInterval.main.humidity,
              windSpeed: Math.round(fallbackInterval.wind?.speed || 0),
              precipitationChance: Math.round((fallbackInterval.pop || 0) * 100),
              cityName: cityName,
              forecastDate: targetDate ? new Date(targetDate) : new Date(fallbackInterval.dt * 1000),
              isActualForecast: true,
              source: 'live_forecast'
            }

            isActualLiveForecast = true

            console.log('✅ FIXED EDGE FUNCTION: Range fallback forecast created:', {
              city: cityName,
              daysFromToday,
              temperature: forecast.temperature,
              highTemp: forecast.highTemp,
              lowTemp: forecast.lowTemp,
              rangeFallback: true
            })
          }
        }

      } catch (error) {
        console.error('❌ FIXED EDGE FUNCTION: Live forecast failed:', error)
        isActualLiveForecast = false
      }
    } else {
      console.log('🔄 FIXED EDGE FUNCTION: Date outside forecast range, will use historical estimate:', {
        cityName,
        daysFromToday,
        targetDate: targetDateString,
        forecastRange: '0-6 days'
      })
    }

    // If we're outside forecast range or live forecast failed, create estimated forecast
    if (!forecast || !isActualLiveForecast) {
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
        isActualForecast: false, // FALSE for estimates
        source: isWithinForecastRange ? 'live_forecast' : 'historical_fallback'
      }

      console.log('✅ FIXED EDGE FUNCTION: Estimated forecast returned:', {
        city: cityName,
        daysFromToday,
        isActualForecast: false,
        temperature: forecast.temperature,
        highTemp: forecast.highTemp,
        lowTemp: forecast.lowTemp,
        withinForecastRange: isWithinForecastRange,
        reason: isWithinForecastRange ? 'api_failure_fallback' : 'beyond_forecast_range',
        forecastDate: forecast.forecastDate.toISOString(),
        estimatedForecast: true
      })
    }

    console.log('🎯 FIXED EDGE FUNCTION: Final response being sent:', {
      cityName,
      source: forecast.source,
      isActualForecast: forecast.isActualForecast,
      temperature: forecast.temperature,
      highTemp: forecast.highTemp,
      lowTemp: forecast.lowTemp,
      shouldDisplayAsLive: forecast.source === 'live_forecast' && forecast.isActualForecast === true
    });

    return new Response(
      JSON.stringify(forecast),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ FIXED EDGE FUNCTION: Weather forecast error:', error)
    
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
