
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Settings, X } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { usePDFExportOptions } from '../../hooks/usePDFExportOptions';
import { usePDFExport } from './hooks/usePDFExport';
import { usePDFKeyboardHandlers } from './hooks/usePDFKeyboardHandlers';
import PDFExportOptionsForm from './components/PDFExportOptionsForm';

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

  // Check if trip is complete
  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-lg px-6 py-5 bg-white shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="pdf-export-title"
      >
        <DialogHeader>
          <DialogTitle id="pdf-export-title" className="flex items-center gap-2 text-blue-700 font-semibold text-base sm:text-lg">
            <Settings className="w-5 h-5" />
            PDF Export Options
          </DialogTitle>
        </DialogHeader>

        {/* Custom Close Button */}
        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors duration-200">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <PDFExportOptionsForm
          exportOptions={exportOptions}
          updateExportOption={updateExportOption}
          weatherLoading={weatherLoading}
        />

        {/* Export Button */}
        <Button
          onClick={handleExportPDF}
          disabled={isExporting || !isTripComplete}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 text-sm sm:text-base"
        >
          {isExporting ? 'Preparing PDF...' : 'Export PDF with Preview'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPDFExport;
