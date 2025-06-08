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
  const [weatherTimeout, setWeatherTimeout] = useState(false);
  
  const { addPrintStyles, removePrintStyles } = usePDFStyles();

  const handleExportPDF = useCallback(async () => {
    console.log('🚀 PDF Export: Starting GUARANTEED preview process...');
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
    setWeatherTimeout(false);
    
    try {
      // STEP 1: GUARANTEED PREVIEW OPENING
      // Always show preview first with original trip plan
      console.log('📄 GUARANTEED: Opening preview with original trip plan...');
      setEnrichedTripPlan(tripPlan);
      addPrintStyles();
      setShowPreview(true);
      
      // STEP 2: BACKGROUND WEATHER ENRICHMENT
      // Try weather enrichment in background if we have a start date
      if (tripStartDate && tripPlan.segments && tripPlan.segments.length > 0) {
        console.log('🌤️ Background: Starting weather enrichment...');
        setWeatherLoading(true);
        setWeatherLoadingStatus('Loading weather data...');
        setWeatherLoadingProgress(25);
        
        try {
          // 6-second timeout for weather enrichment
          const weatherPromise = PDFWeatherIntegrationService.enrichSegmentsWithWeather(
            tripPlan.segments,
            tripStartDate
          );
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Weather timeout after 6 seconds')), 6000)
          );

          setWeatherLoadingProgress(50);
          
          const enrichedSegments = await Promise.race([weatherPromise, timeoutPromise]) as any;
          
          if (enrichedSegments && Array.isArray(enrichedSegments) && enrichedSegments.length > 0) {
            // Update preview with enriched data
            const updatedTripPlan = { ...tripPlan, segments: enrichedSegments };
            setEnrichedTripPlan(updatedTripPlan);
            setWeatherLoadingStatus('Weather data loaded successfully!');
            setWeatherLoadingProgress(100);
            console.log('✅ Weather enrichment successful - preview updated');
          } else {
            throw new Error('Invalid weather data received');
          }
          
        } catch (weatherError) {
          console.warn('⚠️ Weather enrichment failed/timeout:', weatherError);
          setWeatherTimeout(true);
          setWeatherLoadingStatus('Weather data timeout - using seasonal estimates');
          setWeatherLoadingProgress(100);
          
          // Keep original trip plan - preview already showing
          console.log('📊 Continuing with original trip plan (seasonal fallback available in preview)');
        }
        
        setWeatherLoading(false);
      }
      
      console.log('✅ PDF export process completed successfully - Preview is showing');

    } catch (error) {
      console.error('❌ Critical error in PDF export:', error);
      
      // Even on critical error, ensure preview is showing
      if (!showPreview) {
        console.log('🔧 Fallback: Ensuring preview shows despite error');
        setEnrichedTripPlan(tripPlan);
        addPrintStyles();
        setShowPreview(true);
      }
      
    } finally {
      setIsExporting(false);
    }
  }, [tripPlan, tripStartDate, addPrintStyles, isExporting, showPreview]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 Closing PDF preview...');
    setShowPreview(false);
    setEnrichedTripPlan(null);
    setWeatherLoadingStatus('');
    setWeatherLoadingProgress(0);
    setWeatherTimeout(false);
    setWeatherLoading(false);
    removePrintStyles();
    onClose();
  }, [removePrintStyles, onClose]);

  return {
    isExporting,
    showPreview,
    weatherLoading,
    weatherLoadingStatus,
    weatherLoadingProgress,
    weatherTimeout,
    enrichedTripPlan,
    handleExportPDF,
    handleClosePreview
  };
};
