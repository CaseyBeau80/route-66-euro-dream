
import { useState } from 'react';
import { PDFExportOptions } from '../services/pdf/PDFLayoutService';

export const usePDFExportOptions = () => {
  const [exportOptions, setExportOptions] = useState<PDFExportOptions>({
    format: 'full',
    includeWeather: true,
    includeHeader: true,
    includeFooter: true,
    includePageNumbers: true,
    includeQRCode: false,
    watermark: undefined,
    title: undefined,
    userNote: undefined
  });

  const updateExportOption = <K extends keyof PDFExportOptions>(
    key: K,
    value: PDFExportOptions[K]
  ) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefaults = () => {
    setExportOptions({
      format: 'full',
      includeWeather: true,
      includeHeader: true,
      includeFooter: true,
      includePageNumbers: true,
      includeQRCode: false,
      watermark: undefined,
      title: undefined,
      userNote: undefined
    });
  };

  return {
    exportOptions,
    updateExportOption,
    resetToDefaults,
    setExportOptions
  };
};
