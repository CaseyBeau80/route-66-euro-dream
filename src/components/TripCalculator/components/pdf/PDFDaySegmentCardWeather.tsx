
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

  // CRITICAL FIX: Use centralized date calculation service for absolute consistency
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) {
      console.log(`📄 PDFDaySegmentCardWeather: No trip start date provided for ${segment.endCity}`);
      return null;
    }
    
    // Use the centralized service to ensure absolute date consistency
    const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    
    console.log(`📄 PDFDaySegmentCardWeather: CENTRALIZED date calculation for ${segment.endCity} (Day ${segment.day}):`, {
      segmentDay: segment.day,
      tripStartDate: tripStartDate.toISOString(),
      calculatedDate: calculatedDate?.toISOString(),
      calculatedDateString: calculatedDate ? DateNormalizationService.toDateString(calculatedDate) : null,
      usingCentralizedService: true
    });
    
    return calculatedDate;
  }, [tripStartDate, segment.day, segment.endCity]);

  // PDF-SPECIFIC: Force the display date to always be the segment date using centralized formatting
  const pdfDisplayDate = React.useMemo(() => {
    if (!segmentDate) return 'Weather Information';
    
    const formattedDate = format(segmentDate, 'EEEE, MMM d');
    
    console.log(`📄 PDF WEATHER DATE ABSOLUTE LOCK: Forcing display date for ${segment.endCity}:`, {
      segmentDate: segmentDate.toISOString(),
      segmentDateString: DateNormalizationService.toDateString(segmentDate),
      pdfDisplayDate: formattedDate,
      segmentDay: segment.day,
      absoluteAlignment: true
    });
    
    return formattedDate;
  }, [segmentDate, segment.endCity, segment.day]);

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
            {/* Pass the exact segment date to ensure consistency */}
            <SegmentWeatherWidget
              segment={segment}
              tripStartDate={tripStartDate}
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
            📊 Weather forecast unavailable
          </div>
          <div className="text-xs text-gray-400">
            Set a specific trip start date for detailed weather forecasts
          </div>
        </div>
      )}

      {/* Enhanced Seasonal Guidance for PDF - ALWAYS use exact segment date */}
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

export default PDFDaySegmentCardWeather;
