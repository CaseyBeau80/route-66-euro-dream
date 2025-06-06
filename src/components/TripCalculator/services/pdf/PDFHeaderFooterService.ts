
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
}
