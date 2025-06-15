
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

    // FIXED: Enhanced date processing with consistent local timezone handling
    const today = new Date()
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    const requestDate = targetDate ? new Date(targetDate) : new Date()
    const normalizedRequestDate = new Date(requestDate.getFullYear(), requestDate.getMonth(), requestDate.getDate())
    
    const daysFromToday = Math.ceil((normalizedRequestDate.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000))
    
    // FIXED: Reliable forecast range 0-5 days for live weather
    const isWithinReliableForecastRange = daysFromToday >= 0 && daysFromToday <= 5
    const targetDateString = normalizedRequestDate.toISOString().split('T')[0]
    
    console.log('FIXED: Enhanced weather forecast request with consistent date handling:', {
      cityName,
      targetDate: requestDate.toISOString(),
      targetDateLocal: requestDate.toLocaleDateString(),
      normalizedTargetDate: normalizedRequestDate.toISOString(),
      normalizedTargetDateLocal: normalizedRequestDate.toLocaleDateString(),
      targetDateString,
      todayLocal: today.toLocaleDateString(),
      normalizedTodayLocal: normalizedToday.toLocaleDateString(),
      daysFromToday,
      isWithinReliableForecastRange,
      apiKeyConfigured: !!apiKey,
      consistentDateProcessing: true
    })

    // Clean city name for geocoding
    const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim()
    
    // Get coordinates with enhanced error handling
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`
    const geoResponse = await fetch(geocodingUrl)
    
    if (!geoResponse.ok) {
      console.error('FIXED: Geocoding failed:', geoResponse.status, geoResponse.statusText)
      throw new Error('Geocoding failed')
    }
    
    const geoData = await geoResponse.json()
    if (!geoData || geoData.length === 0) {
      console.error('FIXED: City not found for:', cleanCityName)
      throw new Error('City not found')
    }

    // Prefer US results, fallback to first result
    const location = geoData.find((r: any) => r.country === 'US') || geoData[0]
    const { lat, lon } = location

    console.log('FIXED: Coordinates found:', {
      cityName: cleanCityName,
      lat,
      lon,
      country: location.country,
      state: location.state
    })

    let forecast
    let isActualLiveForecast = false
    let matchType = 'none'

    if (isWithinReliableForecastRange) {
      try {
        // Get weather forecast for reliable range
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
        const weatherResponse = await fetch(weatherUrl)
        
        if (!weatherResponse.ok) {
          console.error('FIXED: Weather API failed:', weatherResponse.status, weatherResponse.statusText)
          throw new Error('Weather API failed')
        }
        
        const weatherData = await weatherResponse.json()
        if (!weatherData.list || weatherData.list.length === 0) {
          console.error('FIXED: No weather data available for:', cityName)
          throw new Error('No weather data available')
        }

        console.log('FIXED: Weather API response received:', {
          cityName,
          listLength: weatherData.list.length,
          firstItemDate: weatherData.list[0]?.dt_txt,
          lastItemDate: weatherData.list[weatherData.list.length - 1]?.dt_txt,
          targetDateString
        })

        // FIXED: Enhanced date matching with multiple strategies
        let bestMatch = null
        let bestScore = Infinity
        
        // Strategy 1: Try exact date match first
        for (const item of weatherData.list) {
          const itemDate = new Date(item.dt * 1000)
          const itemDateString = itemDate.toISOString().split('T')[0]
          
          if (itemDateString === targetDateString) {
            bestMatch = item
            matchType = 'exact'
            isActualLiveForecast = true
            console.log('FIXED: Found exact date match:', {
              targetDate: targetDateString,
              matchedDate: itemDateString,
              matchType: 'exact',
              itemDateTime: itemDate.toISOString()
            })
            break
          }
        }
        
        // Strategy 2: If no exact match, find closest within 24 hours
        if (!bestMatch) {
          for (const item of weatherData.list) {
            const itemDate = new Date(item.dt * 1000)
            const timeDiff = Math.abs(itemDate.getTime() - normalizedRequestDate.getTime())
            const hoursDiff = timeDiff / (1000 * 60 * 60)
            
            if (hoursDiff <= 24 && timeDiff < bestScore) {
              bestScore = timeDiff
              bestMatch = item
              matchType = 'closest'
              isActualLiveForecast = true
            }
          }
          
          if (bestMatch) {
            console.log('FIXED: Found closest match:', {
              targetDate: targetDateString,
              matchedDate: new Date(bestMatch.dt * 1000).toISOString().split('T')[0],
              hoursDiff: Math.round(bestScore / (1000 * 60 * 60)),
              matchType: 'closest'
            })
          }
        }

        // Strategy 3: Use appropriate forecast within range as fallback
        if (!bestMatch && daysFromToday <= 3) {
          // For dates within 3 days, use the closest available forecast
          bestMatch = weatherData.list[Math.min(daysFromToday * 8, weatherData.list.length - 1)] || weatherData.list[0]
          matchType = 'range_fallback'
          isActualLiveForecast = true
          
          console.log('FIXED: Using range fallback:', {
            targetDate: targetDateString,
            daysFromToday,
            matchType: 'range_fallback',
            usedItemIndex: Math.min(daysFromToday * 8, weatherData.list.length - 1)
          })
        }

        if (bestMatch) {
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

          console.log('FIXED: Live forecast created successfully:', {
            city: cityName,
            daysFromToday,
            isActualLiveForecast,
            matchType,
            temperature: forecast.temperature,
            withinReliableRange: true,
            forecastSuccess: true,
            forecastDate: forecast.forecastDate.toISOString(),
            forecastDateLocal: forecast.forecastDate.toLocaleDateString()
          })
        }

      } catch (error) {
        console.error('FIXED: Live forecast failed:', error)
        isActualLiveForecast = false
      }
    } else {
      console.log('FIXED: Date outside reliable range:', {
        cityName,
        daysFromToday,
        targetDate: targetDateString,
        reliableRange: '0-5 days'
      })
    }

    // If we're outside reliable range or live forecast failed, create estimated forecast
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
        isActualForecast: false, // Always false for estimates
        source: isWithinReliableForecastRange ? 'live_forecast' : 'historical_fallback'
      }

      console.log('FIXED: Estimated forecast returned:', {
        city: cityName,
        daysFromToday,
        isActualForecast: false,
        temperature: forecast.temperature,
        withinReliableRange: isWithinReliableForecastRange,
        reason: isWithinReliableForecastRange ? 'api_failure_fallback' : 'beyond_reliable_range',
        forecastDate: forecast.forecastDate.toISOString(),
        forecastDateLocal: forecast.forecastDate.toLocaleDateString()
      })
    }

    return new Response(
      JSON.stringify(forecast),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('FIXED: Weather forecast error:', error)
    
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
