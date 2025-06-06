
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
      /* PDF-specific print styles */
      @media print {
        @page {
          size: A4;
          margin: 0.4in;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.3;
          color: #1f2937;
          background: white !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-size: 12px;
        }

        /* Hide non-print elements */
        .navbar, .header, .footer, .navigation, 
        button:not(.pdf-keep), .tooltip, .dropdown,
        .share-button, .export-button, .interactive,
        [data-interactive], .hover-trigger,
        [role="dialog"], .dialog-overlay {
          display: none !important;
        }

        /* PDF Container Styling */
        .pdf-export-container,
        .trip-content,
        [data-trip-content] {
          width: 100% !important;
          max-width: none !important;
          background: white !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        /* Card styling for PDF */
        .pdf-export-container .card,
        .trip-content .card,
        [data-trip-content] .card {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 6px !important;
          box-shadow: none !important;
          margin-bottom: 1rem !important;
          page-break-inside: avoid !important;
        }

        /* Card headers and content */
        .pdf-export-container .card-header,
        .trip-content .card-header,
        [data-trip-content] .card-header {
          padding: 0.75rem !important;
          border-bottom: 1px solid #e5e7eb !important;
          background: #f9fafb !important;
        }

        .pdf-export-container .card-content,
        .trip-content .card-content,
        [data-trip-content] .card-content {
          padding: 0.75rem !important;
        }

        /* Grid layouts */
        .grid {
          display: grid !important;
          gap: 0.5rem !important;
        }

        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }

        /* Typography improvements */
        h1, h2, h3 {
          font-size: 1.2rem !important;
          font-weight: 600 !important;
          margin-bottom: 0.5rem !important;
          page-break-after: avoid !important;
        }

        h4, h5, h6 {
          font-size: 1rem !important;
          font-weight: 500 !important;
          margin-bottom: 0.3rem !important;
        }

        /* Text sizing */
        .text-2xl { font-size: 1.3rem !important; }
        .text-xl { font-size: 1.2rem !important; }
        .text-lg { font-size: 1.1rem !important; }
        .text-base { font-size: 1rem !important; }
        .text-sm { font-size: 0.9rem !important; }
        .text-xs { font-size: 0.8rem !important; }

        /* Page Break Controls */
        .no-page-break,
        .pdf-day-segment,
        .pdf-weather-card,
        .pdf-legend,
        .card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .page-break-before {
          page-break-before: always !important;
        }

        .page-break-after {
          page-break-after: always !important;
        }

        /* Day Segment Cards - Improved */
        .pdf-day-segment {
          background: white !important;
          border: 1px solid #d1d5db !important;
          border-radius: 4px !important;
          margin-bottom: 0.75rem !important;
          padding: 0.75rem !important;
          box-shadow: none !important;
        }

        /* Weather Cards - Improved */
        .pdf-weather-card {
          background-color: #f0f9ff !important;
          border: 1px solid #bae6fd !important;
          border-radius: 4px !important;
          margin-top: 0.5rem !important;
          padding: 0.5rem !important;
        }

        /* Badges and Pills */
        .pdf-day-badge,
        .badge {
          background-color: #e0e7ff !important;
          color: #3730a3 !important;
          font-size: 0.75rem !important;
          font-weight: 500 !important;
          padding: 0.2rem 0.4rem !important;
          border-radius: 0.25rem !important;
          display: inline-block !important;
        }

        /* Spacing improvements */
        .space-y-6 > * + * { margin-top: 1rem !important; }
        .space-y-4 > * + * { margin-top: 0.75rem !important; }
        .space-y-3 > * + * { margin-top: 0.5rem !important; }
        .space-y-2 > * + * { margin-top: 0.3rem !important; }

        .gap-4 { gap: 0.75rem !important; }
        .gap-3 { gap: 0.5rem !important; }
        .gap-2 { gap: 0.3rem !important; }

        /* Padding improvements */
        .p-6 { padding: 1rem !important; }
        .p-4 { padding: 0.75rem !important; }
        .p-3 { padding: 0.5rem !important; }
        .p-2 { padding: 0.3rem !important; }

        .px-4 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
        .py-3 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }

        /* Margin improvements */
        .mb-6 { margin-bottom: 1rem !important; }
        .mb-4 { margin-bottom: 0.75rem !important; }
        .mb-3 { margin-bottom: 0.5rem !important; }
        .mb-2 { margin-bottom: 0.3rem !important; }

        /* Legend styling */
        .pdf-legend {
          margin-top: 1rem !important;
          padding: 0.75rem !important;
          background-color: #f9fafb !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 4px !important;
          page-break-inside: avoid !important;
          font-size: 0.8rem !important;
        }

        /* Watermark */
        .pdf-watermark {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) rotate(-45deg) !important;
          font-size: 3rem !important;
          color: rgba(0, 0, 0, 0.02) !important;
          z-index: -1 !important;
          pointer-events: none !important;
          font-weight: bold !important;
        }

        /* Footer with page numbers */
        .pdf-footer {
          position: fixed !important;
          bottom: 0.3in !important;
          left: 0 !important;
          right: 0 !important;
          text-align: center !important;
          font-size: 0.7rem !important;
          color: #6b7280 !important;
          border-top: 1px solid #e5e7eb !important;
          padding-top: 0.2rem !important;
          background: white !important;
        }

        /* Force background colors and borders to print */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Ensure text doesn't break awkwardly */
        p, li {
          orphans: 2 !important;
          widows: 2 !important;
        }

        /* Icons sizing */
        .lucide {
          width: 1rem !important;
          height: 1rem !important;
        }

        /* Remove absolute positioning for print */
        .absolute {
          position: static !important;
        }

        /* Weather icons and data */
        .weather-icon {
          display: inline-block !important;
          width: 1.2rem !important;
          height: 1.2rem !important;
          margin-right: 0.3rem !important;
        }
      }

      /* Screen styles for preview */
      @media screen {
        .pdf-export-container {
          background: #f9fafb;
          min-height: 100vh;
          padding: 1rem;
        }
        
        .pdf-export-container > div {
          max-width: 4xl;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
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
