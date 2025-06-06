
import { TripPlan } from '../planning/TripPlanBuilder';
import { PDFExportOptions, PDFHeaderData, PDFFooterData } from './PDFTypesService';
import { PDFHeaderFooterService } from './PDFHeaderFooterService';
import { PDFStylesService } from './PDFStylesService';

export class PDFLayoutService {
  private static instance: PDFLayoutService;
  private headerFooterService: PDFHeaderFooterService;
  private stylesService: PDFStylesService;

  constructor() {
    this.headerFooterService = PDFHeaderFooterService.getInstance();
    this.stylesService = PDFStylesService.getInstance();
  }

  static getInstance(): PDFLayoutService {
    if (!PDFLayoutService.instance) {
      PDFLayoutService.instance = new PDFLayoutService();
    }
    return PDFLayoutService.instance;
  }

  generatePDFHeader(tripPlan: TripPlan, options: PDFExportOptions): PDFHeaderData {
    return this.headerFooterService.generatePDFHeader(tripPlan, options);
  }

  generatePDFFooter(options: PDFExportOptions, shareUrl?: string): PDFFooterData {
    return this.headerFooterService.generatePDFFooter(options, shareUrl);
  }

  generatePDFStyles(): string {
    return this.stylesService.generatePDFStyles();
  }

  injectPDFStyles(): void {
    this.stylesService.injectPDFStyles();
  }

  removePDFStyles(): void {
    this.stylesService.removePDFStyles();
  }
}

// Re-export types for backward compatibility
export { PDFExportOptions, PDFHeaderData, PDFFooterData } from './PDFTypesService';
