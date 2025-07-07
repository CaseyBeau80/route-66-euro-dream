
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { WeatherRequestHandler } from './services/WeatherRequestHandler.ts';
import { FallbackWeatherService } from './services/FallbackWeatherService.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('🌤️ Weather forecast request:', {
      method: req.method,
      cityName: requestBody?.cityName,
      targetDate: requestBody?.targetDate
    });

    // Validate request
    const cityName = requestBody?.cityName || requestBody?.city;
    const targetDate = requestBody?.targetDate;
    
    if (!cityName) {
      console.error('❌ Missing city name in request');
      return new Response(
        JSON.stringify({ error: 'City name is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // NUCLEAR OVERRIDE - HARDCODED API KEY (same approach as frontend)
    const apiKey = 'f8c65e6c8f284e9b8c65e6c8f284e9b8';
    
    console.log('🚀 WEATHER EDGE FUNCTION: Using hardcoded API key (NUCLEAR OVERRIDE)');
    console.log('🚀 WEATHER EDGE FUNCTION: Bypassing environment variable check');
    console.log('🚀 WEATHER EDGE FUNCTION: Key preview:', `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
    
    // REMOVED: No more fallback - always use the hardcoded key

    // Process weather request
    const requestDate = targetDate ? new Date(targetDate) : new Date();
    const handler = new WeatherRequestHandler(apiKey);
    const weatherResponse = await handler.processWeatherRequest(cityName, requestDate);

    console.log('🎯 Final weather response:', {
      cityName,
      temperature: weatherResponse.temperature,
      source: weatherResponse.source,
      isActualForecast: weatherResponse.isActualForecast
    });

    return new Response(
      JSON.stringify(weatherResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Weather forecast error:', error);
    
    // Return fallback response
    const fallbackWeather = FallbackWeatherService.createFallbackWeather(
      'Unknown',
      new Date()
    );
    
    return new Response(
      JSON.stringify(fallbackWeather),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
