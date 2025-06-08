
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Printer, X, AlertCircle } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { usePDFExport } from './pdf/hooks/usePDFExport';

interface PDFExportModalProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface PDFExportOptions {
  format: 'full' | 'summary' | 'route-only';
  title?: string;
  watermark?: string;
  includeQRCode: boolean;
}

const PDFExportModal: React.FC<PDFExportModalProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  isOpen,
  onClose
}) => {
  const [exportOptions, setExportOptions] = React.useState<PDFExportOptions>({
    format: 'full',
    title: undefined,
    watermark: undefined,
    includeQRCode: false
  });

  const {
    isExporting,
    showPreview,
    weatherLoading,
    handleClosePreview,
    handleExportPDF
  } = usePDFExport({
    tripPlan,
    tripStartDate,
    shareUrl,
    exportOptions,
    onClose
  });

  const updateExportOption = <K extends keyof PDFExportOptions>(
    key: K,
    value: PDFExportOptions[K]
  ) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Check if trip is complete
  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  if (showPreview) {
    return null; // PDF preview is handled by the hook
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-lg px-6 py-5 bg-white shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="pdf-export-title"
      >
        <DialogHeader>
          <DialogTitle id="pdf-export-title" className="flex items-center gap-2 text-blue-700 font-semibold text-base sm:text-lg">
            <Printer className="w-5 h-5" />
            PDF Export Options
          </DialogTitle>
        </DialogHeader>

        {/* Custom Close Button */}
        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors duration-200">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        {!isTripComplete ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <p className="text-lg font-medium">Trip Not Complete</p>
              <p className="text-sm mt-2">Please create a trip plan first before exporting to PDF.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {/* Export Format */}
              <div className="space-y-2">
                <Label className="text-blue-700 font-semibold text-sm">Export Format</Label>
                <Select 
                  value={exportOptions.format} 
                  onValueChange={(value: 'full' | 'summary' | 'route-only') => updateExportOption('format', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Itinerary (with weather & stops)</SelectItem>
                    <SelectItem value="summary">Summary (basic info only)</SelectItem>
                    <SelectItem value="route-only">Route Only (no weather or stops)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Title */}
              <div className="space-y-2">
                <Label className="text-blue-700 font-semibold text-sm">Custom Title (Optional)</Label>
                <Input
                  placeholder="My Route 66 Adventure"
                  value={exportOptions.title || ''}
                  onChange={(e) => updateExportOption('title', e.target.value)}
                  className="text-sm"
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
                  <Label htmlFor="includeQRCode" className="text-blue-700 font-semibold text-sm">Include QR Code for Live Version</Label>
                </div>
              </div>

              {/* Watermark */}
              <div className="space-y-2">
                <Label className="text-blue-700 font-semibold text-sm">Watermark (Optional)</Label>
                <Input
                  placeholder="DRAFT"
                  value={exportOptions.watermark || ''}
                  onChange={(e) => updateExportOption('watermark', e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Weather Loading Status */}
              {weatherLoading && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-blue-800 font-medium">Loading weather data...</span>
                </div>
              )}

              {/* Instructions */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <div className="font-semibold mb-2 text-blue-700 text-sm">📋 PDF Export Instructions:</div>
                <ul className="text-xs space-y-1.5 leading-relaxed">
                  <li>• Click "Generate PDF" to create your printable itinerary</li>
                  <li>• A preview will open where you can review the content</li>
                  <li>• Press Ctrl+P (or Cmd+P on Mac) to open the print dialog</li>
                  <li>• Choose "Save as PDF" as your destination to download the file</li>
                  <li>• Weather data is loaded for enhanced trip planning</li>
                </ul>
              </div>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExportPDF}
              disabled={isExporting || !isTripComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 text-sm sm:text-base"
            >
              {isExporting ? 'Generating PDF...' : 'Generate PDF Preview'}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PDFExportModal;
