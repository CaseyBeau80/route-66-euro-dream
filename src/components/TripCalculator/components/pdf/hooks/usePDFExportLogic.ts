
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
  setPdfContainer: (container: HTMLElement | null) => void;
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
  handleClosePreview,
  setPdfContainer
}: UsePDFExportLogicProps) => {
  const { createPDFContainer } = usePDFContainer();
  const { addPrintStyles, removePrintStyles } = usePDFStyles();

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
          Preparing Your PDF
        </h3>
        <p style="color: #1e40af; margin: 0; font-size: 14px;">
          Creating your Route 66 itinerary with weather forecasts...
        </p>
      </div>
    `;

    document.body.appendChild(loadingBox);
    return loadingBox;
  };

  const removePDFLoadingMessage = (loadingBox: HTMLDivElement) => {
    if (loadingBox && document.body.contains(loadingBox)) {
      loadingBox.remove();
    }
  };

  const handleExportPDF = async () => {
    console.log('🖨️ Starting PDF export...');
    setIsExporting(true);
    setWeatherLoading(true);
    
    const loadingBox = showPDFLoadingMessage();
    
    try {
      toast({
        title: "Generating PDF",
        description: "Creating your Route 66 itinerary...",
        variant: "default"
      });
      
      console.log('📄 Creating PDF container...');
      const pdfContainer = await createPDFContainer({
        tripPlan,
        tripStartDate,
        exportOptions,
        shareUrl
      });
      
      setPdfContainer(pdfContainer);
      
      // Verify content was rendered
      const hasContent = pdfContainer.innerHTML.trim().length > 100;
      
      if (!hasContent) {
        throw new Error('PDF content failed to render');
      }
      
      console.log('📄 Adding print styles...');
      addPrintStyles();
      
      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWeatherLoading(false);
      removePDFLoadingMessage(loadingBox);
      
      // Close modal before printing
      onClose();
      
      setTimeout(() => {
        console.log('🖨️ Opening print dialog...');
        
        toast({
          title: "PDF Ready!",
          description: "Your itinerary is ready. Print dialog opening...",
          variant: "default",
        });
        
        // Print the document
        window.print();
        
        // Cleanup after print
        const cleanup = () => {
          console.log('🧹 Cleaning up after print...');
          removePrintStyles();
          setPdfContainer(null);
          
          const container = document.getElementById('pdf-export-content');
          if (container) {
            container.remove();
          }
        };
        
        // Listen for print completion
        window.addEventListener('afterprint', cleanup, { once: true });
        
        // Fallback cleanup
        setTimeout(cleanup, 30000);
        
      }, 500);
      
      console.log('✅ PDF export completed');
      
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      removePDFLoadingMessage(loadingBox);
      removePrintStyles();
      
      const container = document.getElementById('pdf-export-content');
      if (container) {
        container.remove();
      }
      
      toast({
        title: "PDF Export Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setWeatherLoading(false);
    }
  };

  return { handleExportPDF };
};
