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
import { toast } from '@/hooks/use-toast';

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
    console.log('🖨️ Starting PDF export...');
    setIsExporting(true);
    
    try {
      const layoutService = PDFLayoutService.getInstance();
      const themingService = PDFThemingService.getInstance();
      
      // Apply PDF styles and theme
      layoutService.injectPDFStyles();
      themingService.applyThemeToPDF(themingService.getRoute66Theme());
      
      // Find the main trip content - look for various possible containers
      let contentContainer = document.querySelector('.trip-itinerary-container') ||
                            document.querySelector('[data-trip-content]') ||
                            document.querySelector('.space-y-6') ||
                            document.querySelector('.enhanced-trip-results') ||
                            document.querySelector('main') ||
                            document.body;
      
      console.log('🔍 Found content container:', contentContainer?.className || 'body fallback');
      
      if (contentContainer) {
        // Create a clean clone for PDF
        const pdfClone = contentContainer.cloneNode(true) as HTMLElement;
        
        // Remove any interactive elements that shouldn't print
        const interactiveElements = pdfClone.querySelectorAll(`
          button:not(.pdf-keep), 
          .hover-trigger, 
          .tooltip, 
          [data-interactive],
          .dropdown-menu,
          .share-button,
          .export-button,
          nav,
          .navigation,
          .navbar,
          .header:not(.pdf-header),
          .footer:not(.pdf-footer)
        `);
        
        console.log('🧹 Removing', interactiveElements.length, 'interactive elements for PDF');
        interactiveElements.forEach(el => el.remove());
        
        // Apply PDF-specific classes and styling
        pdfClone.classList.add('pdf-export-container');
        pdfClone.style.background = 'white';
        pdfClone.style.color = 'black';
        pdfClone.style.fontFamily = 'Arial, sans-serif';
        
        // Add custom title if specified
        if (exportOptions.title) {
          const titleElement = document.createElement('h1');
          titleElement.textContent = exportOptions.title;
          titleElement.style.cssText = `
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
            color: #1f2937;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
          `;
          pdfClone.insertBefore(titleElement, pdfClone.firstChild);
        }
        
        // Add watermark if specified
        if (exportOptions.watermark) {
          const watermark = document.createElement('div');
          watermark.className = 'pdf-watermark';
          watermark.textContent = exportOptions.watermark;
          watermark.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 4rem;
            color: rgba(0, 0, 0, 0.03);
            z-index: -1;
            pointer-events: none;
            font-weight: bold;
          `;
          pdfClone.appendChild(watermark);
        }
        
        // Temporarily add to DOM for printing
        document.body.appendChild(pdfClone);
        
        // Hide original content during print - FIX: Cast to HTMLElement
        const originalStyle = (contentContainer as HTMLElement).style.display;
        (contentContainer as HTMLElement).style.display = 'none';
        
        // Small delay to ensure styles are applied
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('🖨️ Triggering browser print dialog...');
        
        // Trigger browser print dialog
        window.print();
        
        // Clean up after print (or cancel)
        setTimeout(() => {
          document.body.removeChild(pdfClone);
          (contentContainer as HTMLElement).style.display = originalStyle;
          
          // Cleanup styles
          layoutService.removePDFStyles();
          themingService.removeThemeStyles();
          
          console.log('🧹 PDF export cleanup completed');
        }, 1000);
        
        toast({
          title: "PDF Export Started",
          description: "Your browser's print dialog should open. You can save as PDF from there.",
          variant: "default"
        });
        
      } else {
        throw new Error('Could not find trip content to export');
      }
      
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      toast({
        title: "PDF Export Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
      
      // Cleanup on error
      const layoutService = PDFLayoutService.getInstance();
      const themingService = PDFThemingService.getInstance();
      layoutService.removePDFStyles();
      themingService.removeThemeStyles();
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
            {isExporting ? 'Preparing PDF...' : 'Export PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPDFExport;
