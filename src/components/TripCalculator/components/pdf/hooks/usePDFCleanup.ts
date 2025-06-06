
import { toast } from '@/hooks/use-toast';

export const usePDFCleanup = () => {
  const cleanupPDFPreview = () => {
    console.log('🔄 Cleaning up PDF preview and restoring UI...');
    
    // Restore original content
    const originalChildren = Array.from(document.body.children);
    originalChildren.forEach(child => {
      if (child.id !== 'pdf-export-content') {
        (child as HTMLElement).style.display = '';
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
    
    toast({
      title: "PDF Preview Closed",
      description: "Returned to normal view",
      variant: "default"
    });
  };

  return { cleanupPDFPreview };
};
