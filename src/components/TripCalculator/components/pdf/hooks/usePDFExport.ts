
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
    setWeatherLoading
  } = usePDFExportState();

  const { cleanupPDFPreview } = usePDFCleanup();

  const handleClosePreview = () => {
    console.log('🧹 Closing PDF preview and cleaning up...');
    cleanupPDFPreview();
    setShowPreview(false);
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
    handleClosePreview
  });

  return {
    isExporting,
    showPreview,
    weatherLoading,
    handleClosePreview,
    handleExportPDF
  };
};
