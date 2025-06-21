
import React, { useState, useEffect } from 'react';
import { DailySegment } from '../../TripCalculator/services/planning/TripPlanBuilder';
import { getCurrentApiKey } from '@/config/weatherConfig';

interface SimpleWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate: Date;
}

const SimpleWeatherWidget: React.FC<SimpleWeatherWidgetProps> = ({
  segment,
  tripStartDate
}) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const segmentDate = React.useMemo(() => {
    const baseDate = new Date(tripStartDate);
    return new Date(baseDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
  }, [tripStartDate, segment.day]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getSeasonalWeather = () => {
    const month = segmentDate.getMonth();
    const seasonalData = {
      0: { temp: 45, desc: 'Cool and Clear', icon: '☀️' }, // Jan
      1: { temp: 52, desc: 'Mild and Sunny', icon: '🌤️' }, // Feb
      2: { temp: 61, desc: 'Pleasant', icon: '☀️' }, // Mar
      3: { temp: 70, desc: 'Warm and Clear', icon: '☀️' }, // Apr
      4: { temp: 78, desc: 'Perfect Weather', icon: '☀️' }, // May
      5: { temp: 87, desc: 'Hot and Sunny', icon: '☀️' }, // Jun
      6: { temp: 92, desc: 'Very Hot', icon: '🌞' }, // Jul
      7: { temp: 90, desc: 'Hot and Sunny', icon: '🌞' }, // Aug
      8: { temp: 82, desc: 'Warm', icon: '☀️' }, // Sep
      9: { temp: 71, desc: 'Pleasant', icon: '🌤️' }, // Oct
      10: { temp: 58, desc: 'Cool', icon: '🌤️' }, // Nov
      11: { temp: 47, desc: 'Cool and Clear', icon: '☀️' } // Dec
    };

    const baseWeather = seasonalData[month as keyof typeof seasonalData];
    
    // Add some city-specific variation
    const cityHash = segment.endCity.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const variation = (Math.abs(cityHash) % 10) - 5; // -5 to +5 degree variation
    
    return {
      temperature: baseWeather.temp + variation,
      description: baseWeather.desc,
      icon: baseWeather.icon,
      source: 'Seasonal Average'
    };
  };

  const fetchLiveWeather = async () => {
    const apiKey = getCurrentApiKey();
    if (!apiKey || apiKey === 'your_api_key_here') {
      return null;
    }

    try {
      // Simple geocoding
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(segment.endCity)}&limit=1&appid=${apiKey}`
      );
      
      if (!geoResponse.ok) return null;
      
      const geoData = await geoResponse.json();
      if (!geoData.length) return null;

      const { lat, lon } = geoData[0];

      // Get weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
      );

      if (!weatherResponse.ok) return null;

      const weatherData = await weatherResponse.json();

      return {
        temperature: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon === '01d' ? '☀️' : 
              weatherData.weather[0].icon === '02d' ? '🌤️' :
              weatherData.weather[0].icon === '03d' ? '☁️' :
              weatherData.weather[0].icon === '10d' ? '🌧️' : '🌤️',
        source: 'Live Weather'
      };
    } catch (error) {
      console.error('Weather fetch failed:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try live weather first
        const liveWeather = await fetchLiveWeather();
        
        if (liveWeather) {
          setWeather(liveWeather);
        } else {
          // Use seasonal fallback
          setWeather(getSeasonalWeather());
        }
      } catch (err) {
        setError('Weather unavailable');
        setWeather(getSeasonalWeather());
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [segment.endCity, segmentDate]);

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
        <span className="text-gray-500 text-sm">Weather unavailable</span>
      </div>
    );
  }

  const isLive = weather.source === 'Live Weather';

  return (
    <div className={`${isLive ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} border rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          {formatDate(segmentDate)}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full text-white ${isLive ? 'bg-green-600' : 'bg-amber-600'}`}>
          {weather.source}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-3xl">{weather.icon}</span>
        <div>
          <div className="text-xl font-bold text-gray-800">
            {weather.temperature}°F
          </div>
          <div className="text-sm text-gray-600 capitalize">
            {weather.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleWeatherWidget;
