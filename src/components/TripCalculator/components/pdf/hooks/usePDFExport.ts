
import { useState } from 'react';
import { TripPlan } from '../../../services/planning/TripPlanBuilder';
import { usePDFExportLogic } from './usePDFExportLogic';
import { usePDFExportState } from './usePDFExportState';
import { usePDFCleanup } from './usePDFCleanup';

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
  const {
    isExporting,
    setIsExporting,
    showPreview,
    setShowPreview,
    weatherLoading,
    setWeatherLoading,
    pdfContainer,
    setPdfContainer
  } = usePDFExportState();

  const { cleanupPDFPreview } = usePDFCleanup();

  const handleClosePreview = () => {
    console.log('🧹 Closing PDF preview and cleaning up...');
    cleanupPDFPreview();
    setShowPreview(false);
    setPdfContainer(null);
    
    // Clean up PDF container
    const container = document.getElementById('pdf-export-content');
    if (container) {
      container.remove();
    }
    
    onClose();
  };

  const { handleExportPDF } = usePDFExportLogic({
    tripPlan,
    tripStartDate,
    shareUrl,
    exportOptions,
    onClose,
    setIsExporting,
    setWeatherLoading,
    setShowPreview,
    showPreview,
    handleClosePreview,
    setPdfContainer
  });

  return {
    isExporting,
    showPreview,
    weatherLoading,
    pdfContainer,
    handleClosePreview,
    handleExportPDF
  };
};
