
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from '../SegmentWeatherWidget';
import ErrorBoundary from '../ErrorBoundary';

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
  console.log(`📄 PDFDaySegmentCardWeather: Rendering for ${segment.endCity}`, {
    exportFormat,
    hasSegmentDate: !!segmentDate,
    segmentDate: segmentDate?.toISOString(),
    hasWeatherData: !!(segment.weather || segment.weatherData),
    segmentDay: segment.day
  });

  // Skip weather for route-only format
  if (exportFormat === 'route-only') {
    console.log(`📄 PDFDaySegmentCardWeather: Skipping weather for route-only format`);
    return null;
  }

  // Enhanced weather rendering for PDF export - use the same logic as the main app
  return (
    <div className="pdf-weather-content">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span className="text-orange-600">☁️</span>
        Weather Information
      </h4>
      
      {segmentDate ? (
        <ErrorBoundary 
          context={`PDFWeather-${segment.day}`}
          silent
          fallback={
            <div className="bg-yellow-50 rounded border border-yellow-200 p-3 text-center">
              <div className="text-sm text-yellow-800 mb-2">
                ⚠️ Weather information temporarily unavailable
              </div>
              <div className="text-xs text-yellow-600">
                Check current weather conditions before departure
              </div>
            </div>
          }
        >
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <SegmentWeatherWidget
              segment={segment}
              tripStartDate={segmentDate}
              cardIndex={segment.day}
              sectionKey="pdf-export"
              forceExpanded={true}
              isCollapsible={false}
            />
          </div>
        </ErrorBoundary>
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
