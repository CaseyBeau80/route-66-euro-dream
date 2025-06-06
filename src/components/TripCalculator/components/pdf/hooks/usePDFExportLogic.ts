
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
      (existingLoading as HTMLElement).style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(existingLoading)) {
          document.body.removeChild(existingLoading);
        }
      }, 300);
    }

    const loadingBox = document.createElement("div");
    loadingBox.setAttribute("role", "status");
    loadingBox.setAttribute("aria-live", "polite");
    loadingBox.className = `
      pdf-loading-overlay-js
      fixed top-[80px] left-1/2 -translate-x-1/2 z-[9999]
      bg-route66-orange-50 text-route66-orange-700 px-6 py-4
      rounded-xl shadow-lg flex items-center gap-3
      animate-fade-in transition-opacity duration-300
      max-w-sm w-full mx-4
    `.replace(/\s+/g, ' ').trim();

    loadingBox.innerHTML = `
      <div class="w-4 h-4 border-2 border-route66-orange-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
      <div class="min-w-0">
        <p class="font-semibold text-route66-orange-800">Preparing Route 66 PDF</p>
        <p class="text-sm text-route66-orange-600">Loading weather and formatting itinerary for print...</p>
      </div>
    `;

    document.body.appendChild(loadingBox);

    // Add pulse animation fallback for loads >4 seconds
    setTimeout(() => {
      if (document.body.contains(loadingBox)) {
        loadingBox.classList.add('animate-pulse');
      }
    }, 4000);

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
    console.log('🖨️ Starting enhanced PDF export with Route 66 branding...');
    setIsExporting(true);
    setWeatherLoading(true);
    
    // Show loading message immediately
    const loadingBox = showPDFLoadingMessage();
    
    try {
      // Step 1: Close modal first and wait for it to fully close
      onClose();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Show weather loading toast with Route 66 branding
      toast({
        title: "Preparing Route 66 PDF",
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
      
      // Step 4: Remove loading message with fade-out
      removePDFLoadingMessage(loadingBox);
      
      // Step 5: Add enhanced print styles
      addPrintStyles();
      
      // Step 6: Show PDF preview with programmatic close button
      setShowPreview(true);
      showPDFPreview(pdfContainer, handleClosePreview);
      
      // Step 7: Add automatic timeout with better messaging
      setTimeout(() => {
        if (showPreview) {
          console.log('⏰ Auto-closing PDF preview after 60 seconds');
          handleClosePreview();
        }
      }, 60000);
      
      console.log('🖨️ Enhanced Route 66 PDF preview ready with 110% scaling.');
      
      toast({
        title: "Route 66 PDF Preview Ready",
        description: "Scaled to 110% for better readability. Press Ctrl+P to print, click red X to close.",
        variant: "default"
      });
      
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      removePDFLoadingMessage(loadingBox);
      handleClosePreview();
      toast({
        title: "PDF Export Failed",
        description: "Weather forecast unavailable - please check online before departure.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setWeatherLoading(false);
    }
  };

  return { handleExportPDF };
};
