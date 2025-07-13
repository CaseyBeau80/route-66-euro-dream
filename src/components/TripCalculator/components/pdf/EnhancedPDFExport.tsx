
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X, Printer } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { usePDFExportOptions } from '../../hooks/usePDFExportOptions';
import { usePDFExportSimple } from './hooks/usePDFExportSimple';
import { useScrollLockCleanup } from './hooks/useScrollLockCleanup';
import { PDFExportContent } from './components/PDFExportContent';

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
  const { exportOptions } = usePDFExportOptions();
  const { forceScrollUnlock } = useScrollLockCleanup();
  
  const { isExporting, isTripComplete, handleExportPDF } = usePDFExportSimple({
    tripPlan,
    tripStartDate,
    shareUrl,
    exportOptions,
    onClose
  });

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    console.log('🔄 Enhanced PDF Export dialog closing');
    forceScrollUnlock();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-6 py-5 bg-white shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="enhanced-pdf-export-title"
      >
        <DialogHeader>
          <DialogTitle id="enhanced-pdf-export-title" className="flex items-center gap-2 text-route66-primary font-semibold text-base sm:text-lg font-route66">
            <Printer className="w-5 h-5" />
            Print Trip Plan
          </DialogTitle>
        </DialogHeader>

        <DialogClose 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors duration-200"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <PDFExportContent
          isTripComplete={isTripComplete}
          isExporting={isExporting}
          tripStartDate={tripStartDate}
          onExport={handleExportPDF}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPDFExport;
