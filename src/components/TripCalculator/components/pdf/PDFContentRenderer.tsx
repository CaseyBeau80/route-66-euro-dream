
import React, { useEffect, useState } from 'react';
import { TripPlan, DailySegment } from '../../services/planning/TripPlanBuilder';
import PDFItineraryView from './PDFItineraryView';
import { PDFWeatherIntegrationService } from './PDFWeatherIntegrationService';
import { format } from 'date-fns';

interface PDFContentRendererProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  exportOptions: {
    format: 'full' | 'summary' | 'route-only';
    title?: string;
    watermark?: string;
    includeQRCode: boolean;
  };
  shareUrl?: string;
}

const PDFContentRenderer: React.FC<PDFContentRendererProps> = ({
  tripPlan,
  tripStartDate,
  exportOptions,
  shareUrl
}) => {
  const [enrichedSegments, setEnrichedSegments] = useState<DailySegment[]>(tripPlan.segments || []);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherLoadingTimeout, setWeatherLoadingTimeout] = useState(false);

  useEffect(() => {
    const enrichWithWeather = async () => {
      if (exportOptions.format === 'route-only' || !tripPlan.segments) {
        return;
      }

      console.log('🌤️ PDFContentRenderer: Starting enhanced weather enrichment with timeout...');
      setWeatherLoading(true);
      setWeatherLoadingTimeout(false);

      // Set timeout for weather loading
      const timeoutId = setTimeout(() => {
        console.log('⏰ Weather loading timeout reached (10 seconds)');
        setWeatherLoadingTimeout(true);
        setWeatherLoading(false);
      }, 10000);

      try {
        const weatherEnrichedSegments = await PDFWeatherIntegrationService.enrichSegmentsWithWeather(
          tripPlan.segments,
          tripStartDate
        );
        
        clearTimeout(timeoutId);
        
        console.log('✅ Weather enrichment completed successfully:', {
          originalSegments: tripPlan.segments.length,
          enrichedSegments: weatherEnrichedSegments.length,
          segmentsWithWeather: weatherEnrichedSegments.filter(s => s.weather || s.weatherData).length
        });

        setEnrichedSegments(weatherEnrichedSegments);
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('❌ Weather enrichment failed:', error);
        // Use original segments with fallback seasonal data
        setEnrichedSegments(tripPlan.segments);
      } finally {
        setWeatherLoading(false);
      }
    };

    enrichWithWeather();
  }, [tripPlan.segments, tripStartDate, exportOptions.format]);

  // Simple distance formatting without context dependency
  const formatDistance = (miles: number): string => {
    return `${Math.round(miles)} mi`;
  };

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const formatStartDate = (date?: Date): string => {
    if (!date) return 'Not specified';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const tripTitle = exportOptions.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`;

  // Weather service status for display
  const weatherServiceStatus = PDFWeatherIntegrationService.isWeatherServiceAvailable() ? 
    (weatherLoading ? '⏳' : (weatherLoadingTimeout ? '⚠️' : '🌤️')) : '❌';

  console.log('📄 PDFContentRenderer: Rendering with enhanced segments:', {
    segmentsCount: enrichedSegments.length,
    exportFormat: exportOptions.format,
    segmentsWithWeather: enrichedSegments.filter(s => s.weather || s.weatherData).length,
    weatherLoading,
    weatherLoadingTimeout,
    weatherServiceAvailable: PDFWeatherIntegrationService.isWeatherServiceAvailable()
  });

  return (
    <div className="pdf-clean-container bg-white text-black font-sans" style={{ maxWidth: 'none', width: '100%' }}>
      {/* PDF Header */}
      <div className="pdf-header mb-8 text-center border-b-2 border-blue-500 pb-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {tripTitle}
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          {tripPlan.startCity} → {tripPlan.endCity}
        </p>
        <p className="text-base text-gray-500">
          Generated on {format(new Date(), 'MMMM d, yyyy')}
        </p>
        
        {/* Weather Loading Status */}
        {weatherLoading && (
          <p className="text-sm text-blue-600 mt-2">
            ⏳ Loading weather data... (this may take up to 10 seconds)
          </p>
        )}
        {weatherLoadingTimeout && (
          <p className="text-sm text-orange-600 mt-2">
            ⚠️ Weather data loading timed out - using seasonal fallbacks
          </p>
        )}
      </div>

      {/* Trip Overview Stats */}
      <div className="pdf-overview mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trip Overview</h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded border">
            <div className="text-xl font-bold text-blue-600">{tripPlan.totalDays}</div>
            <div className="text-sm text-gray-600">Days</div>
            <div className="text-sm text-gray-500 mt-1">Starting {formatStartDate(tripStartDate)}</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded border">
            <div className="text-xl font-bold text-blue-600">{formatDistance(tripPlan.totalDistance)}</div>
            <div className="text-sm text-gray-600">Total Distance</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded border">
            <div className="text-xl font-bold text-blue-600">{formatTime(tripPlan.totalDrivingTime)}</div>
            <div className="text-sm text-gray-600">Drive Time</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded border">
            <div className="text-xl font-bold text-blue-600">{weatherServiceStatus}</div>
            <div className="text-sm text-gray-600">
              Weather {
                weatherLoading ? 'Loading' :
                weatherLoadingTimeout ? 'Timeout' :
                PDFWeatherIntegrationService.isWeatherServiceAvailable() ? 'Available' : 'Unavailable'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Daily Itinerary with Enhanced Weather */}
      <PDFItineraryView
        segments={enrichedSegments}
        tripStartDate={tripStartDate}
        tripId={`pdf-${Date.now()}`}
        totalDays={tripPlan.totalDays}
        exportFormat={exportOptions.format}
      />

      {/* QR Code Section */}
      {exportOptions.includeQRCode && shareUrl && (
        <div className="pdf-qr-section mt-8 p-4 bg-gray-50 rounded border text-center">
          <h3 className="text-base font-semibold text-gray-700 mb-2">View Live Version</h3>
          <p className="text-sm text-gray-600 mb-2">Scan QR code or visit:</p>
          <p className="text-sm text-blue-600 break-all">{shareUrl}</p>
        </div>
      )}

      {/* Watermark */}
      {exportOptions.watermark && (
        <div className="pdf-watermark-text fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 text-8xl text-gray-100 font-bold pointer-events-none z-0">
          {exportOptions.watermark}
        </div>
      )}

      {/* PDF Footer */}
      <div className="pdf-footer mt-12 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          Generated from Route 66 Trip Planner • {format(new Date(), 'MMMM d, yyyy')}
        </p>
        {shareUrl && (
          <p className="text-sm text-gray-400 mt-1 break-all">
            Live version: {shareUrl}
          </p>
        )}
        <p className="text-sm text-gray-400 mt-1">
          Weather data: {
            enrichedSegments.filter(s => s.weather || s.weatherData).length
          } of {enrichedSegments.length} segments loaded
        </p>
      </div>
    </div>
  );
};

export default PDFContentRenderer;
