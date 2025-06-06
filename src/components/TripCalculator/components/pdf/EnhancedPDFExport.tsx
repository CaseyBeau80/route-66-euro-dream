import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, X } from 'lucide-react';
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
  const { exportOptions, updateExportOption } = usePDFExportOptions();

  // Debug trip plan data
  console.log('🖨️ EnhancedPDFExport: Trip plan data:', {
    segmentsCount: tripPlan.segments?.length || 0,
    firstSegmentWeather: tripPlan.segments?.[0]?.weather,
    firstSegmentWeatherData: tripPlan.segments?.[0]?.weatherData,
    allSegmentKeys: tripPlan.segments?.[0] ? Object.keys(tripPlan.segments[0]) : []
  });

  const handleExportPDF = async () => {
    console.log('🖨️ Starting PDF export with PDFContentRenderer...');
    setIsExporting(true);
    
    try {
      // Step 1: Close modal first and wait for it to fully close
      onClose();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('📄 Creating PDF content with trip data:', {
        segmentsCount: tripPlan.segments?.length || 0,
        hasWeatherData: tripPlan.segments?.some(s => s.weather || s.weatherData) || false
      });
      
      // Step 2: Create a clean PDF container
      let pdfContainer = document.getElementById('pdf-export-content');
      if (!pdfContainer) {
        pdfContainer = document.createElement('div');
        pdfContainer.id = 'pdf-export-content';
        document.body.appendChild(pdfContainer);
      }
      
      // Step 3: Style the container for PDF
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
      
      // Step 4: Render PDFContentRenderer directly using React
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
        
        // Wait for React to render
        setTimeout(() => {
          console.log('✅ PDF content rendered successfully');
          resolve();
        }, 100);
      });
      
      // Step 5: Apply print styles
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
          
          .bg-blue-50 { background-color: #eff6ff !important; }
          .bg-blue-100 { background-color: #dbeafe !important; }
          .border-blue-200 { border-color: #bfdbfe !important; }
          .border-blue-500 { border-color: #3b82f6 !important; }
          
          .grid { display: grid !important; }
          .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          
          .gap-4 { gap: 12px !important; }
          .gap-3 { gap: 9px !important; }
          .gap-2 { gap: 6px !important; }
          
          .p-6 { padding: 18px !important; }
          .p-4 { padding: 12px !important; }
          .p-3 { padding: 9px !important; }
          .p-2 { padding: 6px !important; }
          
          .mb-8 { margin-bottom: 24px !important; }
          .mb-6 { margin-bottom: 18px !important; }
          .mb-4 { margin-bottom: 12px !important; }
          .mb-3 { margin-bottom: 9px !important; }
          .mb-2 { margin-bottom: 6px !important; }
          .mb-1 { margin-bottom: 3px !important; }
          
          .mt-8 { margin-top: 24px !important; }
          .mt-4 { margin-top: 12px !important; }
          .mt-3 { margin-top: 9px !important; }
          .mt-2 { margin-top: 6px !important; }
          .mt-1 { margin-top: 3px !important; }
          
          .text-3xl { font-size: 24px !important; }
          .text-2xl { font-size: 20px !important; }
          .text-xl { font-size: 18px !important; }
          .text-lg { font-size: 16px !important; }
          .text-sm { font-size: 12px !important; }
          .text-xs { font-size: 10px !important; }
          
          .font-bold { font-weight: bold !important; }
          .font-semibold { font-weight: 600 !important; }
          .font-medium { font-weight: 500 !important; }
          
          .text-center { text-align: center !important; }
          .break-all { word-break: break-all !important; }
          
          .border-b-2 { border-bottom: 2px solid !important; }
          .border-t { border-top: 1px solid !important; }
          .border-b { border-bottom: 1px solid !important; }
          
          .space-y-4 > * + * { margin-top: 12px !important; }
          .space-y-3 > * + * { margin-top: 9px !important; }
          .space-y-2 > * + * { margin-top: 6px !important; }
          .space-y-1 > * + * { margin-top: 3px !important; }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `;
      
      // Step 6: Make PDF container visible and trigger print
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
        
        // Clean up React root
        root.unmount();
        
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
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
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
