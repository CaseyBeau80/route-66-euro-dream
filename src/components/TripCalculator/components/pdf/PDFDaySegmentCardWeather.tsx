
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

  return (
    <div className="pdf-weather-section mb-6 p-4 bg-blue-50 rounded border border-blue-200">
      <h6 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-1">
        🌤️ Weather Forecast
      </h6>
      
      {weatherInfo ? (
        <div className="space-y-3">
          {/* Current Weather */}
          <div className="flex items-center justify-between text-base bg-white rounded p-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {weatherInfo.temperature ? Math.round(weatherInfo.temperature) :
                 weatherInfo.main?.temp ? Math.round(weatherInfo.main.temp) : 
                 weatherInfo.temp?.day ? Math.round(weatherInfo.temp.day) :
                 '--'}°F
              </span>
              <span className="text-blue-600">•</span>
              <span className="capitalize">
                {weatherInfo.description || 
                 weatherInfo.weather?.[0]?.description || 
                 'Partly cloudy'}
              </span>
            </div>
            {(weatherInfo.humidity || weatherInfo.main?.humidity) && (
              <span className="text-sm text-gray-600">
                💧 {weatherInfo.humidity || weatherInfo.main?.humidity}%
              </span>
            )}
          </div>
          
          {/* 3-Day Forecast if available */}
          {weatherInfo.forecast && weatherInfo.forecast.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {weatherInfo.forecast.slice(0, 3).map((day: any, index: number) => (
                <div key={index} className="text-center p-3 bg-white rounded border text-sm">
                  <div className="font-medium text-gray-700">{day.date}</div>
                  <div className="text-blue-600 font-semibold">
                    {day.temperature?.high ? Math.round(day.temperature.high) :
                     day.temp?.max ? Math.round(day.temp.max) : '--'}°/
                    {day.temperature?.low ? Math.round(day.temperature.low) :
                     day.temp?.min ? Math.round(day.temp.min) : '--'}°
                  </div>
                  <div className="text-gray-500 capitalize text-sm">
                    {day.description || day.weather?.[0]?.description || 'Clear'}
                  </div>
                  {day.precipitationChance && parseInt(day.precipitationChance) > 0 && (
                    <div className="text-blue-500 text-sm">
                      {day.precipitationChance}% rain
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Additional Weather Details */}
          <div className="flex gap-4 text-sm text-gray-600 mt-3">
            {(weatherInfo.windSpeed || weatherInfo.wind?.speed) && (
              <span>💨 {weatherInfo.windSpeed || Math.round(weatherInfo.wind.speed)} mph wind</span>
            )}
            {(weatherInfo.visibility) && (
              <span>👁️ {typeof weatherInfo.visibility === 'number' ? 
                Math.round(weatherInfo.visibility > 100 ? weatherInfo.visibility / 1000 : weatherInfo.visibility) 
                : weatherInfo.visibility} mi visibility</span>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-base text-gray-600 bg-white rounded p-4">
          <div>Weather data not available</div>
          <div className="text-sm text-gray-500 mt-1">
            Check live weather before departure
          </div>
          {segmentDate && (
            <div className="text-sm text-blue-600 mt-2">
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
