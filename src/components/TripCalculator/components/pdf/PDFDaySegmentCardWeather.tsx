
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

  // Helper function to get weather emoji from condition - matching itinerary logic
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

  const daysFromNow = segmentDate 
    ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : null;

  // Check if we should show historical data - matching itinerary logic
  const shouldShowHistorical = !weatherInfo?.isActualForecast || 
                              (daysFromNow && daysFromNow > 5) || 
                              weatherInfo?.description === 'Forecast not available' ||
                              weatherInfo?.source === 'historical';

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
      
      {weatherInfo ? (
        <div className="space-y-3">
          {/* Historical Layout - matching itinerary [Low] [Icon] [High] */}
          {shouldShowHistorical && weatherInfo.lowTemp !== undefined && weatherInfo.highTemp !== undefined ? (
            <>
              <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg border border-gray-200 md:gap-6">
                {/* Low Temperature */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{weatherInfo.lowTemp}°F</div>
                  <div className="text-xs text-gray-500">Typical Low</div>
                </div>
                
                {/* Weather Icon - use condition-based emoji for historical */}
                <div className="text-3xl">
                  {getWeatherEmoji(weatherInfo.description, weatherInfo.icon)}
                </div>
                
                {/* High Temperature */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{weatherInfo.highTemp}°F</div>
                  <div className="text-xs text-gray-500">Typical High</div>
                </div>
              </div>

              {/* Historical badge - matching itinerary */}
              <div className="text-xs text-blue-700 italic bg-blue-100 p-2 rounded flex items-center gap-1">
                🟦 <span>Historical average temperatures for this date in {weatherInfo.cityName || 'this location'}. Check live weather closer to your trip.</span>
              </div>
            </>
          ) : weatherInfo.highTemp !== undefined && weatherInfo.lowTemp !== undefined ? (
            <>
              {/* Forecast Layout - [Low] [Icon] [High] */}
              <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg border border-gray-200 md:gap-6">
                {/* Low Temperature */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{weatherInfo.lowTemp}°F</div>
                  <div className="text-xs text-gray-500">Low</div>
                </div>
                
                {/* Weather Icon */}
                <div className="text-3xl">
                  {getWeatherEmoji(weatherInfo.description, weatherInfo.icon)}
                </div>
                
                {/* High Temperature */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{weatherInfo.highTemp}°F</div>
                  <div className="text-xs text-gray-500">High</div>
                </div>
              </div>

              {/* Forecast badge */}
              {weatherInfo.isActualForecast === true && daysFromNow && daysFromNow <= 5 && (
                <div className="text-xs text-green-700 italic bg-green-100 p-2 rounded flex items-center gap-1">
                  🟩 <span>Weather forecast ({daysFromNow} days ahead)</span>
                </div>
              )}
            </>
          ) : (
            // Fallback for current temperature only
            <div className="flex items-center justify-center gap-4 text-base bg-white rounded p-4 border border-gray-200">
              <div className="text-3xl">
                {getWeatherEmoji(weatherInfo.description || weatherInfo.weather?.[0]?.description, weatherInfo.icon)}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {weatherInfo.temperature ? Math.round(weatherInfo.temperature) :
                   weatherInfo.main?.temp ? Math.round(weatherInfo.main.temp) : 
                   weatherInfo.temp?.day ? Math.round(weatherInfo.temp.day) :
                   '--'}°F
                </div>
                <div className="text-xs text-gray-500">Current</div>
              </div>
            </div>
          )}
          
          {/* Weather Description */}
          <div className="text-center text-sm text-gray-700 capitalize">
            {weatherInfo.description || 
             weatherInfo.weather?.[0]?.description || 
             'Partly cloudy'}
          </div>
          
          {/* Additional Weather Details */}
          <div className="flex gap-4 text-sm text-gray-600 justify-center">
            {(weatherInfo.humidity || weatherInfo.main?.humidity) && (
              <span>💧 {weatherInfo.humidity || weatherInfo.main?.humidity}%</span>
            )}
            {(weatherInfo.windSpeed || weatherInfo.wind?.speed) && (
              <span>💨 {weatherInfo.windSpeed || Math.round(weatherInfo.wind.speed)} mph</span>
            )}
          </div>

          {/* Current conditions fallback message */}
          {weatherInfo.isActualForecast === false && !shouldShowHistorical && (
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
