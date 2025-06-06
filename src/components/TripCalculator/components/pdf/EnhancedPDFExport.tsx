
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Settings } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { usePDFExportOptions } from '../../hooks/usePDFExportOptions';
import { PDFLayoutService } from '../../services/pdf/PDFLayoutService';
import { PDFThemingService } from '../../services/pdf/PDFThemingService';
import PDFItineraryView from './PDFItineraryView';

interface EnhancedPDFExportProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
}

const EnhancedPDFExport: React.FC<EnhancedPDFExportProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { exportOptions, updateExportOption } = usePDFExportOptions();

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      const layoutService = PDFLayoutService.getInstance();
      const themingService = PDFThemingService.getInstance();
      
      // Apply PDF styles and theme
      layoutService.injectPDFStyles();
      themingService.applyThemeToPDF(themingService.getRoute66Theme());
      
      // Generate header and footer data
      const headerData = layoutService.generatePDFHeader(tripPlan, exportOptions);
      const footerData = layoutService.generatePDFFooter(exportOptions, shareUrl);
      
      // Create PDF-specific content container
      const pdfContainer = document.createElement('div');
      pdfContainer.className = 'pdf-export-container';
      
      // Add header if enabled
      if (exportOptions.includeHeader) {
        const header = document.createElement('div');
        header.className = 'pdf-header';
        header.innerHTML = `
          <div style="display: flex; justify-content: between; align-items: center;">
            <div>
              <h1 style="font-size: 1.25rem; font-weight: bold; color: #1d4ed8; margin: 0;">${headerData.title}</h1>
              <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">${headerData.subtitle}</p>
            </div>
            <div style="text-align: right; font-size: 0.75rem; color: #6b7280;">
              Generated ${headerData.date}
            </div>
          </div>
        `;
        pdfContainer.appendChild(header);
      }
      
      // Add main content
      const contentDiv = document.createElement('div');
      contentDiv.className = 'pdf-content';
      
      // Render the PDF itinerary view into the content div
      const segments = tripPlan.segments || tripPlan.dailySegments || [];
      
      // This is a simplified approach - in a real implementation, you'd want to use
      // a more sophisticated PDF generation library like jsPDF or Puppeteer
      contentDiv.innerHTML = `
        <div class="pdf-itinerary-container">
          <div class="pdf-tab-headers">
            <div class="pdf-tab-header active">📍 Route & Stops</div>
            ${exportOptions.format === 'full' ? '<div class="pdf-tab-header">🌤️ Weather Forecast</div>' : ''}
          </div>
          <div class="pdf-two-column-layout">
            <div class="pdf-column-left">
              <!-- Route content would be rendered here -->
            </div>
            ${exportOptions.format === 'full' ? '<div class="pdf-column-right"><!-- Weather content --></div>' : ''}
          </div>
        </div>
      `;
      
      pdfContainer.appendChild(contentDiv);
      
      // Add footer if enabled
      if (exportOptions.includeFooter) {
        const footer = document.createElement('div');
        footer.className = 'pdf-footer';
        footer.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>${footerData.generatedText}</span>
            ${footerData.pageNumbers ? '<span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>' : ''}
          </div>
        `;
        pdfContainer.appendChild(footer);
      }
      
      // Add watermark if specified
      if (exportOptions.watermark) {
        const watermark = document.createElement('div');
        watermark.className = 'pdf-watermark';
        watermark.textContent = exportOptions.watermark;
        pdfContainer.appendChild(watermark);
      }
      
      // Trigger browser print dialog
      document.body.appendChild(pdfContainer);
      window.print();
      document.body.removeChild(pdfContainer);
      
      // Cleanup
      layoutService.removePDFStyles();
      themingService.removeThemeStyles();
      
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            PDF Export Options
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Export Format */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select 
              value={exportOptions.format} 
              onValueChange={(value: 'full' | 'summary' | 'route-only') => 
                updateExportOption('format', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Details (Route + Weather)</SelectItem>
                <SelectItem value="summary">Summary (Route + Key Stops)</SelectItem>
                <SelectItem value="route-only">Route Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Title */}
          <div className="space-y-2">
            <Label>Custom Title (Optional)</Label>
            <Input
              placeholder="My Route 66 Adventure"
              value={exportOptions.title || ''}
              onChange={(e) => updateExportOption('title', e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeHeader"
                checked={exportOptions.includeHeader}
                onCheckedChange={(checked) => updateExportOption('includeHeader', !!checked)}
              />
              <Label htmlFor="includeHeader">Include Header</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeFooter"
                checked={exportOptions.includeFooter}
                onCheckedChange={(checked) => updateExportOption('includeFooter', !!checked)}
              />
              <Label htmlFor="includeFooter">Include Footer</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includePageNumbers"
                checked={exportOptions.includePageNumbers}
                onCheckedChange={(checked) => updateExportOption('includePageNumbers', !!checked)}
              />
              <Label htmlFor="includePageNumbers">Page Numbers</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeQRCode"
                checked={exportOptions.includeQRCode}
                onCheckedChange={(checked) => updateExportOption('includeQRCode', !!checked)}
              />
              <Label htmlFor="includeQRCode">QR Code to Live Version</Label>
            </div>
          </div>

          {/* Watermark */}
          <div className="space-y-2">
            <Label>Watermark (Optional)</Label>
            <Input
              placeholder="DRAFT, CONFIDENTIAL, etc."
              value={exportOptions.watermark || ''}
              onChange={(e) => updateExportOption('watermark', e.target.value)}
            />
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? 'Generating PDF...' : 'Export PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPDFExport;
