
import { useState } from 'react';

export const usePDFExportState = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);

  return {
    isExporting,
    setIsExporting,
    showPreview,
    setShowPreview,
    weatherLoading,
    setWeatherLoading
  };
};
