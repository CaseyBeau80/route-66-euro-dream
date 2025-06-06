
import React from 'react';

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

  // Helper function to find weather data for the specific trip date
  const getWeatherForTripDate = () => {
    if (!weatherInfo || !segmentDate) return null;

    // If this is forecast data with isActualForecast property
    if (weatherInfo.isActualForecast !== undefined) {
      // For actual forecast data, use the main weather data
      return {
        temperature: weatherInfo.temperature,
        description: weatherInfo.description,
        humidity: weatherInfo.humidity,
        windSpeed: weatherInfo.windSpeed
      };
    }

    // For regular weather data, use as-is
    return weatherInfo;
  };

  const tripDayWeather = getWeatherForTripDate();

  return (
    <div className="pdf-weather-section mb-6 p-4 bg-blue-50 rounded border border-blue-200">
      <h6 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-1">
        🌤️ Weather Forecast
        {segmentDate && (
          <span className="text-xs text-blue-600 ml-2">
            ({segmentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
          </span>
        )}
      </h6>
      
      {tripDayWeather ? (
        <div className="space-y-3">
          {/* Main Weather for Trip Day */}
          <div className="flex items-center justify-between text-base bg-white rounded p-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {tripDayWeather.temperature ? Math.round(tripDayWeather.temperature) :
                 tripDayWeather.main?.temp ? Math.round(tripDayWeather.main.temp) : 
                 tripDayWeather.temp?.day ? Math.round(tripDayWeather.temp.day) :
                 '--'}°F
              </span>
              <span className="text-blue-600">•</span>
              <span className="capitalize">
                {tripDayWeather.description || 
                 tripDayWeather.weather?.[0]?.description || 
                 'Partly cloudy'}
              </span>
            </div>
            {(tripDayWeather.humidity || tripDayWeather.main?.humidity) && (
              <span className="text-sm text-gray-600">
                💧 {tripDayWeather.humidity || tripDayWeather.main?.humidity}%
              </span>
            )}
          </div>
          
          {/* Additional Weather Details for Trip Day */}
          <div className="flex gap-4 text-sm text-gray-600 mt-3">
            {(tripDayWeather.windSpeed || tripDayWeather.wind?.speed) && (
              <span>💨 {tripDayWeather.windSpeed || Math.round(tripDayWeather.wind.speed)} mph wind</span>
            )}
            {(tripDayWeather.visibility) && (
              <span>👁️ {typeof tripDayWeather.visibility === 'number' ? 
                Math.round(tripDayWeather.visibility > 100 ? tripDayWeather.visibility / 1000 : tripDayWeather.visibility) 
                : tripDayWeather.visibility} mi visibility</span>
            )}
          </div>

          {/* Note about forecast accuracy */}
          {weatherInfo.isActualForecast === false && (
            <div className="text-xs text-gray-500 italic bg-gray-100 p-2 rounded">
              ⚠️ Showing current conditions as reference. Check live weather before departure.
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
