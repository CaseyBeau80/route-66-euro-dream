
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
import { toast } from '@/hooks/use-toast';

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
    console.log('🖨️ Starting PDF export...');
    setIsExporting(true);
    
    try {
      // Step 1: Close modal first and wait for it to fully close
      onClose();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Find the main trip content
      const tripContent = document.querySelector('[data-trip-content="true"]');
      if (!tripContent) {
        throw new Error('Trip content not found');
      }
      
      // Step 3: Clone the content and clean it
      const clonedContent = tripContent.cloneNode(true) as HTMLElement;
      
      // Remove interactive elements
      const elementsToRemove = clonedContent.querySelectorAll(
        'button, [role="dialog"], .dropdown, .modal, .share-button, .export-button'
      );
      elementsToRemove.forEach(el => el.remove());
      
      // Step 4: Create a clean PDF container
      let pdfContainer = document.getElementById('pdf-export-content');
      if (!pdfContainer) {
        pdfContainer = document.createElement('div');
        pdfContainer.id = 'pdf-export-content';
        document.body.appendChild(pdfContainer);
      }
      
      // Step 5: Style the container for PDF
      pdfContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        width: 8.5in;
        background: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        line-height: 1.4;
        color: #1f2937;
        padding: 0.5in;
      `;
      
      // Step 6: Add content to PDF container
      const tripTitle = exportOptions.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`;
      
      pdfContainer.innerHTML = `
        <div class="pdf-header" style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #3b82f6; padding-bottom: 12px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #1f2937;">
            ${tripTitle}
          </h1>
          <p style="font-size: 16px; color: #4b5563; margin-bottom: 4px;">
            ${tripPlan.startCity} → ${tripPlan.endCity}
          </p>
          <p style="font-size: 12px; color: #6b7280;">
            Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        ${clonedContent.innerHTML}
        <div class="pdf-footer" style="margin-top: 36px; padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="font-size: 10px; color: #6b7280;">
            Generated from Route 66 Trip Planner • ${new Date().toLocaleDateString()}
          </p>
          ${shareUrl ? `<p style="font-size: 10px; color: #9ca3af; margin-top: 4px;">Live version: ${shareUrl}</p>` : ''}
        </div>
      `;
      
      // Step 7: Apply print styles
      const printStyleId = 'pdf-print-styles';
      let printStyles = document.getElementById(printStyleId);
      if (!printStyles) {
        printStyles = document.createElement('style');
        printStyles.id = printStyleId;
        document.head.appendChild(printStyles);
      }
      
      printStyles.textContent = `
        @media print {
          @page {
            size: A4;
            margin: 0.5in;
          }
          
          body * {
            visibility: hidden;
          }
          
          #pdf-export-content,
          #pdf-export-content * {
            visibility: visible !important;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.4;
            color: #1f2937 !important;
            background: white !important;
            font-size: 12px;
            margin: 0 !important;
            padding: 0 !important;
          }

          #pdf-export-content {
            position: static !important;
            left: auto !important;
            top: auto !important;
            visibility: visible !important;
            width: 100% !important;
            background: white !important;
            padding: 0.5in !important;
            margin: 0 !important;
          }
        }
      `;
      
      // Step 8: Make PDF container visible and trigger print
      pdfContainer.style.cssText = `
        position: static;
        left: auto;
        top: auto;
        width: 100%;
        background: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        line-height: 1.4;
        color: #1f2937;
        padding: 0.5in;
      `;
      
      // Hide all other content
      const originalChildren = Array.from(document.body.children);
      originalChildren.forEach(child => {
        if (child.id !== 'pdf-export-content') {
          (child as HTMLElement).style.display = 'none';
        }
      });
      
      // Trigger print
      console.log('🖨️ Triggering browser print dialog...');
      window.print();
      
      // Restore original content after print
      setTimeout(() => {
        originalChildren.forEach(child => {
          (child as HTMLElement).style.display = '';
        });
        
        if (pdfContainer) {
          pdfContainer.style.cssText = `
            position: absolute;
            left: -9999px;
            top: -9999px;
            visibility: hidden;
          `;
        }
        
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
