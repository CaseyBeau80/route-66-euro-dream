
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
    console.log('🚀 PDF Export: handleExportPDF called');
    console.log('📋 Trip plan validation:', {
      hasTripPlan: !!tripPlan,
      hasSegments: !!tripPlan?.segments,
      segmentCount: tripPlan?.segments?.length || 0
    });
    
    // Validate trip plan first
    if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
      console.error('❌ Invalid trip plan - no segments found');
      alert('Cannot export PDF: No trip segments found. Please create a trip plan first.');
      return;
    }

    console.log('✅ Trip plan validated, starting export process...');
    
    try {
      // Set exporting state
      setIsExporting(true);
      setWeatherLoading(true);
      
      // Set the preview trip plan immediately
      console.log('📄 Setting preview trip plan...');
      setPreviewTripPlan(tripPlan);
      
      // Add print styles
      console.log('🎨 Adding print styles...');
      addPrintStyles();
      
      // Show the preview immediately - this is the critical fix
      console.log('🔄 Setting showPreview to true...');
      setShowPreview(true);
      
      // Reset loading states after a short delay to allow UI to update
      setTimeout(() => {
        setIsExporting(false);
        setWeatherLoading(false);
        console.log('✅ PDF preview should now be visible');
        console.log('📊 Final state:', {
          showPreview: true,
          hasPreviewTripPlan: true,
          isExporting: false,
          weatherLoading: false
        });
      }, 500);
      
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
    console.log('📊 State before close:', {
      showPreview,
      hasPreviewTripPlan: !!previewTripPlan,
      isExporting,
      weatherLoading
    });
    
    // Reset all states
    setShowPreview(false);
    setPreviewTripPlan(null);
    setIsExporting(false);
    setWeatherLoading(false);
    
    // Call the onClose callback
    onClose();
    
    console.log('✅ PDF preview closed and states reset');
  }, [onClose, showPreview, previewTripPlan, isExporting, weatherLoading]);

  // Enhanced logging for debugging
  console.log('🎯 usePDFExport hook state:', {
    isExporting,
    showPreview,
    hasPreviewTripPlan: !!previewTripPlan,
    weatherLoading,
    tripPlanSegments: tripPlan?.segments?.length || 0,
    hasExportOptions: !!exportOptions
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
