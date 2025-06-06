
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
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
      <DialogContent className="fixed left-1/2 top-[12%] -translate-x-1/2 z-[10000] max-w-lg w-full px-4 sm:px-6 py-5 bg-route66-orange-50 border border-route66-orange-300 text-route66-orange-700 shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-route66-orange-600 font-semibold text-base sm:text-lg">
            <Settings className="w-5 h-5" />
            PDF Export Options
          </DialogTitle>
        </DialogHeader>
        
        <PDFExportOptionsForm
          exportOptions={exportOptions}
          updateExportOption={updateExportOption}
          weatherLoading={weatherLoading}
        />

        {/* Export Button */}
        <Button
          onClick={handleExportPDF}
          disabled={isExporting || !isTripComplete}
          className="w-full bg-route66-orange-600 hover:bg-route66-orange-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 text-sm sm:text-base"
        >
          {isExporting ? 'Preparing PDF...' : 'Export PDF with Preview'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPDFExport;
