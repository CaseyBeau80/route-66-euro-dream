
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
      
      // Set the preview trip plan immediately
      console.log('📄 Setting preview trip plan...');
      setPreviewTripPlan(tripPlan);
      
      // Add print styles
      console.log('🎨 Adding print styles...');
      addPrintStyles();
      
      // Show the preview immediately
      console.log('🔄 Setting showPreview to true...');
      setShowPreview(true);
      
      // Reset exporting state after a short delay to allow UI to update
      setTimeout(() => {
        setIsExporting(false);
        console.log('✅ PDF preview should now be visible');
        console.log('📊 Final state:', {
          showPreview: true,
          hasPreviewTripPlan: true,
          isExporting: false
        });
      }, 100);
      
    } catch (error) {
      console.error('❌ Error during PDF export:', error);
      setIsExporting(false);
      alert('An error occurred while preparing the PDF preview. Please try again.');
    }
    
  }, [tripPlan, addPrintStyles]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 Closing PDF preview...');
    console.log('📊 State before close:', {
      showPreview,
      hasPreviewTripPlan: !!previewTripPlan,
      isExporting
    });
    
    setShowPreview(false);
    setPreviewTripPlan(null);
    setIsExporting(false);
    onClose();
    
    console.log('✅ PDF preview closed');
  }, [onClose, showPreview, previewTripPlan, isExporting]);

  // Enhanced logging for debugging
  console.log('🎯 usePDFExport hook state:', {
    isExporting,
    showPreview,
    hasPreviewTripPlan: !!previewTripPlan,
    tripPlanSegments: tripPlan?.segments?.length || 0,
    hasExportOptions: !!exportOptions
  });

  return {
    isExporting,
    showPreview,
    weatherLoading: false, // Simplified - no weather loading for now
    weatherLoadingStatus: '',
    weatherLoadingProgress: 0,
    weatherTimeout: false,
    previewTripPlan,
    handleExportPDF,
    handleClosePreview
  };
};
