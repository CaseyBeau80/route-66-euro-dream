
export interface PDFExportOptions {
  format: 'full' | 'summary' | 'route-only';
  includeWeather: boolean;
  includeHeader: boolean;
  includeFooter: boolean;
  includePageNumbers: boolean;
  includeQRCode: boolean;
  watermark?: string;
  title?: string;
  userNote?: string;
}

export interface PDFHeaderData {
  title: string;
  subtitle?: string;
  date?: string;
}

export interface PDFFooterData {
  text: string;
  qrCode?: string;
  pageNumbers: boolean;
}
