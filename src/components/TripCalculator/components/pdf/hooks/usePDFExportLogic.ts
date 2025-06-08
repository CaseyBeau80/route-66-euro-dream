
import { toast } from '@/hooks/use-toast';
import { TripPlan } from '../../../services/planning/TripPlanBuilder';
import { usePDFContainer } from './usePDFContainer';
import { usePDFStyles } from './usePDFStyles';

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

  const showPDFLoadingMessage = (): HTMLDivElement => {
    console.log('🔄 Creating PDF loading overlay...');
    
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
          Preparing PDF Export
        </h3>
        <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.4;">
          Loading weather data and formatting your Route 66 itinerary...
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

  const handleExportPDF = async () => {
    console.log('🖨️ Starting PDF export...');
    setIsExporting(true);
    setWeatherLoading(true);
    
    const loadingBox = showPDFLoadingMessage();
    
    try {
      // Step 1: Show initial toast with updated message
      toast({
        title: "Generating PDF Export",
        description: "Loading weather data and preparing your Route 66 itinerary...",
        variant: "default"
      });
      
      // Step 2: Create PDF container with weather data
      console.log('📄 Creating PDF container...');
      const pdfContainer = await createPDFContainer({
        tripPlan,
        tripStartDate,
        exportOptions,
        shareUrl
      });
      
      // Step 3: Wait for weather data to load
      console.log('🌤️ Waiting for weather data...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setWeatherLoading(false);
      removePDFLoadingMessage(loadingBox);
      
      // Step 4: Add print styles
      addPrintStyles();
      
      // Step 5: Close the modal BEFORE opening print dialog
      onClose();
      
      // Step 6: Brief delay then open print dialog
      setTimeout(() => {
        console.log('🖨️ Opening print dialog...');
        toast({
          title: "PDF Ready!",
          description: "Press Ctrl+P (or Cmd+P on Mac) to print or save as PDF.",
          variant: "default",
        });
        
        // Auto-open print dialog
        window.print();
        
        // Cleanup after print dialog closes
        const cleanup = () => {
          handleClosePreview();
        };
        
        // Listen for print events
        window.addEventListener('afterprint', cleanup, { once: true });
        
        // Fallback cleanup after 30 seconds
        setTimeout(cleanup, 30000);
        
      }, 500);
      
      console.log('✅ PDF export completed successfully');
      
    } catch (error) {
      console.error('❌ PDF export failed:', error);
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
