
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

    // Get API key from environment variable
    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY');
    
    if (!apiKey) {
      console.error('❌ OpenWeatherMap API key not configured in environment variables');
      const fallbackWeather = FallbackWeatherService.createFallbackWeather(
        cityName, 
        targetDate ? new Date(targetDate) : new Date()
      );
      
      return new Response(
        JSON.stringify(fallbackWeather),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
