
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

  const showPDFLoadingMessage = (): HTMLDivElement => {
    // Remove any existing loading message to prevent stacking
    const existingLoading = document.querySelector('.pdf-loading-overlay-js');
    if (existingLoading) {
      document.body.removeChild(existingLoading);
    }

    const loadingBox = document.createElement("div");
    loadingBox.setAttribute("role", "status");
    loadingBox.setAttribute("aria-live", "polite");
    loadingBox.className = `
      pdf-loading-overlay-js
      fixed top-[72px] left-1/2 -translate-x-1/2 z-[9999]
      bg-white/90 text-gray-800 px-6 py-3
      rounded-xl shadow-lg text-sm flex items-center gap-2
      transition-opacity duration-300
    `.replace(/\s+/g, ' ').trim();

    loadingBox.innerHTML = `
      <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span>Preparing your trip PDF... Fetching weather and formatting content.</span>
    `;

    document.body.appendChild(loadingBox);
    return loadingBox;
  };

  const removePDFLoadingMessage = (loadingBox: HTMLDivElement) => {
    if (loadingBox && document.body.contains(loadingBox)) {
      // Add fade-out animation
      loadingBox.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(loadingBox)) {
          document.body.removeChild(loadingBox);
        }
      }, 300);
    }
  };

  const handleExportPDF = async () => {
    console.log('🖨️ Starting enhanced PDF export with improved UX...');
    setIsExporting(true);
    setWeatherLoading(true);
    
    // Show loading message immediately
    const loadingBox = showPDFLoadingMessage();
    
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
      
      // Step 4: Remove loading message
      removePDFLoadingMessage(loadingBox);
      
      // Step 5: Add enhanced print styles
      addPrintStyles();
      
      // Step 6: Show PDF preview with programmatic close button
      setShowPreview(true);
      showPDFPreview(pdfContainer, handleClosePreview);
      
      // Step 7: Add automatic timeout
      setTimeout(() => {
        if (showPreview) {
          console.log('⏰ Auto-closing PDF preview after 60 seconds');
          handleClosePreview();
        }
      }, 60000);
      
      console.log('🖨️ Enhanced PDF preview ready with programmatic controls.');
      
      toast({
        title: "Enhanced PDF Preview Ready",
        description: "Scaled to 110% for better readability. Press Ctrl+P to print, click red X to close.",
        variant: "default"
      });
      
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      removePDFLoadingMessage(loadingBox);
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
