
import { toast } from '@/hooks/use-toast';
import { TripPlan } from '../../../services/planning/TripPlanBuilder';
import { usePDFContainer } from './usePDFContainer';
import { usePDFStyles } from './usePDFStyles';
import { usePDFDisplay } from './usePDFDisplay';

interface UsePDFExportLogicProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  exportOptions: any;
  onClose: () => void;
  setIsExporting: (value: boolean) => void;
  setWeatherLoading: (value: boolean) => void;
  setShowPreview: (value: boolean) => void;
  showPreview: boolean;
  handleClosePreview: () => void;
}

export const usePDFExportLogic = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  exportOptions,
  onClose,
  setIsExporting,
  setWeatherLoading,
  setShowPreview,
  showPreview,
  handleClosePreview
}: UsePDFExportLogicProps) => {
  const { createPDFContainer } = usePDFContainer();
  const { addPrintStyles } = usePDFStyles();
  const { showPDFPreview } = usePDFDisplay();

  const handleExportPDF = async () => {
    console.log('🖨️ Starting enhanced PDF export with improved readability...');
    setIsExporting(true);
    setWeatherLoading(true);
    
    try {
      // Step 1: Close modal first and wait for it to fully close
      onClose();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Show weather loading toast
      toast({
        title: "Preparing PDF",
        description: "Loading weather data and formatting content for enhanced readability...",
        variant: "default"
      });
      
      // Step 3: Create PDF container and render content
      const pdfContainer = await createPDFContainer({
        tripPlan,
        tripStartDate,
        exportOptions,
        shareUrl
      });
      
      setWeatherLoading(false);
      
      // Step 4: Add enhanced print styles
      addPrintStyles();
      
      // Step 5: Show PDF preview
      setShowPreview(true);
      showPDFPreview(pdfContainer, handleClosePreview);
      
      // Step 6: Add automatic timeout
      setTimeout(() => {
        if (showPreview) {
          console.log('⏰ Auto-closing PDF preview after 60 seconds');
          handleClosePreview();
        }
      }, 60000);
      
      console.log('🖨️ Enhanced PDF preview ready with 110% scaling and improved typography.');
      
      toast({
        title: "Enhanced PDF Preview Ready",
        description: "Scaled to 110% for better readability. Press Ctrl+P to print, ESC to close.",
        variant: "default"
      });
      
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      handleClosePreview();
      toast({
        title: "PDF Export Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setWeatherLoading(false);
    }
  };

  return { handleExportPDF };
};
