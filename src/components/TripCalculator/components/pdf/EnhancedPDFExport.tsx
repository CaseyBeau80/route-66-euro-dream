
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, X, AlertCircle } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { usePDFExportOptions } from '../../hooks/usePDFExportOptions';
import { toast } from '@/hooks/use-toast';
import PDFContentRenderer from './PDFContentRenderer';
import ReactDOM from 'react-dom/client';

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
  const [showPreview, setShowPreview] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const { exportOptions, updateExportOption } = usePDFExportOptions();

  // Add keyboard escape handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showPreview) {
        handleClosePreview();
      }
    };

    if (showPreview) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [showPreview]);

  const handleClosePreview = () => {
    console.log('🔄 Closing PDF preview and restoring UI...');
    setShowPreview(false);
    
    // Restore original content
    const originalChildren = Array.from(document.body.children);
    originalChildren.forEach(child => {
      if (child.id !== 'pdf-export-content') {
        (child as HTMLElement).style.display = '';
      }
    });
    
    // Hide PDF content
    const pdfContainer = document.getElementById('pdf-export-content');
    if (pdfContainer) {
      pdfContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        visibility: hidden;
      `;
    }
    
    // Remove print styles
    const printStyles = document.getElementById('pdf-print-styles');
    if (printStyles) {
      printStyles.remove();
    }
    
    toast({
      title: "PDF Preview Closed",
      description: "Returned to normal view",
      variant: "default"
    });
  };

  const handleExportPDF = async () => {
    console.log('🖨️ Starting enhanced PDF export with close mechanisms...');
    setIsExporting(true);
    setWeatherLoading(true);
    
    try {
      // Step 1: Close modal first and wait for it to fully close
      onClose();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Show weather loading toast
      toast({
        title: "Preparing PDF",
        description: "Loading weather data and formatting content...",
        variant: "default"
      });
      
      console.log('📄 Creating PDF content with enhanced weather loading...');
      
      // Step 3: Create a clean PDF container
      let pdfContainer = document.getElementById('pdf-export-content');
      if (!pdfContainer) {
        pdfContainer = document.createElement('div');
        pdfContainer.id = 'pdf-export-content';
        document.body.appendChild(pdfContainer);
      }
      
      // Step 4: Style the container for PDF
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
        padding: 0;
        margin: 0;
      `;
      
      // Step 5: Render PDFContentRenderer with timeout
      const root = ReactDOM.createRoot(pdfContainer);
      
      await new Promise<void>((resolve) => {
        root.render(
          <PDFContentRenderer
            tripPlan={tripPlan}
            tripStartDate={tripStartDate}
            exportOptions={exportOptions}
            shareUrl={shareUrl}
          />
        );
        
        // Wait for React to render and weather to load
        setTimeout(() => {
          setWeatherLoading(false);
          console.log('✅ PDF content rendered with weather data');
          resolve();
        }, 3000); // Give weather API time to load
      });
      
      // Step 6: Add enhanced print styles with close button
      const printStyleId = 'pdf-print-styles';
      let printStyles = document.getElementById(printStyleId);
      if (!printStyles) {
        printStyles = document.createElement('style');
        printStyles.id = printStyleId;
        document.head.appendChild(printStyles);
      }
      
      printStyles.textContent = `
        @media screen {
          .pdf-close-button {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 10000 !important;
            background: #dc2626 !important;
            color: white !important;
            border: none !important;
            padding: 12px 20px !important;
            border-radius: 6px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            font-size: 14px !important;
          }
          
          .pdf-close-button:hover {
            background: #b91c1c !important;
          }
          
          .pdf-instructions {
            position: fixed !important;
            top: 80px !important;
            right: 20px !important;
            z-index: 9999 !important;
            background: rgba(0,0,0,0.8) !important;
            color: white !important;
            padding: 12px !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            max-width: 200px !important;
          }
        }
        
        @media print {
          .pdf-close-button,
          .pdf-instructions {
            display: none !important;
          }
          
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
            font-size: 12px !important;
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
          
          .pdf-clean-container {
            width: 100% !important;
            max-width: none !important;
            background: white !important;
            color: #1f2937 !important;
            font-family: inherit !important;
            font-size: 12px !important;
            line-height: 1.4 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .pdf-day-segment,
          .no-page-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          .bg-gray-50 {
            background-color: #f9fafb !important;
            border: 1px solid #e5e7eb !important;
          }
          
          .border {
            border: 1px solid #e5e7eb !important;
          }
          
          .rounded,
          .rounded-lg {
            border-radius: 6px !important;
          }
          
          .text-blue-600 { color: #2563eb !important; }
          .text-blue-800 { color: #1e40af !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-500 { color: #6b7280 !important; }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `;
      
      // Step 7: Add close button and instructions to PDF container
      const closeButton = document.createElement('button');
      closeButton.className = 'pdf-close-button';
      closeButton.innerHTML = '✕ Close PDF Preview';
      closeButton.onclick = handleClosePreview;
      
      const instructions = document.createElement('div');
      instructions.className = 'pdf-instructions';
      instructions.innerHTML = `
        <div><strong>PDF Preview Mode</strong></div>
        <div>• Press ESC to close</div>
        <div>• Use Ctrl+P to print</div>
        <div>• Click close button to exit</div>
      `;
      
      pdfContainer.appendChild(closeButton);
      pdfContainer.appendChild(instructions);
      
      // Step 8: Make PDF container visible and trigger preview
      setShowPreview(true);
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
        margin: 0;
      `;
      
      // Hide all other content
      const originalChildren = Array.from(document.body.children);
      originalChildren.forEach(child => {
        if (child.id !== 'pdf-export-content') {
          (child as HTMLElement).style.display = 'none';
        }
      });
      
      // Add automatic timeout
      setTimeout(() => {
        if (showPreview) {
          console.log('⏰ Auto-closing PDF preview after 60 seconds');
          handleClosePreview();
        }
      }, 60000);
      
      console.log('🖨️ PDF preview ready. Use Ctrl+P to print or ESC to close.');
      
      toast({
        title: "PDF Preview Ready",
        description: "Press Ctrl+P to print, ESC to close, or click the close button",
        variant: "default"
      });
      
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      handleClosePreview();
      toast({
        title: "PDF Export Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setWeatherLoading(false);
    }
  };

  // Check if trip is complete
  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto my-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            PDF Export Options
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Weather Loading Notice */}
          {weatherLoading && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">Loading weather data...</span>
            </div>
          )}

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

          {/* Instructions */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
            <div className="font-medium mb-1">📋 Export Instructions:</div>
            <ul className="text-xs space-y-1">
              <li>• Weather data loads automatically (may take a few seconds)</li>
              <li>• Press <kbd className="bg-gray-200 px-1 rounded">ESC</kbd> to close PDF preview</li>
              <li>• Use <kbd className="bg-gray-200 px-1 rounded">Ctrl+P</kbd> to print or save as PDF</li>
              <li>• Click the red close button to exit preview mode</li>
            </ul>
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExportPDF}
            disabled={isExporting || !isTripComplete}
            className="w-full"
          >
            {isExporting ? 'Preparing PDF...' : 'Export PDF with Preview'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPDFExport;
