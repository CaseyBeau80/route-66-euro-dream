
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
    console.log('🔄 Creating Route 66 PDF loading overlay...');
    
    // Remove any existing loading message to prevent stacking
    const existingLoading = document.querySelector('.pdf-loading-overlay-js');
    if (existingLoading) {
      console.log('🧹 Removing existing loading overlay');
      existingLoading.remove();
    }

    const loadingBox = document.createElement("div");
    loadingBox.setAttribute("role", "status");
    loadingBox.setAttribute("aria-live", "polite");
    loadingBox.className = "pdf-loading-overlay-js";
    
    // Use inline styles for reliable positioning and blue theme
    loadingBox.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      background: #eff6ff;
      color: #1e40af;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 400px;
      width: calc(100% - 32px);
      margin: 0 16px;
      animation: fade-in-pdf 0.3s ease-out forwards;
    `;

    loadingBox.innerHTML = `
      <div style="
        width: 16px;
        height: 16px;
        border: 2px solid #1d4ed8;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        flex-shrink: 0;
      "></div>
      <div style="min-width: 0;">
        <p style="font-weight: 600; color: #1e3a8a; margin: 0 0 4px 0;">Preparing Route 66 PDF</p>
        <p style="font-size: 14px; color: #1e40af; margin: 0;">Loading weather data and formatting content...</p>
      </div>
    `;

    document.body.appendChild(loadingBox);

    // Add jiggle animation after initial fade-in
    setTimeout(() => {
      if (document.body.contains(loadingBox)) {
        loadingBox.style.animation = 'fade-in-pdf 0.3s ease-out forwards, pdf-jiggle 1.2s ease-in-out infinite';
      }
    }, 300);

    console.log('✅ Route 66 PDF loading overlay created');
    return loadingBox;
  };

  const removePDFLoadingMessage = (loadingBox: HTMLDivElement) => {
    if (loadingBox && document.body.contains(loadingBox)) {
      console.log('🧹 Removing PDF loading overlay with fade-out');
      loadingBox.style.animation = 'none';
      loadingBox.style.opacity = '0';
      loadingBox.style.transform = 'translateX(-50%) scale(0.95)';
      loadingBox.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
      
      setTimeout(() => {
        if (document.body.contains(loadingBox)) {
          loadingBox.remove();
        }
      }, 300);
    }
  };

  const handleExportPDF = async () => {
    console.log('🖨️ Starting enhanced Route 66 PDF export with blue branding...');
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
      
      console.log('🖨️ Enhanced Route 66 PDF preview ready with improved styling.');
      
      toast({
        title: "Route 66 PDF Preview Ready",
        description: "Press Ctrl+P to print, click red X to close.",
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
