
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
    console.log('🚀 PDF Export: Starting enhanced export process with weather enrichment');
    
    // Validate trip plan first
    if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
      console.error('❌ Invalid trip plan - no segments found');
      alert('Cannot export PDF: No trip segments found. Please create a trip plan first.');
      return;
    }

    console.log('✅ Trip plan validated, performing data integrity check and weather enrichment...');
    
    try {
      // Set loading states
      setIsExporting(true);
      setWeatherLoading(true);
      
      // Validate and sanitize trip plan
      const sanitizedTripPlan = TripPlanDataValidator.sanitizeTripPlan(tripPlan);
      console.log('📊 Trip plan sanitized, starting weather enrichment...');
      
      // Enrich segments with weather data
      let enrichedSegments = sanitizedTripPlan.segments;
      
      if (tripStartDate) {
        console.log('🌤️ Enriching segments with weather data...');
        try {
          enrichedSegments = await PDFWeatherIntegrationService.enrichSegmentsWithWeather(
            sanitizedTripPlan.segments,
            tripStartDate
          );
          console.log('✅ Weather enrichment completed successfully');
          console.log('🌤️ Segments with weather data:', enrichedSegments.filter(s => s.weather).length);
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
        dailySegments: enrichedSegments
      };
      
      // Perform data integrity check on enriched plan
      const integrityReport = PDFDataIntegrityService.generateIntegrityReport(weatherEnrichedTripPlan);
      
      console.log('📊 Data integrity check completed:', {
        isValid: integrityReport.isValid,
        completeness: integrityReport.enrichmentStatus.completenessPercentage,
        warnings: integrityReport.warnings.length,
        weatherEnriched: enrichedSegments.filter(s => s.weather).length > 0
      });
      
      // Mark as enriched for tracking
      const finalTripPlan: TripPlan = {
        ...weatherEnrichedTripPlan,
        isEnriched: true,
        lastUpdated: new Date(),
        enrichmentStatus: {
          weatherData: integrityReport.enrichmentStatus.hasWeatherData,
          stopsData: integrityReport.enrichmentStatus.hasStopsData,
          validationComplete: integrityReport.isValid
        }
      };
      
      // Set the preview trip plan
      console.log('📄 Setting weather-enriched preview trip plan with', finalTripPlan.segments.length, 'segments');
      setPreviewTripPlan(finalTripPlan);
      
      // Add print styles to document
      console.log('🎨 Adding enhanced print styles...');
      addPrintStyles();
      
      // Small delay to ensure state updates, then show preview
      setTimeout(() => {
        console.log('🔄 Showing weather-enriched PDF preview...');
        setShowPreview(true);
        setIsExporting(false);
        setWeatherLoading(false);
        console.log('✅ Weather-enriched PDF preview ready');
      }, 300);
      
    } catch (error) {
      console.error('❌ Error during enhanced PDF export:', error);
      setIsExporting(false);
      setWeatherLoading(false);
      setShowPreview(false);
      setPreviewTripPlan(null);
      alert('An error occurred while preparing the PDF preview. Please try again.');
    }
    
  }, [tripPlan, tripStartDate, addPrintStyles]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 Closing weather-enriched PDF preview...');
    
    // Reset all preview states
    setShowPreview(false);
    setPreviewTripPlan(null);
    setIsExporting(false);
    setWeatherLoading(false);
    
    // Call the parent onClose callback
    onClose();
    
    console.log('✅ Weather-enriched PDF preview closed');
  }, [onClose]);

  // Debug logging
  console.log('🎯 Enhanced usePDFExport state:', {
    isExporting,
    showPreview,
    hasPreviewTripPlan: !!previewTripPlan,
    weatherLoading,
    tripPlanValid: !!(tripPlan?.segments?.length),
    tripPlanEnriched: tripPlan?.isEnriched,
    hasStartDate: !!tripStartDate
  });

  return {
    isExporting,
    showPreview,
    weatherLoading,
    weatherLoadingStatus: weatherLoading ? 'Loading weather data...' : '',
    weatherLoadingProgress: weatherLoading ? 50 : 0,
    weatherTimeout: false,
    previewTripPlan,
    handleExportPDF,
    handleClosePreview
  };
};
