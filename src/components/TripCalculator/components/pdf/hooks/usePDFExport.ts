
import React from 'react';
import { TripPlan } from '../../../services/planning/TripPlanBuilder';
import { usePDFKeyboardHandlers } from './usePDFKeyboardHandlers';
import { usePDFCleanup } from './usePDFCleanup';
import { usePDFExportState } from './usePDFExportState';
import { usePDFExportLogic } from './usePDFExportLogic';

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
    setShowPreview(false);
    cleanupPDFPreview();
  };

  // Use keyboard handlers
  usePDFKeyboardHandlers({
    showPreview,
    onClosePreview: handleClosePreview
  });

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
