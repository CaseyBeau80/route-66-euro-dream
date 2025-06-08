
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
      // Enrich segments with weather data using UI logic
      const enrichedSegments = await PDFWeatherIntegrationService.enrichSegmentsWithWeather(
        tripPlan.segments || [],
        tripStartDate
      );

      const enrichedPlan = {
        ...tripPlan,
        segments: enrichedSegments
      };

      setEnrichedTripPlan(enrichedPlan);
      setWeatherLoading(false);
      
      // Add PDF styles and show preview
      addPrintStyles();
      setShowPreview(true);
      
      console.log('✅ PDF export preparation complete');
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      setWeatherLoading(false);
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
