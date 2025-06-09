
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
    console.log('🚀 PDF Export: Button clicked, starting export process...');
    
    // Validate trip plan first
    if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
      console.error('❌ Invalid trip plan - no segments found');
      alert('Cannot export PDF: No trip segments found. Please create a trip plan first.');
      return;
    }

    console.log('✅ Trip plan validated, showing preview...');
    
    // Set the preview trip plan and show preview immediately
    setPreviewTripPlan(tripPlan);
    setIsExporting(true);
    
    // Add print styles for the preview
    addPrintStyles();
    
    // Show the preview
    setShowPreview(true);
    
    // Reset exporting state after a short delay
    setTimeout(() => {
      setIsExporting(false);
      console.log('✅ PDF preview should now be visible');
    }, 100);
    
  }, [tripPlan, addPrintStyles]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 Closing PDF preview...');
    setShowPreview(false);
    setPreviewTripPlan(null);
    setIsExporting(false);
    onClose();
  }, [onClose]);

  console.log('🎯 usePDFExport state:', {
    isExporting,
    showPreview,
    hasPreviewTripPlan: !!previewTripPlan,
    tripPlanSegments: tripPlan?.segments?.length || 0
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
