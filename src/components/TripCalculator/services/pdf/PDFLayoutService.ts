
import { TripPlan } from '../planning/TripPlanBuilder';

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
  date: string;
  logo?: string;
}

export interface PDFFooterData {
  pageNumbers: boolean;
  shareUrl?: string;
  qrCode?: string;
  watermark?: string;
  generatedText: string;
}

export class PDFLayoutService {
  private static instance: PDFLayoutService;

  static getInstance(): PDFLayoutService {
    if (!PDFLayoutService.instance) {
      PDFLayoutService.instance = new PDFLayoutService();
    }
    return PDFLayoutService.instance;
  }

  generatePDFHeader(tripPlan: TripPlan, options: PDFExportOptions): PDFHeaderData {
    const title = options.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`;
    const subtitle = `${tripPlan.totalDays}-day journey • ${Math.round(tripPlan.totalDistance)} miles`;
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return {
      title,
      subtitle,
      date
    };
  }

  generatePDFFooter(options: PDFExportOptions, shareUrl?: string): PDFFooterData {
    const generatedText = `Generated on ${new Date().toLocaleDateString()} from Route 66 Trip Planner`;
    
    return {
      pageNumbers: options.includePageNumbers,
      shareUrl: options.includeQRCode ? shareUrl : undefined,
      watermark: options.watermark,
      generatedText
    };
  }

  generatePDFStyles(): string {
    return `
      /* Enhanced PDF-specific print styles with improved readability and scaling */
      @media print {
        @page {
          size: A4;
          margin: 0.5in;
        }
        
        /* Hide everything by default, then show only PDF content */
        body * {
          visibility: hidden;
        }
        
        /* Show only PDF export content */
        #pdf-export-content,
        #pdf-export-content * {
          visibility: visible !important;
          display: block !important;
        }
        
        /* Comprehensive modal and overlay hiding */
        [role="dialog"],
        [role="alertdialog"],
        .dialog-overlay,
        .modal-overlay,
        .backdrop,
        [data-radix-popper-content-wrapper],
        [data-state="open"],
        .fixed,
        .absolute:not(#pdf-export-content):not(#pdf-export-content *),
        nav,
        .navbar,
        .navigation,
        .header:not(.pdf-header),
        .footer:not(.pdf-footer),
        button:not(.pdf-keep),
        .share-button,
        .export-button,
        .dropdown-menu,
        .tooltip,
        .popover,
        .toast,
        .notification,
        .overlay,
        .modal,
        .dialog,
        .sheet,
        .drawer,
        .sidebar,
        [data-interactive],
        .hover-trigger,
        .z-50,
        .z-40,
        .z-30 {
          display: none !important;
          visibility: hidden !important;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          color: #1f2937 !important;
          background: white !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-size: 14px !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* PDF Container Styling with Enhanced Scaling */
        #pdf-export-content {
          position: static !important;
          left: auto !important;
          top: auto !important;
          visibility: visible !important;
          width: 100% !important;
          max-width: none !important;
          background: white !important;
          padding: 0 !important;
          margin: 0 !important;
          transform: scale(1.0) !important;
        }

        .pdf-clean-container {
          width: 100% !important;
          max-width: none !important;
          background: white !important;
          color: #1f2937 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          padding: 0.6in !important;
          margin: 0 !important;
        }

        /* Enhanced Typography with Larger Font Sizes */
        .pdf-clean-container h1 {
          font-size: 30px !important;
          font-weight: bold !important;
          margin-bottom: 16px !important;
          color: #1f2937 !important;
          page-break-after: avoid !important;
          line-height: 1.3 !important;
        }

        .pdf-clean-container h2 {
          font-size: 22px !important;
          font-weight: 600 !important;
          margin-bottom: 12px !important;
          color: #374151 !important;
          page-break-after: avoid !important;
          line-height: 1.3 !important;
        }

        .pdf-clean-container h3 {
          font-size: 18px !important;
          font-weight: 600 !important;
          margin-bottom: 8px !important;
          color: #4b5563 !important;
          line-height: 1.4 !important;
        }

        .pdf-clean-container h4 {
          font-size: 16px !important;
          font-weight: 600 !important;
          margin-bottom: 6px !important;
          color: #4b5563 !important;
          line-height: 1.4 !important;
        }

        .pdf-clean-container h5 {
          font-size: 14px !important;
          font-weight: 600 !important;
          margin-bottom: 4px !important;
          color: #6b7280 !important;
          line-height: 1.4 !important;
        }

        .pdf-clean-container h6 {
          font-size: 13px !important;
          font-weight: 600 !important;
          margin-bottom: 4px !important;
          color: #6b7280 !important;
          line-height: 1.4 !important;
        }

        /* Grid and Layout with Better Spacing */
        .grid {
          display: grid !important;
        }

        .grid-cols-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 16px !important;
        }

        .grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 12px !important;
        }

        .grid-cols-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          gap: 10px !important;
        }

        /* Enhanced Card Styling with Better Padding */
        .pdf-clean-container .bg-gray-50 {
          background-color: #f9fafb !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          padding: 16px !important;
        }

        .pdf-clean-container .border {
          border: 1px solid #e5e7eb !important;
        }

        .pdf-clean-container .rounded,
        .pdf-clean-container .rounded-lg {
          border-radius: 8px !important;
        }

        /* Page Break Controls */
        .pdf-header,
        .pdf-overview,
        .pdf-day-segment,
        .no-page-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .page-break-before {
          page-break-before: always !important;
        }

        .page-break-after {
          page-break-after: always !important;
        }

        /* Enhanced Spacing and Margins */
        .mb-8 { margin-bottom: 32px !important; }
        .mb-6 { margin-bottom: 24px !important; }
        .mb-4 { margin-bottom: 16px !important; }
        .mb-3 { margin-bottom: 12px !important; }
        .mb-2 { margin-bottom: 8px !important; }
        .mb-1 { margin-bottom: 4px !important; }

        .mt-12 { margin-top: 48px !important; }
        .mt-8 { margin-top: 32px !important; }
        .mt-4 { margin-top: 16px !important; }
        .mt-2 { margin-top: 8px !important; }
        .mt-1 { margin-top: 4px !important; }

        .p-6 { padding: 24px !important; }
        .p-4 { padding: 16px !important; }
        .p-3 { padding: 12px !important; }
        .p-2 { padding: 8px !important; }

        .pt-4 { padding-top: 16px !important; }
        .pb-4 { padding-bottom: 16px !important; }

        /* Enhanced Text Sizing - Upgraded by one step */
        .text-4xl { font-size: 30px !important; line-height: 1.2 !important; }
        .text-3xl { font-size: 26px !important; line-height: 1.2 !important; }
        .text-2xl { font-size: 22px !important; line-height: 1.3 !important; }
        .text-xl { font-size: 20px !important; line-height: 1.3 !important; }
        .text-lg { font-size: 18px !important; line-height: 1.4 !important; }
        .text-base { font-size: 16px !important; line-height: 1.5 !important; }
        .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
        .text-xs { font-size: 12px !important; line-height: 1.3 !important; }

        /* Colors */
        .text-gray-800 { color: #1f2937 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-600 { color: #4b5563 !important; }
        .text-gray-500 { color: #6b7280 !important; }
        .text-gray-400 { color: #9ca3af !important; }
        .text-blue-600 { color: #2563eb !important; }
        .text-blue-800 { color: #1e40af !important; }
        .text-blue-700 { color: #1d4ed8 !important; }

        /* Borders */
        .border-b-2 { border-bottom: 2px solid #e5e7eb !important; }
        .border-t { border-top: 1px solid #e5e7eb !important; }
        .border-b { border-bottom: 1px solid #e5e7eb !important; }
        .border-blue-500 { border-color: #3b82f6 !important; }
        .border-gray-200 { border-color: #e5e7eb !important; }
        .border-blue-200 { border-color: #dbeafe !important; }

        /* Utility Classes */
        .text-center { text-align: center !important; }
        .font-bold { font-weight: bold !important; }
        .font-semibold { font-weight: 600 !important; }
        .font-medium { font-weight: 500 !important; }
        .break-all { word-break: break-all !important; }
        .uppercase { text-transform: uppercase !important; }
        .capitalize { text-transform: capitalize !important; }

        /* Background Colors */
        .bg-blue-50 { background-color: #eff6ff !important; }
        .bg-blue-100 { background-color: #dbeafe !important; }
        .bg-green-100 { background-color: #dcfce7 !important; }
        .bg-orange-100 { background-color: #fed7aa !important; }
        .bg-red-100 { background-color: #fee2e2 !important; }

        /* Text Colors for Badges */
        .text-blue-800 { color: #1e40af !important; }
        .text-blue-700 { color: #1d4ed8 !important; }
        .text-green-700 { color: #15803d !important; }
        .text-orange-700 { color: #c2410c !important; }
        .text-red-700 { color: #b91c1c !important; }

        /* Watermark */
        .pdf-watermark-text {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) rotate(-45deg) !important;
          font-size: 72px !important;
          color: rgba(0, 0, 0, 0.03) !important;
          z-index: -1 !important;
          pointer-events: none !important;
          font-weight: bold !important;
        }

        /* Footer */
        .pdf-footer {
          margin-top: 48px !important;
          padding-top: 16px !important;
          border-top: 1px solid #e5e7eb !important;
          text-align: center !important;
        }

        /* Force background colors and borders to print */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Ensure good text flow */
        p, li {
          orphans: 2 !important;
          widows: 2 !important;
        }

        /* Icons */
        .lucide {
          width: 16px !important;
          height: 16px !important;
          display: inline-block !important;
        }
      }

      /* Screen styles for PDF container with enhanced scaling */
      @media screen {
        #pdf-export-content {
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
          visibility: hidden !important;
        }

        /* When PDF is visible, apply scaling */
        #pdf-export-content.pdf-preview-visible {
          position: static !important;
          left: auto !important;
          top: auto !important;
          visibility: visible !important;
          transform: scale(1.1) !important;
          transform-origin: top center !important;
          width: 100% !important;
          margin: 0 auto !important;
          padding: 20px !important;
        }
      }
    `;
  }

  injectPDFStyles(): void {
    const styleId = 'pdf-export-styles';
    
    // Remove existing styles
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Inject new styles
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = this.generatePDFStyles();
    document.head.appendChild(styleElement);
  }

  removePDFStyles(): void {
    const styleElement = document.getElementById('pdf-export-styles');
    if (styleElement) {
      styleElement.remove();
    }
  }
}
