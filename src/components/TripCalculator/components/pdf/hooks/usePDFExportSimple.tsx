import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { TripPlan } from '../../../services/planning/TripPlanBuilder';
import { PDFWindowService } from '../services/PDFWindowService';
import { useScrollLockCleanup } from './useScrollLockCleanup';

interface UsePDFExportSimpleProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  exportOptions: any;
  onClose: () => void;
}

export const usePDFExportSimple = ({ 
  tripPlan, 
  tripStartDate, 
  shareUrl, 
  exportOptions, 
  onClose 
}: UsePDFExportSimpleProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { forceScrollUnlock } = useScrollLockCleanup();

  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  // Cleanup PDF window and scroll lock on unmount
  useEffect(() => {
    return () => {
      PDFWindowService.cleanup();
      // Force unlock scroll in case it gets stuck
      document.body.removeAttribute('data-scroll-locked');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
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

    console.log('🖨️ Starting simplified PDF export');
    setIsExporting(true);

    try {
      // Force unlock scroll BEFORE doing anything
      forceScrollUnlock();
      
      await PDFWindowService.openPrintWindow(
        tripPlan,
        tripStartDate,
        exportOptions,
        shareUrl
      );
      
      toast({
        title: "PDF Opened",
        description: "Your trip plan with weather data has been opened in a new window for printing.",
        variant: "default"
      });
      
      // Close the modal immediately and unlock scroll
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
      // Final scroll unlock
      forceScrollUnlock();
    }
  };

  return {
    isExporting,
    isTripComplete,
    handleExportPDF
  };
};