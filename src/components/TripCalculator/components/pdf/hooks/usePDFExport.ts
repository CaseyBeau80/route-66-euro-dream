
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
    console.log('🚀 PDF Export: BULLETPROOF PROCESS STARTING...');
    console.log('📊 PDF Export: Initial State Check:', {
      hasSegments: !!(tripPlan.segments && tripPlan.segments.length > 0),
      segmentCount: tripPlan.segments?.length || 0,
      hasStartDate: !!tripStartDate,
      tripStartDate: tripStartDate?.toISOString(),
      exportFormat: exportOptions.format,
      isAlreadyExporting: isExporting
    });

    // BULLETPROOF GUARD: Prevent double execution
    if (isExporting) {
      console.warn('⚠️ PDF Export: Already in progress, blocking duplicate execution');
      return;
    }

    // BULLETPROOF GUARD: Validate trip plan
    if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
      console.error('❌ PDF Export: Invalid trip plan - no segments found');
      alert('Cannot export PDF: No trip segments found. Please create a trip plan first.');
      return;
    }

    // START EXPORT PROCESS
    setIsExporting(true);
    setWeatherLoading(true);
    setWeatherLoadingStatus('Initializing weather data...');
    setWeatherLoadingProgress(10);

    let finalTripPlan = { ...tripPlan };
    let weatherEnrichmentSuccess = false;

    try {
      console.log('🌤️ PDF Export: WEATHER ENRICHMENT PHASE STARTING...');
      
      // WEATHER ENRICHMENT WITH BULLETPROOF FALLBACKS
      if (tripStartDate && tripPlan.segments && tripPlan.segments.length > 0) {
        console.log('🌤️ PDF Export: Attempting weather enrichment for', tripPlan.segments.length, 'segments');
        setWeatherLoadingStatus(`Loading weather for ${tripPlan.segments.length} destinations...`);
        setWeatherLoadingProgress(25);

        try {
          // BULLETPROOF TIMEOUT WRAPPER
          const weatherEnrichmentWithTimeout = async () => {
            const WEATHER_TIMEOUT = 12000; // 12 seconds max
            
            const weatherPromise = PDFWeatherIntegrationService.enrichSegmentsWithWeather(
              tripPlan.segments,
              tripStartDate
            );
            
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Weather enrichment timeout after 12 seconds')), WEATHER_TIMEOUT)
            );

            return Promise.race([weatherPromise, timeoutPromise]);
          };

          setWeatherLoadingProgress(50);
          setWeatherLoadingStatus('Fetching weather forecasts...');
          
          const enrichedSegments = await weatherEnrichmentWithTimeout() as any;
          
          if (enrichedSegments && Array.isArray(enrichedSegments) && enrichedSegments.length > 0) {
            finalTripPlan = {
              ...tripPlan,
              segments: enrichedSegments
            };
            weatherEnrichmentSuccess = true;
            setWeatherLoadingProgress(80);
            setWeatherLoadingStatus('Weather data loaded successfully!');
            console.log('✅ PDF Export: Weather enrichment completed successfully');
            console.log('✅ PDF Export: Enhanced', enrichedSegments.length, 'segments with weather data');
          } else {
            throw new Error('Weather enrichment returned invalid data');
          }
          
        } catch (weatherError) {
          console.warn('⚠️ PDF Export: Weather enrichment failed:', weatherError);
          setWeatherLoadingStatus('Weather unavailable, proceeding without...');
          setWeatherLoadingProgress(90);
          
          // BULLETPROOF FALLBACK: Continue with original plan
          finalTripPlan = { ...tripPlan };
          weatherEnrichmentSuccess = false;
        }
      } else {
        console.log('🔄 PDF Export: Skipping weather enrichment (missing date or segments)');
        setWeatherLoadingStatus('No weather data needed');
        setWeatherLoadingProgress(90);
        weatherEnrichmentSuccess = false;
      }

      // FINALIZE EXPORT PREPARATION
      console.log('📄 PDF Export: FINALIZING EXPORT PREPARATION...');
      setWeatherLoadingStatus('Preparing PDF preview...');
      setWeatherLoadingProgress(95);
      
      // BULLETPROOF STATE UPDATE
      setEnrichedTripPlan(finalTripPlan);
      setWeatherLoading(false);
      setWeatherLoadingProgress(100);
      
      // ADD PRINT STYLES
      console.log('🎨 PDF Export: Adding print styles...');
      addPrintStyles();
      
      // SHOW PREVIEW
      console.log('📄 PDF Export: Showing preview...');
      setShowPreview(true);
      
      console.log('✅ PDF Export: BULLETPROOF PROCESS COMPLETED SUCCESSFULLY');
      console.log('✅ PDF Export: Final Summary:', {
        weatherEnrichmentSuccess,
        finalSegmentCount: finalTripPlan.segments?.length || 0,
        hasWeatherData: finalTripPlan.segments?.some(s => s.weather || s.weatherData) || false
      });

    } catch (criticalError) {
      console.error('❌ PDF Export: CRITICAL ERROR in bulletproof process:', criticalError);
      
      // BULLETPROOF FINAL FALLBACK
      console.log('🔄 PDF Export: EXECUTING FINAL FALLBACK...');
      setWeatherLoading(false);
      setWeatherLoadingStatus('Error occurred, showing basic preview...');
      
      try {
        // Last resort: show preview with original trip plan
        setEnrichedTripPlan(tripPlan);
        addPrintStyles();
        setShowPreview(true);
        console.log('✅ PDF Export: Final fallback preview shown successfully');
      } catch (fallbackError) {
        console.error('❌ PDF Export: Even fallback failed:', fallbackError);
        alert('PDF export failed completely. Please refresh the page and try again.');
      }
    } finally {
      // BULLETPROOF CLEANUP
      console.log('🧹 PDF Export: Bulletproof cleanup executing...');
      setIsExporting(false);
      setWeatherLoadingProgress(100);
      setTimeout(() => {
        setWeatherLoadingStatus('');
        setWeatherLoadingProgress(0);
      }, 2000);
    }
  }, [tripPlan, tripStartDate, addPrintStyles]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 PDF Export: Closing preview and cleaning up...');
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
