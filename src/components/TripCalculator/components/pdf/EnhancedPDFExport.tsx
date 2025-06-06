
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
      <DialogContent 
        className="fixed left-1/2 top-[12%] -translate-x-1/2 z-[10000] max-w-lg w-full px-4 sm:px-6 py-5 shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: '#FFF7ED',
          borderColor: '#FDBA74',
          borderWidth: '2px',
          color: '#9A3412'
        }}
      >
        <DialogHeader>
          <DialogTitle 
            className="flex items-center gap-2 font-semibold text-base sm:text-lg"
            style={{ color: '#EA580C' }}
          >
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
          className="w-full font-bold py-2 px-4 rounded transition-colors duration-200 text-sm sm:text-base"
          style={{
            backgroundColor: isExporting || !isTripComplete ? '#9CA3AF' : '#EA580C',
            color: 'white',
            opacity: isExporting || !isTripComplete ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isExporting && isTripComplete) {
              e.currentTarget.style.backgroundColor = '#C2410C';
            }
          }}
          onMouseLeave={(e) => {
            if (!isExporting && isTripComplete) {
              e.currentTarget.style.backgroundColor = '#EA580C';
            }
          }}
        >
          {isExporting ? 'Preparing PDF...' : 'Export PDF with Preview'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPDFExport;
