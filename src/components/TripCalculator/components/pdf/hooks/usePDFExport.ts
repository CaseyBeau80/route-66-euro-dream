
import { useState, useCallback } from 'react';
import { TripPlan, TripPlanDataValidator } from '../../../services/planning/TripPlanBuilder';
import { PDFDataIntegrityService } from '../../../services/pdf/PDFDataIntegrityService';
import { PDFWeatherIntegrationService } from '../PDFWeatherIntegrationService';
import { usePDFStyles } from './usePDFStyles';

interface UsePDFExportProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  exportOptions: any;
  onClose: () => void;
}

export const usePDFExport = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  exportOptions,
  onClose
}: UsePDFExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTripPlan, setPreviewTripPlan] = useState<TripPlan | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  const { addPrintStyles } = usePDFStyles();

  const handleExportPDF = useCallback(async () => {
    console.log('🚀 PDF Export: Starting FRESH export process with weather enrichment');
    
    // Clear any existing preview data first
    setPreviewTripPlan(null);
    setShowPreview(false);
    
    // Validate trip plan first
    if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
      console.error('❌ Invalid trip plan - no segments found');
      alert('Cannot export PDF: No trip segments found. Please create a trip plan first.');
      return;
    }

    console.log('✅ Trip plan validated, performing FRESH data integrity check and weather enrichment...');
    
    try {
      // Set loading states
      setIsExporting(true);
      setWeatherLoading(true);
      
      // Force a fresh copy of the trip plan
      const freshTripPlan = JSON.parse(JSON.stringify(tripPlan));
      console.log('📋 Created fresh copy of trip plan with', freshTripPlan.segments.length, 'segments');
      
      // Validate and sanitize trip plan
      const sanitizedTripPlan = TripPlanDataValidator.sanitizeTripPlan(freshTripPlan);
      console.log('📊 Trip plan sanitized, starting FRESH weather enrichment...');
      
      // Enrich segments with weather data - ALWAYS fetch fresh data
      let enrichedSegments = sanitizedTripPlan.segments;
      
      if (tripStartDate) {
        console.log('🌤️ Enriching segments with FRESH weather data...');
        try {
          enrichedSegments = await PDFWeatherIntegrationService.enrichSegmentsWithWeather(
            sanitizedTripPlan.segments,
            tripStartDate
          );
          console.log('✅ FRESH weather enrichment completed successfully');
          console.log('🌤️ Segments with weather data:', enrichedSegments.filter(s => s.weather).length);
          
          // Log weather data for debugging
          enrichedSegments.forEach((segment, index) => {
            if (segment.weather) {
              console.log(`🌤️ Day ${index + 1} weather:`, {
                city: segment.endCity,
                temp: `${segment.weather.highTemp}°/${segment.weather.lowTemp}°F`,
                condition: segment.weather.description,
                humidity: segment.weather.humidity,
                wind: segment.weather.windSpeed
              });
            }
          });
        } catch (weatherError) {
          console.warn('⚠️ Weather enrichment failed, proceeding without weather data:', weatherError);
          // Continue with original segments if weather enrichment fails
        }
      } else {
        console.log('📅 No trip start date provided, skipping weather enrichment');
      }
      
      // Update segments in the sanitized trip plan
      const weatherEnrichedTripPlan = {
        ...sanitizedTripPlan,
        segments: enrichedSegments,
        dailySegments: enrichedSegments,
        // Add timestamp to force refresh
        lastUpdated: new Date(),
        exportTimestamp: Date.now()
      };
      
      // Perform data integrity check on enriched plan
      const integrityReport = PDFDataIntegrityService.generateIntegrityReport(weatherEnrichedTripPlan);
      
      console.log('📊 FRESH data integrity check completed:', {
        isValid: integrityReport.isValid,
        completeness: integrityReport.enrichmentStatus.completenessPercentage,
        warnings: integrityReport.warnings.length,
        weatherEnriched: enrichedSegments.filter(s => s.weather).length > 0,
        timestamp: weatherEnrichedTripPlan.exportTimestamp
      });
      
      // Mark as enriched for tracking
      const finalTripPlan: TripPlan = {
        ...weatherEnrichedTripPlan,
        isEnriched: true,
        enrichmentStatus: {
          weatherData: integrityReport.enrichmentStatus.hasWeatherData,
          stopsData: integrityReport.enrichmentStatus.hasStopsData,
          validationComplete: integrityReport.isValid
        }
      };
      
      // Set the preview trip plan with fresh data
      console.log('📄 Setting FRESH weather-enriched preview trip plan with', finalTripPlan.segments.length, 'segments');
      setPreviewTripPlan(finalTripPlan);
      
      // Add print styles to document
      console.log('🎨 Adding enhanced print styles...');
      addPrintStyles();
      
      // Small delay to ensure state updates, then show preview
      setTimeout(() => {
        console.log('🔄 Showing FRESH weather-enriched PDF preview...');
        setShowPreview(true);
        setIsExporting(false);
        setWeatherLoading(false);
        console.log('✅ FRESH weather-enriched PDF preview ready with timestamp:', finalTripPlan.exportTimestamp);
      }, 300);
      
    } catch (error) {
      console.error('❌ Error during FRESH PDF export:', error);
      setIsExporting(false);
      setWeatherLoading(false);
      setShowPreview(false);
      setPreviewTripPlan(null);
      alert('An error occurred while preparing the PDF preview. Please try again.');
    }
    
  }, [tripPlan, tripStartDate, addPrintStyles]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 Closing weather-enriched PDF preview and clearing cache...');
    
    // Reset all preview states and clear cache
    setShowPreview(false);
    setPreviewTripPlan(null);
    setIsExporting(false);
    setWeatherLoading(false);
    
    // Call the parent onClose callback
    onClose();
    
    console.log('✅ Weather-enriched PDF preview closed and cache cleared');
  }, [onClose]);

  // Debug logging with enhanced details
  console.log('🎯 Enhanced usePDFExport state:', {
    isExporting,
    showPreview,
    hasPreviewTripPlan: !!previewTripPlan,
    previewTripPlanTimestamp: previewTripPlan?.exportTimestamp,
    weatherLoading,
    tripPlanValid: !!(tripPlan?.segments?.length),
    tripPlanEnriched: tripPlan?.isEnriched,
    hasStartDate: !!tripStartDate,
    segmentCount: tripPlan?.segments?.length || 0
  });

  return {
    isExporting,
    showPreview,
    weatherLoading,
    weatherLoadingStatus: weatherLoading ? 'Loading fresh weather data...' : '',
    weatherLoadingProgress: weatherLoading ? 50 : 0,
    weatherTimeout: false,
    previewTripPlan,
    handleExportPDF,
    handleClosePreview
  };
};
