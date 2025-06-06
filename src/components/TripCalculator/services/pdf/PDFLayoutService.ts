
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
          margin: 0.75in;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #1f2937;
        }

        .pdf-itinerary-container {
          width: 100%;
        }

        .pdf-two-column-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 1rem;
          page-break-inside: avoid;
        }

        .pdf-column-left,
        .pdf-column-right {
          break-inside: auto;
        }

        .pdf-tab-headers {
          display: flex;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 1rem;
          page-break-after: avoid;
        }

        .pdf-tab-header {
          padding: 0.5rem 1rem;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .pdf-tab-header.active {
          background-color: #eff6ff;
          border-top: 2px solid #3b82f6;
          color: #1d4ed8;
        }

        .pdf-section-header {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1e40af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .pdf-day-card,
        .pdf-weather-card {
          break-inside: avoid;
          margin-bottom: 0.75rem;
        }

        .pdf-day-badge {
          background-color: #dbeafe;
          color: #1d4ed8;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .pdf-legend {
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          page-break-inside: avoid;
        }

        /* Header and Footer */
        .pdf-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: white;
          border-bottom: 2px solid #3b82f6;
          padding: 0.75rem;
          z-index: 1000;
        }

        .pdf-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: white;
          border-top: 1px solid #e5e7eb;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          color: #6b7280;
          z-index: 1000;
        }

        .pdf-content {
          margin-top: 80px;
          margin-bottom: 60px;
        }

        /* Page break controls */
        .page-break-before {
          page-break-before: always;
        }

        .page-break-after {
          page-break-after: always;
        }

        .no-page-break {
          page-break-inside: avoid;
        }

        /* Watermark */
        .pdf-watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 3rem;
          color: rgba(0, 0, 0, 0.05);
          z-index: -1;
          pointer-events: none;
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
