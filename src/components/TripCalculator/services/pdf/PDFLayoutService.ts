
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
          margin: 0.5in;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #1f2937;
          background: white !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* Hide non-print elements */
        .navbar, .header, .footer, .navigation, 
        button:not(.pdf-keep), .tooltip, .dropdown,
        .share-button, .export-button, .interactive,
        [data-interactive], .hover-trigger {
          display: none !important;
        }

        /* PDF Container Styling */
        .pdf-itinerary-container {
          width: 100% !important;
          max-width: none !important;
          background: #f9fafb !important;
          padding: 1rem !important;
          margin: 0 !important;
        }

        .pdf-itinerary-container > div {
          background: white !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          padding: 1.5rem !important;
        }

        /* Page Break Controls */
        .no-page-break,
        .pdf-day-segment,
        .pdf-weather-card,
        .pdf-legend {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .page-break-before {
          page-break-before: always !important;
        }

        .page-break-after {
          page-break-after: always !important;
        }

        /* Tab Headers Styling */
        .pdf-tab-headers {
          display: flex !important;
          border-bottom: 2px solid #e5e7eb !important;
          margin-bottom: 1.5rem !important;
          page-break-after: avoid !important;
        }

        .pdf-tab-header.active {
          background-color: #eff6ff !important;
          border-top: 2px solid #3b82f6 !important;
          color: #1d4ed8 !important;
          border-radius: 8px 8px 0 0 !important;
          font-weight: 500 !important;
        }

        /* Day Segment Cards */
        .pdf-day-segment {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
          margin-bottom: 1.5rem !important;
          padding: 1rem !important;
        }

        /* Weather Cards */
        .pdf-weather-card {
          background-color: #eff6ff !important;
          border: 1px solid #93c5fd !important;
          border-radius: 6px !important;
          margin-top: 0.75rem !important;
          padding: 0.75rem !important;
        }

        /* Section Headers */
        .pdf-section-header {
          font-size: 0.875rem !important;
          font-weight: 600 !important;
          color: #1e40af !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          margin-bottom: 0.5rem !important;
        }

        /* Badges */
        .pdf-day-badge {
          background-color: #dbeafe !important;
          color: #1d4ed8 !important;
          font-size: 0.75rem !important;
          font-weight: 500 !important;
          padding: 0.25rem 0.5rem !important;
          border-radius: 0.25rem !important;
        }

        /* Legend */
        .pdf-legend {
          margin-top: 2rem !important;
          padding: 1rem !important;
          background-color: #f9fafb !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 6px !important;
          page-break-inside: avoid !important;
        }

        /* Header */
        .pdf-header {
          background: white !important;
          border-bottom: 2px solid #3b82f6 !important;
          padding: 1rem !important;
          margin-bottom: 1rem !important;
          border-radius: 8px 8px 0 0 !important;
          page-break-after: avoid !important;
        }

        /* Watermark */
        .pdf-watermark {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) rotate(-45deg) !important;
          font-size: 4rem !important;
          color: rgba(0, 0, 0, 0.03) !important;
          z-index: -1 !important;
          pointer-events: none !important;
          font-weight: bold !important;
        }

        /* Text and spacing adjustments for print */
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid !important;
        }

        p, li {
          orphans: 3 !important;
          widows: 3 !important;
        }

        /* Force background colors to print */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
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
