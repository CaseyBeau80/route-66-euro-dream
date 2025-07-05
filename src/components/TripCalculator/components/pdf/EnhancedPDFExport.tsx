
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Settings, X, Printer } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { usePDFExportOptions } from '../../hooks/usePDFExportOptions';
import { PDFWindowService } from './services/PDFWindowService';
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
  const { exportOptions, updateExportOption } = usePDFExportOptions();
  const [isExporting, setIsExporting] = useState(false);

  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  // Cleanup PDF window on unmount
  useEffect(() => {
    return () => {
      PDFWindowService.cleanup();
    };
  }, []);

  const handleExportPDF = async () => {
    if (!isTripComplete) {
      toast({
        title: "Cannot Export PDF",
        description: "Please create a trip plan first before exporting to PDF.",
        variant: "destructive"
      });
      return;
    }

    console.log('🖨️ Starting PDF export to new window');
    setIsExporting(true);

    try {
      await PDFWindowService.openPrintWindow(
        tripPlan,
        tripStartDate,
        exportOptions,
        shareUrl
      );
      
      toast({
        title: "PDF Opened",
        description: "Your trip plan has been opened in a new window for printing.",
        variant: "default"
      });
      
      // Close the modal after successful export
      onClose();
      
    } catch (error) {
      console.error('❌ Error opening PDF window:', error);
      toast({
        title: "Export Failed",
        description: "Failed to open PDF window. Please check your popup blocker settings.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
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
          <div className="space-y-4">
            <div className="text-center text-gray-600">
              <p className="text-sm">
                This will open your trip plan in a new window optimized for printing.
                You can then save it as a PDF using your browser's print dialog.
              </p>
            </div>

            <Button
              onClick={handleExportPDF}
              disabled={isExporting || !isTripComplete}
              className="w-full bg-route66-primary hover:bg-route66-primary-dark text-white font-bold py-3 px-4 rounded transition-colors duration-200 text-sm sm:text-base font-route66 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              {isExporting ? 'Opening Print Window...' : 'Open Print Window'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPDFExport;
