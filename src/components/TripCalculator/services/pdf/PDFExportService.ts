
import { TripPlan } from '../planning/TripPlanBuilder';
import { PDFLayoutService, PDFExportOptions } from './PDFLayoutService';
import { PDFThemingService } from './PDFThemingService';
import { PDFRoute66ThemingService } from './PDFRoute66ThemingService';
import { PDFDataIntegrityService } from './PDFDataIntegrityService';

export interface ExportOptions {
  format: 'summary' | 'full';
  includeWeather: boolean;
  includeQRCode: boolean;
  title: string;
  watermark: string;
}

export class PDFExportService {
  private static layoutService = PDFLayoutService.getInstance();
  private static themingService = PDFThemingService.getInstance();

  static async exportTripToPDF(
    tripPlan: TripPlan, 
    tripStartDate?: Date, 
    shareUrl?: string | null, 
    exportOptions?: ExportOptions
  ): Promise<void> {
    console.log('🔄 PDFExportService: Starting PDF export process');
    
    try {
      // Apply Route 66 theming
      const theme = PDFRoute66ThemingService.colors;
      
      // Generate data integrity report
      const integrityReport = PDFDataIntegrityService.generateIntegrityReport(tripPlan);
      console.log('📊 Data integrity report:', integrityReport);
      
      // Convert export options to PDF export options
      const pdfOptions: PDFExportOptions = {
        format: exportOptions?.format === 'summary' ? 'summary' : 'full',
        includeWeather: exportOptions?.includeWeather ?? true,
        includeHeader: true,
        includeFooter: true,
        includePageNumbers: true,
        includeQRCode: exportOptions?.includeQRCode ?? true,
        watermark: exportOptions?.watermark,
        title: exportOptions?.title,
        userNote: undefined
      };

      // Apply PDF styles
      this.layoutService.injectPDFStyles();
      
      // Create a temporary container for PDF content
      const tempContainer = document.createElement('div');
      tempContainer.className = 'pdf-export-container';
      tempContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: white;
        z-index: 9999;
        overflow: auto;
        padding: 20px;
      `;
      
      // Generate PDF header and footer
      const headerData = this.layoutService.generatePDFHeader(tripPlan, pdfOptions);
      const footerData = this.layoutService.generatePDFFooter(pdfOptions, shareUrl || undefined);
      
      // Create PDF content structure
      tempContainer.innerHTML = `
        <div class="pdf-document">
          <div class="pdf-header">
            <h1>${headerData.title}</h1>
            <p>${headerData.subtitle}</p>
            <p>Generated on: ${headerData.date}</p>
          </div>
          
          <div class="pdf-content">
            <div class="trip-overview">
              <h2>Trip Overview</h2>
              <p>Route: ${tripPlan.startCity} to ${tripPlan.endCity}</p>
              <p>Duration: ${tripPlan.totalDays} days</p>
              <p>Total Distance: ${Math.round(tripPlan.totalDistance)} miles</p>
              <p>Driving Time: ${Math.round(tripPlan.totalDrivingTime)} hours</p>
            </div>
            
            ${pdfOptions.format === 'full' ? this.generateFullItinerary(tripPlan) : this.generateSummaryItinerary(tripPlan)}
          </div>
          
          <div class="pdf-footer">
            <p>${footerData.text}</p>
            ${footerData.qrCode ? `<p>Share URL: ${footerData.qrCode}</p>` : ''}
          </div>
        </div>
      `;
      
      document.body.appendChild(tempContainer);
      
      // Use browser's print functionality to generate PDF
      window.print();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(tempContainer);
        this.layoutService.removePDFStyles();
      }, 1000);
      
      console.log('✅ PDFExportService: PDF export completed successfully');
      
    } catch (error) {
      console.error('❌ PDFExportService: PDF export failed:', error);
      this.layoutService.removePDFStyles();
      throw error;
    }
  }

  static async printTrip(
    tripPlan: TripPlan, 
    tripStartDate?: Date, 
    shareUrl?: string | null, 
    exportOptions?: ExportOptions
  ): Promise<void> {
    console.log('🔄 PDFExportService: Starting print process');
    
    try {
      // Use the same export process but trigger print dialog
      await this.exportTripToPDF(tripPlan, tripStartDate, shareUrl, exportOptions);
      console.log('✅ PDFExportService: Print process completed');
    } catch (error) {
      console.error('❌ PDFExportService: Print process failed:', error);
      throw error;
    }
  }

  private static generateFullItinerary(tripPlan: TripPlan): string {
    return tripPlan.segments.map((segment, index) => `
      <div class="day-segment">
        <h3>Day ${index + 1}: ${segment.startCity} to ${segment.endCity}</h3>
        <p>Distance: ${Math.round(segment.distance)} miles</p>
        <p>Driving Time: ${Math.round(segment.driveTimeHours)} hours</p>
        ${segment.recommendedStops ? `
          <div class="recommended-stops">
            <h4>Recommended Stops:</h4>
            <ul>
              ${segment.recommendedStops.map(stop => `<li>${stop.name} - ${stop.description}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${segment.weather ? `
          <div class="weather-info">
            <h4>Weather:</h4>
            <p>Temperature: ${segment.weather.temperature}°F</p>
            <p>Conditions: ${segment.weather.description}</p>
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  private static generateSummaryItinerary(tripPlan: TripPlan): string {
    return `
      <div class="summary-itinerary">
        <h2>Trip Summary</h2>
        <ul>
          ${tripPlan.segments.map((segment, index) => `
            <li>Day ${index + 1}: ${segment.startCity} → ${segment.endCity} (${Math.round(segment.distance)} miles)</li>
          `).join('')}
        </ul>
      </div>
    `;
  }
}
