
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
  const [weatherLoadingStatus, setWeatherLoadingStatus] = useState<string>('');
  const [weatherLoadingProgress, setWeatherLoadingProgress] = useState(0);
  
  const { addPrintStyles, removePrintStyles } = usePDFStyles();

  const handleExportPDF = useCallback(async () => {
    console.log('🚀 PDF Export: Starting simplified export process...');
    console.log('📊 Initial validation:', {
      hasSegments: !!(tripPlan.segments && tripPlan.segments.length > 0),
      segmentCount: tripPlan.segments?.length || 0,
      hasStartDate: !!tripStartDate,
      isAlreadyExporting: isExporting
    });

    // Prevent double execution
    if (isExporting) {
      console.warn('⚠️ Export already in progress');
      return;
    }

    // Validate trip plan
    if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
      console.error('❌ Invalid trip plan - no segments found');
      alert('Cannot export PDF: No trip segments found. Please create a trip plan first.');
      return;
    }

    setIsExporting(true);
    
    try {
      // Start with original trip plan
      let finalTripPlan = { ...tripPlan };
      
      // Try weather enrichment if we have a start date
      if (tripStartDate && tripPlan.segments && tripPlan.segments.length > 0) {
        console.log('🌤️ Attempting weather enrichment...');
        setWeatherLoading(true);
        setWeatherLoadingStatus('Loading weather data...');
        setWeatherLoadingProgress(25);
        
        try {
          // Set timeout for weather enrichment
          const weatherPromise = PDFWeatherIntegrationService.enrichSegmentsWithWeather(
            tripPlan.segments,
            tripStartDate
          );
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Weather timeout')), 8000)
          );

          setWeatherLoadingProgress(75);
          const enrichedSegments = await Promise.race([weatherPromise, timeoutPromise]) as any;
          
          if (enrichedSegments && Array.isArray(enrichedSegments) && enrichedSegments.length > 0) {
            finalTripPlan = { ...tripPlan, segments: enrichedSegments };
            setWeatherLoadingStatus('Weather data loaded!');
            console.log('✅ Weather enrichment successful');
          }
        } catch (weatherError) {
          console.warn('⚠️ Weather enrichment failed, continuing without:', weatherError);
          setWeatherLoadingStatus('Proceeding without weather data...');
        }
        
        setWeatherLoadingProgress(100);
        setWeatherLoading(false);
      }

      // Set the enriched trip plan
      setEnrichedTripPlan(finalTripPlan);
      
      // Add print styles
      addPrintStyles();
      
      // Show the preview
      console.log('📄 Showing PDF preview...');
      setShowPreview(true);
      
      console.log('✅ PDF export process completed successfully');

    } catch (error) {
      console.error('❌ Critical error in PDF export:', error);
      
      // Fallback: show preview with original trip plan
      setEnrichedTripPlan(tripPlan);
      addPrintStyles();
      setShowPreview(true);
      
    } finally {
      setIsExporting(false);
      setWeatherLoading(false);
    }
  }, [tripPlan, tripStartDate, addPrintStyles, isExporting]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 Closing PDF preview...');
    setShowPreview(false);
    setEnrichedTripPlan(null);
    setWeatherLoadingStatus('');
    setWeatherLoadingProgress(0);
    removePrintStyles();
    onClose();
  }, [removePrintStyles, onClose]);

  return {
    isExporting,
    showPreview,
    weatherLoading,
    weatherLoadingStatus,
    weatherLoadingProgress,
    enrichedTripPlan,
    handleExportPDF,
    handleClosePreview
  };
};
