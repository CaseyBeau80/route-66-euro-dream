
import { useState } from 'react';
import { TripPlan } from '../../../services/planning/TripPlanBuilder';
import { usePDFContainer } from './usePDFContainer';

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
  const [weatherLoading, setWeatherLoading] = useState(false);

  const { createPDFContainer } = usePDFContainer();

  const handleExportPDF = async () => {
    console.log('📄 Starting PDF export process...');
    setIsExporting(true);
    setWeatherLoading(true);

    try {
      const pdfContainer = await createPDFContainer({
        tripPlan,
        tripStartDate,
        exportOptions,
        shareUrl
      });

      console.log('📄 PDF container created, opening preview...');
      setShowPreview(true);
      setWeatherLoading(false);

      // Open print dialog after a short delay
      setTimeout(() => {
        window.print();
      }, 1000);

    } catch (error) {
      console.error('❌ Error creating PDF:', error);
    } finally {
      setIsExporting(false);
      setWeatherLoading(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    onClose();
  };

  return {
    isExporting,
    showPreview,
    weatherLoading,
    handleClosePreview,
    handleExportPDF
  };
};
