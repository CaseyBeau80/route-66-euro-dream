
import React from 'react';
import { getHistoricalWeatherData } from '../weather/SeasonalWeatherService';

interface PDFDaySegmentCardWeatherProps {
  weatherInfo: any;
  segmentDate: Date | null;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFDaySegmentCardWeather: React.FC<PDFDaySegmentCardWeatherProps> = ({
  weatherInfo,
  segmentDate,
  exportFormat
}) => {
  if (exportFormat === 'route-only') {
    return null;
  }

  console.log('🌤️ PDFDaySegmentCardWeather: Weather info:', weatherInfo);
  console.log('🌤️ PDFDaySegmentCardWeather: Segment date:', segmentDate?.toISOString());

  // Helper function to get weather emoji from condition
  const getWeatherEmoji = (description: string, iconCode?: string): string => {
    const condition = description?.toLowerCase() || '';
    
    // Use icon code for more precise mapping if available
    if (iconCode) {
      if (iconCode.includes('01')) return '☀️'; // clear sky
      if (iconCode.includes('02')) return '⛅'; // few clouds
      if (iconCode.includes('03') || iconCode.includes('04')) return '☁️'; // clouds
      if (iconCode.includes('09') || iconCode.includes('10')) return '🌧️'; // rain
      if (iconCode.includes('11')) return '⛈️'; // thunderstorm
      if (iconCode.includes('13')) return '❄️'; // snow
      if (iconCode.includes('50')) return '🌫️'; // mist
    }
    
    // Fallback to description mapping
    if (condition.includes('rain') || condition.includes('drizzle')) return '🌧️';
    if (condition.includes('snow') || condition.includes('blizzard')) return '❄️';
    if (condition.includes('storm') || condition.includes('thunder')) return '⛈️';
    if (condition.includes('cloud')) return '☁️';
    if (condition.includes('clear') || condition.includes('sunny')) return '☀️';
    if (condition.includes('mist') || condition.includes('fog')) return '🌫️';
    
    return '🌤️'; // default
  };

  // Helper function to find weather data for the specific trip date
  const getWeatherForTripDate = () => {
    if (!segmentDate) return null;

    const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    // If we have weather info and it's within forecast range
    if (weatherInfo && weatherInfo.isActualForecast !== undefined) {
      return weatherInfo;
    }

    // For dates beyond 5 days, use historical data
    if (daysFromNow > 5) {
      const cityName = weatherInfo?.cityName || 'Route 66'; // Fallback city name
      const historicalData = getHistoricalWeatherData(cityName, segmentDate);
      
      return {
        highTemp: historicalData.high,
        lowTemp: historicalData.low,
        description: historicalData.condition,
        icon: '🌡️', // Thermometer for historical
        humidity: historicalData.humidity,
        windSpeed: historicalData.windSpeed,
        isActualForecast: false,
        isHistorical: true
      };
    }

    // For regular weather data, use as-is
    return weatherInfo;
  };

  const tripDayWeather = getWeatherForTripDate();
  const daysFromNow = segmentDate 
    ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="pdf-weather-section mb-6 p-4 bg-blue-50 rounded border border-blue-200">
      <h6 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-1">
        🌤️ Weather Information
        {segmentDate && (
          <span className="text-xs text-blue-600 ml-2">
            ({segmentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
          </span>
        )}
      </h6>
      
      {tripDayWeather ? (
        <div className="space-y-3">
          {/* Enhanced Weather Layout: Low | Icon | High */}
          {tripDayWeather.highTemp !== undefined && tripDayWeather.lowTemp !== undefined ? (
            <div className="flex items-center justify-center gap-6 text-base bg-white rounded p-4 border border-gray-200">
              {/* Low Temperature */}
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{tripDayWeather.lowTemp}°F</div>
                <div className="text-xs text-gray-500">
                  {tripDayWeather.isHistorical ? 'Typical Low' : 'Low'}
                </div>
              </div>
              
              {/* Weather Icon (Emoji or Thermometer for Historical) */}
              <div className="text-2xl">
                {tripDayWeather.isHistorical ? 
                  '🌡️' : 
                  getWeatherEmoji(tripDayWeather.description, tripDayWeather.icon)
                }
              </div>
              
              {/* High Temperature */}
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">{tripDayWeather.highTemp}°F</div>
                <div className="text-xs text-gray-500">
                  {tripDayWeather.isHistorical ? 'Typical High' : 'High'}
                </div>
              </div>
            </div>
          ) : (
            // Fallback for current temperature only
            <div className="flex items-center justify-center gap-4 text-base bg-white rounded p-3">
              <div className="text-xl">
                {getWeatherEmoji(tripDayWeather.description || tripDayWeather.weather?.[0]?.description, tripDayWeather.icon)}
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {tripDayWeather.temperature ? Math.round(tripDayWeather.temperature) :
                   tripDayWeather.main?.temp ? Math.round(tripDayWeather.main.temp) : 
                   tripDayWeather.temp?.day ? Math.round(tripDayWeather.temp.day) :
                   '--'}°F
                </div>
                <div className="text-xs text-gray-500">Current</div>
              </div>
            </div>
          )}
          
          {/* Weather Description */}
          <div className="text-center text-sm text-gray-700 capitalize">
            {tripDayWeather.description || 
             tripDayWeather.weather?.[0]?.description || 
             'Partly cloudy'}
          </div>
          
          {/* Additional Weather Details */}
          <div className="flex gap-4 text-sm text-gray-600 justify-center">
            {(tripDayWeather.humidity || tripDayWeather.main?.humidity) && (
              <span>💧 {tripDayWeather.humidity || tripDayWeather.main?.humidity}%</span>
            )}
            {(tripDayWeather.windSpeed || tripDayWeather.wind?.speed) && (
              <span>💨 {tripDayWeather.windSpeed || Math.round(tripDayWeather.wind.speed)} mph</span>
            )}
          </div>

          {/* Data Source Indicator */}
          {tripDayWeather.isHistorical && (
            <div className="text-xs text-blue-700 italic bg-blue-100 p-2 rounded flex items-center gap-1">
              🟦 <span>Historical average - check live weather before departure</span>
            </div>
          )}
          
          {tripDayWeather.isActualForecast === true && daysFromNow && daysFromNow <= 5 && (
            <div className="text-xs text-green-700 italic bg-green-100 p-2 rounded flex items-center gap-1">
              🟩 <span>Weather forecast ({daysFromNow} days ahead)</span>
            </div>
          )}
          
          {tripDayWeather.isActualForecast === false && !tripDayWeather.isHistorical && (
            <div className="text-xs text-yellow-700 italic bg-yellow-100 p-2 rounded flex items-center gap-1">
              🟨 <span>Current conditions shown as reference - check live weather before departure</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-base text-gray-600 bg-white rounded p-4">
          <div>Weather data not available</div>
          <div className="text-sm text-gray-500 mt-1">
            Check live weather before departure
          </div>
          {segmentDate && (
            <div className="text-sm text-blue-600 mt-2">
              Trip date: {segmentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              <br />
              Expected season: {
                segmentDate.getMonth() >= 2 && segmentDate.getMonth() <= 4 ? 'Spring' :
                segmentDate.getMonth() >= 5 && segmentDate.getMonth() <= 7 ? 'Summer' :
                segmentDate.getMonth() >= 8 && segmentDate.getMonth() <= 10 ? 'Fall' : 'Winter'
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFDaySegmentCardWeather;
