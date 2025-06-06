
import React, { useEffect, useState } from 'react';
import { TripPlan, DailySegment } from '../../services/planning/TripPlanBuilder';
import PDFItineraryView from './PDFItineraryView';
import PDFHeader from './PDFHeader';
import PDFOverview from './PDFOverview';
import PDFFooter from './PDFFooter';
import { PDFWeatherIntegrationService } from './PDFWeatherIntegrationService';

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

  const tripTitle = exportOptions.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`;

  console.log('📄 PDFContentRenderer: Rendering with enhanced segments:', {
    segmentsCount: enrichedSegments.length,
    exportFormat: exportOptions.format,
    segmentsWithWeather: enrichedSegments.filter(s => s.weather || s.weatherData).length,
    weatherLoading,
    weatherLoadingTimeout,
    weatherServiceAvailable: PDFWeatherIntegrationService.isWeatherServiceAvailable()
  });

  return (
    <div className="pdf-clean-container bg-white text-black font-sans">
      {/* Unified Container - Single max-w-6xl wrapper for entire content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        <PDFHeader
          tripTitle={tripTitle}
          startCity={tripPlan.startCity}
          endCity={tripPlan.endCity}
          weatherLoading={weatherLoading}
          weatherLoadingTimeout={weatherLoadingTimeout}
          watermark={exportOptions.watermark}
        />

        <PDFOverview
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          weatherLoading={weatherLoading}
          weatherLoadingTimeout={weatherLoadingTimeout}
        />

        {/* Daily Itinerary with Enhanced Weather */}
        <PDFItineraryView
          segments={enrichedSegments}
          tripStartDate={tripStartDate}
          tripId={`pdf-${Date.now()}`}
          totalDays={tripPlan.totalDays}
          exportFormat={exportOptions.format}
        />

        <PDFFooter
          shareUrl={shareUrl}
          enrichedSegments={enrichedSegments}
          includeQRCode={exportOptions.includeQRCode}
        />
        
      </div>
    </div>
  );
};

export default PDFContentRenderer;
