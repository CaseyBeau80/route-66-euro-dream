
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

  // Enhanced historical detection logic - check multiple conditions
  const shouldShowHistorical = !weatherInfo?.isActualForecast || 
                              (daysFromNow && daysFromNow > 5) || 
                              weatherInfo?.description === 'Forecast not available' ||
                              weatherInfo?.source === 'historical' ||
                              (!weatherInfo?.lowTemp && !weatherInfo?.highTemp && segmentDate);

  // If we should show historical but don't have temp data, get it from service
  let displayWeatherInfo = weatherInfo;
  if (shouldShowHistorical && segmentDate && (!weatherInfo?.lowTemp || !weatherInfo?.highTemp)) {
    console.log('🌤️ Getting historical data for PDF display');
    const historicalData = getHistoricalWeatherData(weatherInfo?.cityName || 'Unknown', segmentDate);
    displayWeatherInfo = {
      ...weatherInfo,
      lowTemp: historicalData.low,
      highTemp: historicalData.high,
      description: historicalData.condition,
      humidity: historicalData.humidity,
      windSpeed: historicalData.windSpeed,
      isActualForecast: false
    };
  }

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
      
      {displayWeatherInfo ? (
        <div className="space-y-3">
          {/* Historical Layout - matching itinerary [Low] [Icon] [High] */}
          {shouldShowHistorical && displayWeatherInfo.lowTemp !== undefined && displayWeatherInfo.highTemp !== undefined ? (
            <>
              <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg border border-gray-200 md:gap-6">
                {/* Low Temperature */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{displayWeatherInfo.lowTemp}°F</div>
                  <div className="text-xs text-gray-500">Typical Low</div>
                </div>
                
                {/* Weather Icon - use condition-based emoji for historical */}
                <div className="text-3xl">
                  {getWeatherEmoji(displayWeatherInfo.description, displayWeatherInfo.icon)}
                </div>
                
                {/* High Temperature */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{displayWeatherInfo.highTemp}°F</div>
                  <div className="text-xs text-gray-500">Typical High</div>
                </div>
              </div>

              {/* Historical badge - matching itinerary */}
              <div className="text-xs text-blue-700 italic bg-blue-100 p-2 rounded flex items-center gap-1">
                🟦 <span>Historical average temperatures for this date in {displayWeatherInfo.cityName || weatherInfo?.cityName || 'this location'}. Check live weather closer to your trip.</span>
              </div>
            </>
          ) : displayWeatherInfo.highTemp !== undefined && displayWeatherInfo.lowTemp !== undefined ? (
            <>
              {/* Forecast Layout - [Low] [Icon] [High] */}
              <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg border border-gray-200 md:gap-6">
                {/* Low Temperature */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{displayWeatherInfo.lowTemp}°F</div>
                  <div className="text-xs text-gray-500">Low</div>
                </div>
                
                {/* Weather Icon */}
                <div className="text-3xl">
                  {getWeatherEmoji(displayWeatherInfo.description, displayWeatherInfo.icon)}
                </div>
                
                {/* High Temperature */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{displayWeatherInfo.highTemp}°F</div>
                  <div className="text-xs text-gray-500">High</div>
                </div>
              </div>

              {/* Forecast badge */}
              {displayWeatherInfo.isActualForecast === true && daysFromNow && daysFromNow <= 5 && (
                <div className="text-xs text-green-700 italic bg-green-100 p-2 rounded flex items-center gap-1">
                  🟩 <span>Weather forecast ({daysFromNow} days ahead)</span>
                </div>
              )}
            </>
          ) : (
            // Fallback for current temperature only or no data - show historical if date provided
            <div className="flex items-center justify-center gap-4 text-base bg-white rounded p-4 border border-gray-200">
              <div className="text-3xl">
                {getWeatherEmoji(displayWeatherInfo.description || displayWeatherInfo.weather?.[0]?.description, displayWeatherInfo.icon)}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {displayWeatherInfo.temperature ? Math.round(displayWeatherInfo.temperature) :
                   displayWeatherInfo.main?.temp ? Math.round(displayWeatherInfo.main.temp) : 
                   displayWeatherInfo.temp?.day ? Math.round(displayWeatherInfo.temp.day) :
                   '--'}°F
                </div>
                <div className="text-xs text-gray-500">Current</div>
              </div>
            </div>
          )}
          
          {/* Weather Description */}
          <div className="text-center text-sm text-gray-700 capitalize">
            {displayWeatherInfo.description || 
             displayWeatherInfo.weather?.[0]?.description || 
             'Partly cloudy'}
          </div>
          
          {/* Additional Weather Details */}
          <div className="flex gap-4 text-sm text-gray-600 justify-center">
            {(displayWeatherInfo.humidity || displayWeatherInfo.main?.humidity) && (
              <span>💧 {displayWeatherInfo.humidity || displayWeatherInfo.main?.humidity}%</span>
            )}
            {(displayWeatherInfo.windSpeed || displayWeatherInfo.wind?.speed) && (
              <span>💨 {displayWeatherInfo.windSpeed || Math.round(displayWeatherInfo.wind.speed)} mph</span>
            )}
          </div>

          {/* Current conditions fallback message */}
          {displayWeatherInfo.isActualForecast === false && !shouldShowHistorical && (
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
