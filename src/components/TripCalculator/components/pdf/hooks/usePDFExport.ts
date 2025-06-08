
import { useState, useCallback } from 'react';
import { TripPlan } from '../../../services/planning/TripPlanBuilder';
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
  const [enrichedTripPlan, setEnrichedTripPlan] = useState<TripPlan | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  const { addPrintStyles, removePrintStyles } = usePDFStyles();

  const handleExportPDF = useCallback(async () => {
    console.log('🚀 Starting enhanced PDF export process...');
    setIsExporting(true);
    setWeatherLoading(true);

    try {
      // Always start with the original trip plan
      let enrichedPlan = { ...tripPlan };

      try {
        // Attempt to enrich segments with weather data
        console.log('🌤️ Attempting to enrich segments with weather data...');
        const enrichedSegments = await PDFWeatherIntegrationService.enrichSegmentsWithWeather(
          tripPlan.segments || [],
          tripStartDate
        );

        enrichedPlan = {
          ...tripPlan,
          segments: enrichedSegments
        };
        console.log('✅ Weather enrichment completed successfully');
      } catch (weatherError) {
        console.warn('⚠️ Weather enrichment failed, proceeding without weather data:', weatherError);
        // Continue with original plan if weather fails
      }

      setEnrichedTripPlan(enrichedPlan);
      setWeatherLoading(false);
      
      // Add PDF styles and show preview
      addPrintStyles();
      setShowPreview(true);
      
      console.log('✅ PDF export preparation complete');
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      setWeatherLoading(false);
      
      // Fallback: show preview with original trip plan
      setEnrichedTripPlan(tripPlan);
      addPrintStyles();
      setShowPreview(true);
    } finally {
      setIsExporting(false);
    }
  }, [tripPlan, tripStartDate, addPrintStyles]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 Closing PDF preview...');
    setShowPreview(false);
    setEnrichedTripPlan(null);
    removePrintStyles();
    onClose();
  }, [removePrintStyles, onClose]);

  return {
    isExporting,
    showPreview,
    weatherLoading,
    enrichedTripPlan,
    handleExportPDF,
    handleClosePreview
  };
};
