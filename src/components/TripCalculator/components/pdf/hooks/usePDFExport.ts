
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
  const [weatherLoadingStatus, setWeatherLoadingStatus] = useState<string>('');
  const [weatherLoadingProgress, setWeatherLoadingProgress] = useState(0);
  const [weatherTimeout, setWeatherTimeout] = useState(false);
  
  const { addPrintStyles } = usePDFStyles();

  const handleExportPDF = useCallback(async () => {
    console.log('🚀 PDF Export: Starting simplified export process...');
    
    // Validate trip plan first
    if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
      console.error('❌ Invalid trip plan - no segments found');
      alert('Cannot export PDF: No trip segments found. Please create a trip plan first.');
      return;
    }

    console.log('✅ Trip plan validated, showing preview immediately...');
    
    // SIMPLIFIED APPROACH: Show preview immediately with current trip plan
    setIsExporting(true);
    
    // Set preview data and show it immediately
    setPreviewTripPlan(tripPlan);
    addPrintStyles();
    setShowPreview(true);
    
    // Set exporting to false after preview is shown
    setTimeout(() => {
      setIsExporting(false);
      console.log('✅ PDF preview is now visible');
    }, 500);
    
  }, [tripPlan, addPrintStyles]);

  const handleClosePreview = useCallback(() => {
    console.log('🔄 Closing PDF preview...');
    setShowPreview(false);
    setPreviewTripPlan(null);
    setWeatherLoadingStatus('');
    setWeatherLoadingProgress(0);
    setWeatherTimeout(false);
    setWeatherLoading(false);
    onClose();
  }, [onClose]);

  console.log('🎯 usePDFExport state:', {
    isExporting,
    showPreview,
    weatherLoading,
    hasPreviewTripPlan: !!previewTripPlan,
    tripPlanSegments: tripPlan?.segments?.length || 0
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
