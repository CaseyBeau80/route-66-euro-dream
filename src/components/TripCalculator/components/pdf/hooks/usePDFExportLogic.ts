
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
    console.log('🔄 Creating enhanced PDF loading overlay...');
    
    // Remove any existing loading message
    const existingLoading = document.querySelector('.pdf-loading-overlay-js');
    if (existingLoading) {
      existingLoading.remove();
    }

    const loadingBox = document.createElement("div");
    loadingBox.className = "pdf-loading-overlay-js";
    
    loadingBox.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 99999;
      background: white;
      color: #1e40af;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      max-width: 400px;
      width: calc(100% - 32px);
      text-align: center;
      border: 2px solid #3b82f6;
    `;

    loadingBox.innerHTML = `
      <div style="
        width: 24px;
        height: 24px;
        border: 3px solid #3b82f6;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      <div>
        <h3 style="font-weight: bold; color: #1e3a8a; margin: 0 0 8px 0; font-size: 18px;">
          Preparing Route 66 PDF
        </h3>
        <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.4;">
          Loading weather data and formatting your itinerary for print...
        </p>
      </div>
    `;

    document.body.appendChild(loadingBox);
    return loadingBox;
  };

  const removePDFLoadingMessage = (loadingBox: HTMLDivElement) => {
    if (loadingBox && document.body.contains(loadingBox)) {
      loadingBox.style.opacity = '0';
      loadingBox.style.transform = 'translate(-50%, -50%) scale(0.9)';
      loadingBox.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
      
      setTimeout(() => {
        if (document.body.contains(loadingBox)) {
          loadingBox.remove();
        }
      }, 300);
    }
  };

  const isolatePDFContainer = async (pdfContainer: HTMLElement): Promise<void> => {
    console.log('🔒 Isolating PDF container for print...');
    
    // Step 1: Hide all other content
    const bodyChildren = Array.from(document.body.children);
    const hiddenElements: HTMLElement[] = [];
    
    bodyChildren.forEach((child) => {
      if (child !== pdfContainer && child.id !== 'pdf-export-content') {
        const element = child as HTMLElement;
        if (element.style.display !== 'none') {
          element.dataset.originalDisplay = element.style.display || 'block';
          element.style.display = 'none';
          hiddenElements.push(element);
        }
      }
    });
    
    // Step 2: Make PDF container the only visible content
    pdfContainer.style.cssText = `
      position: static !important;
      left: auto !important;
      top: auto !important;
      visibility: visible !important;
      display: block !important;
      width: 100% !important;
      height: auto !important;
      margin: 0 !important;
      padding: 20px !important;
      background: white !important;
      color: #000 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
    `;
    
    // Step 3: Store cleanup function
    (pdfContainer as any)._restoreVisibility = () => {
      console.log('🔓 Restoring page visibility after print...');
      hiddenElements.forEach((element) => {
        const originalDisplay = element.dataset.originalDisplay || 'block';
        element.style.display = originalDisplay;
        delete element.dataset.originalDisplay;
      });
    };
    
    console.log('✅ PDF container isolated, ready for print');
  };

  const handleExportPDF = async () => {
    console.log('🖨️ Starting enhanced PDF export with container isolation...');
    setIsExporting(true);
    setWeatherLoading(true);
    
    const loadingBox = showPDFLoadingMessage();
    
    try {
      // Step 1: Close modal and wait
      onClose();
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Step 2: Show initial toast
      toast({
        title: "Preparing Route 66 PDF",
        description: "Loading weather data and formatting content...",
        variant: "default"
      });
      
      // Step 3: Create PDF container with enhanced weather loading
      console.log('📄 Creating PDF container with weather data...');
      const pdfContainer = await createPDFContainer({
        tripPlan,
        tripStartDate,
        exportOptions,
        shareUrl
      });
      
      // Step 4: Wait for weather data to fully load
      console.log('🌤️ Waiting for weather data to load...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setWeatherLoading(false);
      removePDFLoadingMessage(loadingBox);
      
      // Step 5: Add enhanced print styles
      addPrintStyles();
      
      // Step 6: Isolate PDF container for print
      await isolatePDFContainer(pdfContainer);
      
      // Step 7: Set preview state and show container
      setShowPreview(true);
      
      // Step 8: Show success toast and auto-open print dialog
      toast({
        title: "PDF Ready!",
        description: "Press Ctrl+P (or Cmd+P on Mac) to print or save as PDF.",
        variant: "default",
      });
      
      // Step 9: Auto-open print dialog after brief delay
      setTimeout(() => {
        console.log('🖨️ Opening print dialog...');
        window.print();
      }, 1000);
      
      // Step 10: Auto cleanup after 60 seconds
      setTimeout(() => {
        if (showPreview) {
          console.log('⏰ Auto-closing PDF preview after timeout');
          handleClosePreview();
        }
      }, 60000);
      
      console.log('✅ Enhanced PDF export completed successfully');
      
    } catch (error) {
      console.error('❌ Enhanced PDF export failed:', error);
      removePDFLoadingMessage(loadingBox);
      handleClosePreview();
      
      toast({
        title: "PDF Export Failed",
        description: "There was an issue generating the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setWeatherLoading(false);
    }
  };

  return { handleExportPDF };
};
