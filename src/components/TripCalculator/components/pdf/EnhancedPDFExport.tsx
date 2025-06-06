
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { usePDFExportOptions } from '../../hooks/usePDFExportOptions';
import { PDFLayoutService } from '../../services/pdf/PDFLayoutService';
import { toast } from '@/hooks/use-toast';
import PDFContentRenderer from './PDFContentRenderer';
import { createRoot } from 'react-dom/client';

interface EnhancedPDFExportProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedPDFExport: React.FC<EnhancedPDFExportProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  isOpen,
  onClose
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { exportOptions, updateExportOption } = usePDFExportOptions();

  const handleExportPDF = async () => {
    console.log('🖨️ Starting clean PDF export...');
    setIsExporting(true);
    
    try {
      // Step 1: Close modal first
      onClose();
      
      // Step 2: Wait for modal to close completely
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Step 3: Create or get the hidden PDF container
      let pdfContainer = document.getElementById('pdf-export-content');
      if (!pdfContainer) {
        pdfContainer = document.createElement('div');
        pdfContainer.id = 'pdf-export-content';
        pdfContainer.style.cssText = `
          position: absolute;
          left: -9999px;
          top: -9999px;
          width: 8.5in;
          background: white;
          visibility: hidden;
        `;
        document.body.appendChild(pdfContainer);
      }
      
      // Step 4: Clear and populate PDF container with clean content
      pdfContainer.innerHTML = '';
      
      // Create React root and render clean PDF content
      const root = createRoot(pdfContainer);
      root.render(
        <PDFContentRenderer
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          exportOptions={exportOptions}
          shareUrl={shareUrl}
        />
      );
      
      // Step 5: Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 6: Apply PDF styles
      const layoutService = PDFLayoutService.getInstance();
      layoutService.injectPDFStyles();
      
      // Step 7: Make PDF container visible for printing
      pdfContainer.style.visibility = 'visible';
      pdfContainer.style.position = 'static';
      pdfContainer.style.left = 'auto';
      pdfContainer.style.top = 'auto';
      
      // Step 8: Hide all other content during print
      const originalContent = document.body.innerHTML;
      const printContent = pdfContainer.outerHTML;
      
      // Replace body content with just the PDF content
      document.body.innerHTML = printContent;
      document.body.style.background = 'white';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      
      // Step 9: Trigger print
      console.log('🖨️ Triggering browser print dialog...');
      window.print();
      
      // Step 10: Restore original content after print
      setTimeout(() => {
        document.body.innerHTML = originalContent;
        document.body.style.background = '';
        document.body.style.margin = '';
        document.body.style.padding = '';
        
        // Cleanup styles
        layoutService.removePDFStyles();
        
        console.log('🧹 PDF export cleanup completed');
      }, 1000);
      
      toast({
        title: "PDF Export Started",
        description: "Your browser's print dialog should open. You can save as PDF from there.",
        variant: "default"
      });
      
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      toast({
        title: "PDF Export Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
      
      // Cleanup on error
      const layoutService = PDFLayoutService.getInstance();
      layoutService.removePDFStyles();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
