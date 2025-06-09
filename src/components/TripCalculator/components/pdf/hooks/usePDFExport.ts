
import { useState, useCallback } from 'react';
import { TripPlan } from '../../../services/planning/TripPlanBuilder';
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
    console.log('🚀 PDF Export: Starting export process');
    
    // Validate trip plan first
    if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
      console.error('❌ Invalid trip plan - no segments found');
      alert('Cannot export PDF: No trip segments found. Please create a trip plan first.');
      return;
    }

    console.log('✅ Trip plan validated, preparing preview...');
    
    try {
      // Set loading states
      setIsExporting(true);
      setWeatherLoading(true);
      
      // Set the preview trip plan
      console.log('📄 Setting preview trip plan with', tripPlan.segments.length, 'segments');
      setPreviewTripPlan(tripPlan);
      
      // Add print styles to document
      console.log('🎨 Adding print styles...');
      addPrintStyles();
      
      // Small delay to ensure state updates, then show preview
      setTimeout(() => {
        console.log('🔄 Showing PDF preview...');
        setShowPreview(true);
        setIsExporting(false);
        setWeatherLoading(false);
        console.log('✅ PDF preview ready');
      }, 300);
      
    } catch (error) {
      console.error('❌ Error during PDF export:', error);
      setIsExporting(false);
      setWeatherLoading(false);
      setShowPreview(false);
      setPreviewTripPlan(null);
      alert('An error occurred while preparing the PDF preview. Please try again.');
    }
    
  }, [tripPlan, addPrintStyles]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 Closing PDF preview...');
    
    // Reset all preview states
    setShowPreview(false);
    setPreviewTripPlan(null);
    setIsExporting(false);
    setWeatherLoading(false);
    
    // Call the parent onClose callback
    onClose();
    
    console.log('✅ PDF preview closed');
  }, [onClose]);

  // Debug logging
  console.log('🎯 usePDFExport state:', {
    isExporting,
    showPreview,
    hasPreviewTripPlan: !!previewTripPlan,
    weatherLoading,
    tripPlanValid: !!(tripPlan?.segments?.length)
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
