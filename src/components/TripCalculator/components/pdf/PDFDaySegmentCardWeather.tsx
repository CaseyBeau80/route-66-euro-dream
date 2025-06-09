
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';

interface PDFDaySegmentCardWeatherProps {
  segment: DailySegment;
  segmentDate?: Date;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFDaySegmentCardWeather: React.FC<PDFDaySegmentCardWeatherProps> = ({
  segment,
  segmentDate,
  exportFormat
}) => {
  // Skip weather for route-only format
  if (exportFormat === 'route-only') {
    return null;
  }

  const hasWeatherData = segment.weather || segment.weatherData;

  return (
    <div className="pdf-weather-content">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span className="text-orange-600">☁️</span>
        Weather Information
      </h4>
      
      {hasWeatherData ? (
        <div className="bg-white rounded border border-gray-200 p-3">
          <div className="text-sm text-gray-600 text-center">
            <div className="mb-2">🌤️ Weather data available</div>
            <div className="text-xs text-gray-500">
              Visit the live version for detailed forecasts and current conditions
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded border border-gray-200 p-3 text-center">
          <div className="text-sm text-gray-500 mb-2">
            📊 Seasonal weather estimates
          </div>
          <div className="text-xs text-gray-400">
            Set a specific date for detailed forecasts
          </div>
        </div>
      )}

      {/* Seasonal Guidance */}
      {segmentDate && (
        <div className="mt-3 text-xs text-gray-600 bg-blue-50 rounded p-2 border border-blue-200">
          <strong>Season:</strong> {
            segmentDate.getMonth() >= 2 && segmentDate.getMonth() <= 4 ? 'Spring 🌸' :
            segmentDate.getMonth() >= 5 && segmentDate.getMonth() <= 7 ? 'Summer ☀️' :
            segmentDate.getMonth() >= 8 && segmentDate.getMonth() <= 10 ? 'Fall 🍂' : 'Winter ❄️'
          }
          <div className="mt-1 text-gray-500">
            Check current weather conditions before departure for the most accurate forecast.
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFDaySegmentCardWeather;
