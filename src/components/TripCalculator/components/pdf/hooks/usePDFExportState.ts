
import { useState } from 'react';

export const usePDFExportState = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [pdfContainer, setPdfContainer] = useState<HTMLElement | null>(null);

  console.log('📄 usePDFExportState:', {
    isExporting,
    showPreview,
    weatherLoading,
    hasPdfContainer: !!pdfContainer
  });

  return {
    isExporting,
    setIsExporting,
    showPreview,
    setShowPreview,
    weatherLoading,
    setWeatherLoading,
    pdfContainer,
    setPdfContainer
  };
};
