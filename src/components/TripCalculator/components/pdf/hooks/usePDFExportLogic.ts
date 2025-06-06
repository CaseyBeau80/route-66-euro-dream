
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
    console.log('⏳ Creating enhanced Route 66 loading overlay...');
    
    // Remove any existing loading message to prevent stacking
    const existingLoading = document.querySelector('.pdf-loading-overlay-js');
    if (existingLoading) {
      console.log('🗑️ Removing existing loading overlay');
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
    loadingBox.className = "pdf-loading-overlay-js";
    
    // Use inline styles for maximum reliability
    loadingBox.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      background-color: #FFF7ED;
      color: #9A3412;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 384px;
      width: calc(100% - 32px);
      margin: 0 16px;
      border: 2px solid #FDBA74;
      opacity: 1;
      animation: fadeInPdf 0.3s ease-out forwards;
    `;

    loadingBox.innerHTML = `
      <div style="
        width: 16px;
        height: 16px;
        border: 2px solid #EA580C;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        flex-shrink: 0;
      "></div>
      <div style="min-width: 0;">
        <p style="font-weight: 600; color: #C2410C; margin: 0 0 4px 0; font-size: 14px;">Preparing Route 66 PDF</p>
        <p style="font-size: 12px; color: #EA580C; margin: 0;">Loading weather and formatting itinerary for print...</p>
      </div>
    `;

    // Add keyframes for spin animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes fadeInPdf {
        0% {
          transform: scale(0.95) translateX(-50%);
          opacity: 0;
        }
        100% {
          transform: scale(1) translateX(-50%);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(loadingBox);
    console.log('✅ Enhanced loading overlay created');

    // Add pulse animation fallback for loads >4 seconds
    setTimeout(() => {
      if (document.body.contains(loadingBox)) {
        loadingBox.style.animation = 'fadeInPdf 0.3s ease-out forwards, pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite';
      }
    }, 4000);

    return loadingBox;
  };

  const removePDFLoadingMessage = (loadingBox: HTMLDivElement) => {
    if (loadingBox && document.body.contains(loadingBox)) {
      console.log('🔄 Removing loading overlay with fade animation');
      // Add fade-out animation
      loadingBox.style.opacity = '0';
      loadingBox.style.transform = 'scale(0.95) translateX(-50%)';
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
