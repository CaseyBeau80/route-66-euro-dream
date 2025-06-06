
import { toast } from '@/hooks/use-toast';

export const usePDFCleanup = () => {
  const cleanupPDFPreview = () => {
    console.log('🔄 Cleaning up Route 66 PDF preview and restoring UI...');
    
    // Remove programmatically created elements with fade-out
    const closeButton = document.querySelector('.pdf-close-button-js');
    if (closeButton && document.body.contains(closeButton)) {
      (closeButton as HTMLElement).style.opacity = '0';
      (closeButton as HTMLElement).style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (document.body.contains(closeButton)) {
          document.body.removeChild(closeButton);
        }
      }, 300);
    }
    
    const loadingOverlay = document.querySelector('.pdf-loading-overlay-js');
    if (loadingOverlay && document.body.contains(loadingOverlay)) {
      (loadingOverlay as HTMLElement).style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(loadingOverlay)) {
          document.body.removeChild(loadingOverlay);
        }
      }, 300);
    }
    
    // Restore original content with staggered animation
    const originalChildren = Array.from(document.body.children);
    originalChildren.forEach((child, index) => {
      if (child.id !== 'pdf-export-content') {
        setTimeout(() => {
          (child as HTMLElement).style.display = '';
        }, index * 50); // Staggered restoration for smooth effect
      }
    });
    
    // Hide PDF content and remove scaling
    const pdfContainer = document.getElementById('pdf-export-content');
    if (pdfContainer) {
      pdfContainer.classList.remove('pdf-preview-visible');
      pdfContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        visibility: hidden;
      `;
    }
    
    // Remove print styles
    const printStyles = document.getElementById('pdf-print-styles');
    if (printStyles) {
      printStyles.remove();
    }
    
    // Clear print handlers
    window.onafterprint = null;
    
    toast({
      title: "Route 66 PDF Preview Closed",
      description: "Returned to normal view. Weather forecast unavailable? Check online before departure.",
      variant: "default"
    });
  };

  return { cleanupPDFPreview };
};
