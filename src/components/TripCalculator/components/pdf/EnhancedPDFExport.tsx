
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
      
      // Get the main itinerary view
      const itineraryContainer = document.querySelector('.pdf-itinerary-container');
      if (itineraryContainer) {
        // Create a clean clone for PDF
        const pdfClone = itineraryContainer.cloneNode(true) as HTMLElement;
        
        // Remove any interactive elements
        const interactiveElements = pdfClone.querySelectorAll('button, .hover-trigger, .tooltip, [data-interactive]');
        interactiveElements.forEach(el => el.remove());
        
        // Apply PDF-specific classes
        pdfClone.classList.add('pdf-export-container');
        
        // Add header if enabled
        if (exportOptions.includeHeader) {
          const headerData = layoutService.generatePDFHeader(tripPlan, exportOptions);
          const header = document.createElement('div');
          header.className = 'pdf-header no-page-break';
          header.innerHTML = `
            <div class="flex justify-between items-center p-4">
              <div>
                <h1 class="text-xl font-bold text-blue-800 mb-1">${headerData.title}</h1>
                <p class="text-sm text-gray-600">${headerData.subtitle}</p>
              </div>
              <div class="text-xs text-gray-500">Generated ${headerData.date}</div>
            </div>
          `;
          pdfClone.insertBefore(header, pdfClone.firstChild);
        }
        
        // Add watermark if specified
        if (exportOptions.watermark) {
          const watermark = document.createElement('div');
          watermark.className = 'pdf-watermark';
          watermark.textContent = exportOptions.watermark;
          pdfClone.appendChild(watermark);
        }
        
        // Temporarily add to DOM for printing
        document.body.appendChild(pdfClone);
        
        // Trigger browser print dialog
        window.print();
        
        // Clean up
        document.body.removeChild(pdfClone);
      }
      
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
