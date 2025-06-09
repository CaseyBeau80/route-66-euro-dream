
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Settings, X } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { usePDFExportOptions } from '../../hooks/usePDFExportOptions';
import { usePDFExport } from './hooks/usePDFExport';
import { usePDFKeyboardHandlers } from './hooks/usePDFKeyboardHandlers';
import PDFExportOptionsForm from './components/PDFExportOptionsForm';
import PDFPreviewContainer from './PDFPreviewContainer';

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
  const { exportOptions, updateExportOption } = usePDFExportOptions();
  
  const {
    isExporting,
    showPreview,
    previewTripPlan,
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

  usePDFKeyboardHandlers({
    showPreview,
    onClosePreview: handleClosePreview
  });

  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  console.log('📄 EnhancedPDFExport render state:', {
    isOpen,
    showPreview,
    hasPreviewTripPlan: !!previewTripPlan,
    isTripComplete,
    isExporting
  });

  // Handle printing from preview
  const handlePrintFromPreview = () => {
    console.log('🖨️ Print button clicked from Enhanced PDF preview');
    window.print();
  };

  // CRITICAL: Check if preview should be shown
  if (showPreview) {
    console.log('📄 Rendering Enhanced PDF preview container (showPreview=true)');
    
    // Use the current tripPlan if previewTripPlan is not available (failsafe)
    const tripPlanToRender = previewTripPlan || tripPlan;
    
    if (!tripPlanToRender) {
      console.error('❌ No trip plan available for Enhanced PDF preview');
      return (
        <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p>Error: No trip plan available for preview</p>
            <Button onClick={handleClosePreview} className="mt-4">Close</Button>
          </div>
        </div>
      );
    }
    
    return (
      <PDFPreviewContainer
        tripPlan={tripPlanToRender}
        tripStartDate={tripStartDate}
        exportOptions={exportOptions}
        shareUrl={shareUrl}
        weatherTimeout={false}
        onClose={handleClosePreview}
        onPrint={handlePrintFromPreview}
      />
    );
  }

  // Only show modal form if NOT in preview mode AND modal should be open
  if (!isOpen) {
    console.log('📄 Enhanced PDF modal not open, returning null');
    return null;
  }

  console.log('📄 Rendering Enhanced PDF export form modal');

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-6 py-5 bg-white shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="enhanced-pdf-export-title"
      >
        <DialogHeader>
          <DialogTitle id="enhanced-pdf-export-title" className="flex items-center gap-2 text-blue-700 font-semibold text-base sm:text-lg">
            <Settings className="w-5 h-5" />
            Enhanced PDF Export Options
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
            <PDFExportOptionsForm
              exportOptions={exportOptions}
              updateExportOption={updateExportOption}
              weatherLoading={weatherLoading}
            />

            <Button
              onClick={handleExportPDF}
              disabled={isExporting || !isTripComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 text-sm sm:text-base"
            >
              {isExporting ? 'Preparing Enhanced PDF...' : 'Export Enhanced PDF with Preview'}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPDFExport;
