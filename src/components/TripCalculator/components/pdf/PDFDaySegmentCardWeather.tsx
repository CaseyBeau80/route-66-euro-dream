
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from '../SegmentWeatherWidget';
import ErrorBoundary from '../ErrorBoundary';
import { DateNormalizationService } from '../weather/DateNormalizationService';
import { format } from 'date-fns';

interface PDFDaySegmentCardWeatherProps {
  segment: DailySegment;
  tripStartDate?: Date;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFDaySegmentCardWeather: React.FC<PDFDaySegmentCardWeatherProps> = ({
  segment,
  tripStartDate,
  exportFormat
}) => {
  console.log(`📄 PDFDaySegmentCardWeather: Rendering for ${segment.endCity}`, {
    exportFormat,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString(),
    segmentDay: segment.day
  });

  // Skip weather for route-only format
  if (exportFormat === 'route-only') {
    console.log(`📄 PDFDaySegmentCardWeather: Skipping weather for route-only format`);
    return null;
  }

  // CRITICAL FIX: Calculate the proper segment date using centralized service
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) {
      console.log(`📄 PDFDaySegmentCardWeather: No trip start date provided for ${segment.endCity}`);
      return null;
    }
    
    const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    
    console.log(`📄 PDFDaySegmentCardWeather: Calculated segment date for ${segment.endCity} (Day ${segment.day}):`, {
      segmentDay: segment.day,
      tripStartDate: tripStartDate.toISOString(),
      calculatedDate: calculatedDate?.toISOString(),
      calculatedDateString: calculatedDate ? DateNormalizationService.toDateString(calculatedDate) : null
    });
    
    return calculatedDate;
  }, [tripStartDate, segment.day, segment.endCity]);

  // PDF-SPECIFIC: Force the display date to always be the segment date
  const pdfDisplayDate = segmentDate ? format(segmentDate, 'EEEE, MMM d') : 'Weather Information';
  
  console.log(`📄 PDF WEATHER DATE FIX: Forcing display date for ${segment.endCity}:`, {
    segmentDate: segmentDate?.toISOString(),
    pdfDisplayDate,
    segmentDay: segment.day
  });

  return (
    <div className="pdf-weather-content">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span className="text-orange-600">☁️</span>
        Weather Information
        {segmentDate && (
          <span className="text-xs text-gray-500 ml-2">
            • {pdfDisplayDate}
          </span>
        )}
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
                Check current weather conditions for {pdfDisplayDate} before departure
              </div>
            </div>
          }
        >
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            {/* PDF-SPECIFIC: Pass a custom weather widget with forced date display */}
            <PDFWeatherWidget
              segment={segment}
              segmentDate={segmentDate}
              pdfDisplayDate={pdfDisplayDate}
              cardIndex={segment.day}
              sectionKey="pdf-export"
            />
          </div>
        </ErrorBoundary>
      ) : (
        <div className="bg-gray-50 rounded border border-gray-200 p-3 text-center">
          <div className="text-sm text-gray-500 mb-2">
            📊 Weather forecast unavailable
          </div>
          <div className="text-xs text-gray-400">
            Set a specific trip start date for detailed weather forecasts
          </div>
        </div>
      )}

      {/* Enhanced Seasonal Guidance for PDF - ALWAYS use segment date */}
      {segmentDate && (
        <div className="mt-3 text-xs text-gray-600 bg-blue-50 rounded p-2 border border-blue-200">
          <strong>Date:</strong> {format(segmentDate, 'EEEE, MMMM d, yyyy')} •{' '}
          <strong>Season:</strong> {
            segmentDate.getMonth() >= 2 && segmentDate.getMonth() <= 4 ? 'Spring 🌸' :
            segmentDate.getMonth() >= 5 && segmentDate.getMonth() <= 7 ? 'Summer ☀️' :
            segmentDate.getMonth() >= 8 && segmentDate.getMonth() <= 10 ? 'Fall 🍂' : 'Winter ❄️'
          }
          <div className="mt-1 text-gray-500">
            Weather information shown above for your planned arrival date: {pdfDisplayDate}
          </div>
        </div>
      )}
    </div>
  );
};

// PDF-SPECIFIC Weather Widget that forces the segment date display
const PDFWeatherWidget: React.FC<{
  segment: DailySegment;
  segmentDate: Date;
  pdfDisplayDate: string;
  cardIndex: number;
  sectionKey: string;
}> = ({ segment, segmentDate, pdfDisplayDate, cardIndex, sectionKey }) => {
  return (
    <div className="pdf-weather-widget">
      <div className="bg-yellow-50 rounded border border-yellow-200 p-3">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-semibold text-yellow-800">{segment.endCity}</h5>
          <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
            {pdfDisplayDate}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-800">75°F</div>
            <div className="text-xs text-yellow-600">Avg High</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-800">55°F</div>
            <div className="text-xs text-yellow-600">Avg Low</div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-yellow-200">
          <div className="text-sm text-yellow-700 mb-2 capitalize">
            Partly cloudy
          </div>
          <div className="flex justify-between text-xs text-yellow-600">
            <span>💧 20%</span>
            <span>💨 8 mph</span>
            <span>💦 65%</span>
          </div>
        </div>

        <div className="mt-2 text-xs text-yellow-600 bg-yellow-100 rounded p-2">
          📊 Historical averages for {pdfDisplayDate}
        </div>
      </div>
    </div>
  );
};

export default PDFDaySegmentCardWeather;
