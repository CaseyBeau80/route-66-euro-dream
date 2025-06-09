
import { useState, useCallback } from 'react';
import { TripPlan, TripPlanDataValidator } from '../../../services/planning/TripPlanBuilder';
import { PDFDataIntegrityService } from '../../../services/pdf/PDFDataIntegrityService';
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
    console.log('🚀 PDF Export: Starting enhanced export process');
    
    // Validate trip plan first
    if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
      console.error('❌ Invalid trip plan - no segments found');
      alert('Cannot export PDF: No trip segments found. Please create a trip plan first.');
      return;
    }

    console.log('✅ Trip plan validated, performing data integrity check...');
    
    try {
      // Set loading states
      setIsExporting(true);
      setWeatherLoading(true);
      
      // Validate and sanitize trip plan
      const sanitizedTripPlan = TripPlanDataValidator.sanitizeTripPlan(tripPlan);
      const integrityReport = PDFDataIntegrityService.generateIntegrityReport(sanitizedTripPlan);
      
      console.log('📊 Data integrity check completed:', {
        isValid: integrityReport.isValid,
        completeness: integrityReport.enrichmentStatus.completenessPercentage,
        warnings: integrityReport.warnings.length
      });
      
      // Mark as enriched for tracking
      const enrichedTripPlan: TripPlan = {
        ...sanitizedTripPlan,
        isEnriched: true,
        lastUpdated: new Date(),
        enrichmentStatus: {
          weatherData: integrityReport.enrichmentStatus.hasWeatherData,
          stopsData: integrityReport.enrichmentStatus.hasStopsData,
          validationComplete: integrityReport.isValid
        }
      };
      
      // Set the preview trip plan
      console.log('📄 Setting enhanced preview trip plan with', enrichedTripPlan.segments.length, 'segments');
      setPreviewTripPlan(enrichedTripPlan);
      
      // Add print styles to document
      console.log('🎨 Adding enhanced print styles...');
      addPrintStyles();
      
      // Small delay to ensure state updates, then show preview
      setTimeout(() => {
        console.log('🔄 Showing enhanced PDF preview...');
        setShowPreview(true);
        setIsExporting(false);
        setWeatherLoading(false);
        console.log('✅ Enhanced PDF preview ready');
      }, 300);
      
    } catch (error) {
      console.error('❌ Error during enhanced PDF export:', error);
      setIsExporting(false);
      setWeatherLoading(false);
      setShowPreview(false);
      setPreviewTripPlan(null);
      alert('An error occurred while preparing the PDF preview. Please try again.');
    }
    
  }, [tripPlan, addPrintStyles]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 Closing enhanced PDF preview...');
    
    // Reset all preview states
    setShowPreview(false);
    setPreviewTripPlan(null);
    setIsExporting(false);
    setWeatherLoading(false);
    
    // Call the parent onClose callback
    onClose();
    
    console.log('✅ Enhanced PDF preview closed');
  }, [onClose]);

  // Debug logging
  console.log('🎯 Enhanced usePDFExport state:', {
    isExporting,
    showPreview,
    hasPreviewTripPlan: !!previewTripPlan,
    weatherLoading,
    tripPlanValid: !!(tripPlan?.segments?.length),
    tripPlanEnriched: tripPlan?.isEnriched
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
