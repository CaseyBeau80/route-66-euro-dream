
import { useState } from 'react';
import { TripPlan } from '../../../services/planning/TripPlanBuilder';
import { usePDFExportLogic } from './usePDFExportLogic';
import { usePDFCleanup } from './usePDFCleanup';

interface PDFExportOptions {
  format: 'full' | 'summary' | 'route-only';
  title?: string;
  watermark?: string;
  includeQRCode: boolean;
}

interface UsePDFExportProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  exportOptions: PDFExportOptions;
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
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [pdfContainer, setPdfContainer] = useState<HTMLElement | null>(null);

  const { cleanupPDFPreview } = usePDFCleanup();

  const handleClosePreview = () => {
    console.log('🔄 Closing PDF preview and cleaning up...');
    setShowPreview(false);
    cleanupPDFPreview();
    setPdfContainer(null);
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
    handleExportPDF,
    handleClosePreview
  };
};
