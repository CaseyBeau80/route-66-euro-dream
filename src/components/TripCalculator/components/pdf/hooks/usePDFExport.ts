
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
  const [previewTripPlan, setPreviewTripPlan] = useState<TripPlan | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherLoadingStatus, setWeatherLoadingStatus] = useState<string>('');
  const [weatherLoadingProgress, setWeatherLoadingProgress] = useState(0);
  const [weatherTimeout, setWeatherTimeout] = useState(false);
  
  const { addPrintStyles, removePrintStyles } = usePDFStyles();

  const handleExportPDF = useCallback(async () => {
    console.log('🚀 PDF Export: Starting export process...');
    
    // Validate trip plan
    if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
      console.error('❌ Invalid trip plan - no segments found');
      alert('Cannot export PDF: No trip segments found. Please create a trip plan first.');
      return;
    }

    // Prevent multiple simultaneous exports
    if (isExporting || showPreview) {
      console.warn('⚠️ Export already in progress or preview already showing');
      return;
    }

    setIsExporting(true);
    setWeatherTimeout(false);
    
    try {
      // STEP 1: IMMEDIATELY SHOW PREVIEW
      console.log('📄 Step 1: Immediately showing preview with original plan');
      setPreviewTripPlan(tripPlan);
      addPrintStyles();
      setShowPreview(true);
      
      // STEP 2: BACKGROUND WEATHER ENRICHMENT
      if (tripStartDate && tripPlan.segments && tripPlan.segments.length > 0) {
        console.log('🌤️ Step 2: Starting background weather enrichment...');
        setWeatherLoading(true);
        setWeatherLoadingStatus('Loading weather data...');
        setWeatherLoadingProgress(25);
        
        try {
          const weatherPromise = PDFWeatherIntegrationService.enrichSegmentsWithWeather(
            tripPlan.segments,
            tripStartDate
          );
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Weather timeout')), 6000)
          );

          setWeatherLoadingProgress(50);
          
          const enrichedSegments = await Promise.race([weatherPromise, timeoutPromise]) as any;
          
          if (enrichedSegments && Array.isArray(enrichedSegments) && enrichedSegments.length > 0) {
            const updatedTripPlan = { ...tripPlan, segments: enrichedSegments };
            setPreviewTripPlan(updatedTripPlan);
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
        }
        
        setWeatherLoading(false);
      }
      
      console.log('✅ PDF export process completed - Preview is showing');

    } catch (error) {
      console.error('❌ Critical error in PDF export:', error);
      
      // Ensure preview shows even on error
      if (!showPreview) {
        console.log('🔧 Fallback: Ensuring preview shows despite error');
        setPreviewTripPlan(tripPlan);
        addPrintStyles();
        setShowPreview(true);
      }
      
    } finally {
      // Only reset isExporting after preview is shown
      setIsExporting(false);
    }
  }, [tripPlan, tripStartDate, addPrintStyles, isExporting, showPreview]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 Closing PDF preview...');
    setShowPreview(false);
    setPreviewTripPlan(null);
    setWeatherLoadingStatus('');
    setWeatherLoadingProgress(0);
    setWeatherTimeout(false);
    setWeatherLoading(false);
    removePrintStyles();
    onClose();
  }, [removePrintStyles, onClose]);

  console.log('🎯 usePDFExport state:', {
    isExporting,
    showPreview,
    weatherLoading,
    hasPreviewTripPlan: !!previewTripPlan
  });

  return {
    isExporting,
    showPreview,
    weatherLoading,
    weatherLoadingStatus,
    weatherLoadingProgress,
    weatherTimeout,
    previewTripPlan,
    handleExportPDF,
    handleClosePreview
  };
};
