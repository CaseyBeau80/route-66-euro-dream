
import { TripPlan } from '../planning/TripPlanBuilder';
import { PDFExportOptions, PDFHeaderData, PDFFooterData } from './PDFTypesService';

export class PDFHeaderFooterService {
  private static instance: PDFHeaderFooterService;

  static getInstance(): PDFHeaderFooterService {
    if (!PDFHeaderFooterService.instance) {
      PDFHeaderFooterService.instance = new PDFHeaderFooterService();
    }
    return PDFHeaderFooterService.instance;
  }

  generatePDFHeader(tripPlan: TripPlan, options: PDFExportOptions): PDFHeaderData {
    const title = options.title || `Route 66 Trip: ${tripPlan.startCity} to ${tripPlan.endCity}`;
    const subtitle = `${tripPlan.totalDays} days • ${Math.round(tripPlan.totalDistance)} miles`;
    
    return {
      title,
      subtitle,
      date: new Date().toLocaleDateString()
    };
  }

  generatePDFFooter(options: PDFExportOptions, shareUrl?: string): PDFFooterData {
    return {
      text: "Generated by Ramble 66 Route Planner",
      qrCode: options.includeQRCode ? shareUrl : undefined,
      pageNumbers: options.includePageNumbers
    };
  }
}
