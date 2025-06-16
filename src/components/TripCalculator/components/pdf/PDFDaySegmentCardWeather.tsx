
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { ShareWeatherConfigService } from '../../services/weather/ShareWeatherConfigService';
import { WeatherConfigValidationService } from '../../services/weather/WeatherConfigValidationService';
import SegmentWeatherWidget from '../SegmentWeatherWidget';
import ErrorBoundary from '../ErrorBoundary';
import { UnifiedDateService } from '../../services/UnifiedDateService';
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
  const weatherConfig = React.useMemo(() => {
    return ShareWeatherConfigService.getShareWeatherConfig();
  }, []);

  const configValidation = React.useMemo(() => {
    return WeatherConfigValidationService.validateConfiguration();
  }, []);

  console.log(`📄 PDFDaySegmentCardWeather: Enhanced weather analysis for ${segment.endCity}`, {
    exportFormat,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString(),
    segmentDay: segment.day,
    weatherConfig,
    configValidation
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
    const calculatedDate = UnifiedDateService.calculateSegmentDate(tripStartDate, segment.day);
    
    console.log(`📄 PDFDaySegmentCardWeather: CENTRALIZED date calculation for ${segment.endCity} (Day ${segment.day}):`, {
      segmentDay: segment.day,
      tripStartDate: tripStartDate.toISOString(),
      calculatedDate: calculatedDate?.toISOString(),
      calculatedDateString: calculatedDate ? UnifiedDateService.formatForApi(calculatedDate) : null,
      usingCentralizedService: true
    });
    
    return calculatedDate;
  }, [tripStartDate, segment.day, segment.endCity]);

  return (
    <div className="pdf-weather-content">
      {/* REMOVED: Redundant header with date and forecast type - let the weather widget handle its own display */}
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span className="text-orange-600">☁️</span>
        Weather Information
      </h4>
      
      {segmentDate && weatherConfig.canFetchLiveWeather ? (
        <ErrorBoundary 
          context={`PDFWeather-${segment.day}`}
          silent
          fallback={
            <div className="bg-yellow-50 rounded border border-yellow-200 p-3 text-center">
              <div className="text-sm text-yellow-800 mb-2">
                ⚠️ Weather information temporarily unavailable
              </div>
              <div className="text-xs text-yellow-600">
                Check current weather conditions for {segmentDate ? format(segmentDate, 'EEEE, MMM d') : 'your planned date'} before departure
              </div>
            </div>
          }
        >
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
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
        <div className="bg-yellow-50 rounded border border-yellow-200 p-3 text-center">
          <div className="text-sm text-yellow-800 mb-2">
            📊 {segmentDate ? ShareWeatherConfigService.getWeatherStatusMessage(weatherConfig) : 'Weather forecast unavailable'}
          </div>
          <div className="text-xs text-yellow-600">
            {!segmentDate ? 
              'Set a specific trip start date for detailed weather forecasts' :
              configValidation.isValid ? 
                'Weather service temporarily unavailable. Check current weather conditions before departure.' :
                'Weather API configuration needed for live forecasts. Check current weather conditions before departure.'
            }
          </div>
          {/* Configuration help for invalid configs */}
          {!configValidation.isValid && configValidation.recommendations.length > 0 && (
            <div className="mt-2 text-xs text-blue-600 border-t border-yellow-300 pt-2">
              <strong>To enable live weather:</strong>
              <ul className="list-disc list-inside mt-1 text-left max-w-md mx-auto">
                {configValidation.recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="truncate">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* SIMPLIFIED: Attribution footer */}
      {segmentDate && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Weather shown based on available forecast or historical data.
        </div>
      )}
    </div>
  );
};

export default PDFDaySegmentCardWeather;
