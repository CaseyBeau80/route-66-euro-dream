
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Printer, X, AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { usePDFExport } from './pdf/hooks/usePDFExport';
import { usePDFKeyboardHandlers } from './pdf/hooks/usePDFKeyboardHandlers';
import PDFPreviewContainer from './pdf/PDFPreviewContainer';

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
    weatherLoadingStatus,
    weatherLoadingProgress,
    weatherTimeout,
    previewTripPlan,
    handleClosePreview,
    handleExportPDF
  } = usePDFExport({
    tripPlan,
    tripStartDate,
    shareUrl,
    exportOptions,
    onClose
  });

  usePDFKeyboardHandlers({
    showPreview,
    onClosePreview: handleClosePreview
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

  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  // Handle printing from preview
  const handlePrintFromPreview = () => {
    console.log('🖨️ Print button clicked from preview');
    window.print();
  };

  // Handle export button click
  const handleExportClick = () => {
    console.log('🚀 PDF Export Button Clicked!');
    
    if (!isTripComplete) {
      console.error('❌ Cannot export: Trip not complete');
      alert('Cannot export PDF: Please create a trip plan first.');
      return;
    }
    
    if (isExporting) {
      console.warn('⚠️ Already exporting, ignoring click');
      return;
    }
    
    console.log('✅ Calling handleExportPDF...');
    handleExportPDF();
  };

  // Show PDF Preview if active
  if (showPreview && previewTripPlan) {
    console.log('📄 Rendering PDF preview container');
    
    return (
      <PDFPreviewContainer
        tripPlan={previewTripPlan}
        tripStartDate={tripStartDate}
        exportOptions={exportOptions}
        shareUrl={shareUrl}
        weatherTimeout={weatherTimeout}
        onClose={handleClosePreview}
        onPrint={handlePrintFromPreview}
      />
    );
  }

  // Only show modal if not in preview mode
  if (!isOpen || showPreview) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-6 py-5 bg-white shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="pdf-export-title"
      >
        <DialogHeader>
          <DialogTitle id="pdf-export-title" className="flex items-center gap-2 text-blue-700 font-semibold text-base sm:text-lg">
            <Printer className="w-5 h-5" />
            Export Route 66 Itinerary
          </DialogTitle>
        </DialogHeader>

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
                    <SelectItem value="full">Complete Itinerary (with weather & attractions)</SelectItem>
                    <SelectItem value="summary">Summary View (overview only)</SelectItem>
                    <SelectItem value="route-only">Route Only (basic route info)</SelectItem>
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

              {/* Weather Status Display */}
              {(weatherLoading || weatherTimeout) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    {weatherLoading ? (
                      <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : weatherTimeout ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm text-blue-800 font-medium mb-1">
                        {weatherLoadingStatus || 'Processing weather data...'}
                      </div>
                      <Progress value={weatherLoadingProgress} className="h-2" />
                    </div>
                  </div>
                  
                  {weatherTimeout && (
                    <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
                      ⏱️ Weather data timed out. Preview includes seasonal estimates for reference.
                    </div>
                  )}
                </div>
              )}

              {/* Instructions */}
              <div className="p-3 bg-route66-vintage-beige border border-route66-tan rounded-lg text-sm text-route66-navy">
                <div className="font-semibold mb-2 text-route66-vintage-red text-sm font-route66">🛣️ Enhanced PDF Features:</div>
                <ul className="text-xs space-y-1.5 leading-relaxed text-route66-vintage-brown">
                  <li>• Guaranteed instant preview opening for fast review</li>
                  <li>• Live weather data when available (6-second timeout)</li>
                  <li>• Seasonal weather estimates as intelligent fallback</li>
                  <li>• Enhanced Route 66 branding and nostalgic styling</li>
                  <li>• Optimized layout matching your final itinerary</li>
                  <li>• Print-ready format with professional presentation</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleExportClick}
              disabled={isExporting || !isTripComplete}
              className="w-full bg-route66-primary hover:bg-route66-primary-dark text-white font-bold py-2 px-4 rounded transition-colors duration-200 text-sm sm:text-base font-route66"
            >
              {isExporting ? 'Opening Preview...' : 'Export PDF with Preview'}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PDFExportModal;
