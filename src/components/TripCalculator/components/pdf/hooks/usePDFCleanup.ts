
export const usePDFCleanup = () => {
  const cleanupPDFPreview = () => {
    console.log('🧹 Starting comprehensive PDF cleanup...');
    
    // Remove PDF container
    const pdfContainer = document.getElementById('pdf-export-content');
    if (pdfContainer) {
      console.log('🧹 Removing PDF container');
      pdfContainer.remove();
    }
    
    // Remove any loading overlays
    const loadingOverlays = document.querySelectorAll('.pdf-loading-overlay-js');
    loadingOverlays.forEach(overlay => {
      console.log('🧹 Removing loading overlay');
      overlay.remove();
    });
    
    // Remove print styles
    const printStyles = document.getElementById('pdf-print-styles');
    if (printStyles) {
      console.log('🧹 Removing print styles');
      printStyles.remove();
    }
    
    // Clear any PDF context attributes
    document.body.removeAttribute('data-pdf-context');
    
    console.log('✅ PDF cleanup completed');
  };

  return { cleanupPDFPreview };
};
