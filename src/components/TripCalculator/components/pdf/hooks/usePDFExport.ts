
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
    console.log('🚀 PDF Export: Starting process...');
    console.log('🚀 PDF Export: Trip plan segments:', tripPlan.segments?.length || 0);
    console.log('🚀 PDF Export: Trip start date:', tripStartDate?.toISOString());
    
    setIsExporting(true);
    setWeatherLoading(true);

    try {
      // Always start with the original trip plan
      let enrichedPlan = { ...tripPlan };

      // Try to enrich with weather data, but don't let it block the process
      if (tripStartDate && tripPlan.segments && tripPlan.segments.length > 0) {
        console.log('🌤️ PDF Export: Attempting weather enrichment...');
        
        try {
          // Set a timeout for weather enrichment
          const weatherPromise = PDFWeatherIntegrationService.enrichSegmentsWithWeather(
            tripPlan.segments,
            tripStartDate
          );
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Weather enrichment timeout')), 10000)
          );

          const enrichedSegments = await Promise.race([weatherPromise, timeoutPromise]) as any;
          
          enrichedPlan = {
            ...tripPlan,
            segments: enrichedSegments
          };
          console.log('✅ PDF Export: Weather enrichment completed successfully');
        } catch (weatherError) {
          console.warn('⚠️ PDF Export: Weather enrichment failed, proceeding without weather data:', weatherError);
          // Continue with original plan if weather fails
        }
      } else {
        console.log('🔄 PDF Export: Skipping weather enrichment (no date or segments)');
      }

      setEnrichedTripPlan(enrichedPlan);
      setWeatherLoading(false);
      
      // Add PDF styles and show preview
      console.log('🎨 PDF Export: Adding print styles...');
      addPrintStyles();
      
      console.log('📄 PDF Export: Showing preview...');
      setShowPreview(true);
      
      console.log('✅ PDF Export: Process completed successfully');
    } catch (error) {
      console.error('❌ PDF Export: Critical error:', error);
      setWeatherLoading(false);
      
      // Fallback: show preview with original trip plan
      console.log('🔄 PDF Export: Showing fallback preview...');
      setEnrichedTripPlan(tripPlan);
      addPrintStyles();
      setShowPreview(true);
    } finally {
      setIsExporting(false);
    }
  }, [tripPlan, tripStartDate, addPrintStyles]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 PDF Export: Closing preview...');
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
