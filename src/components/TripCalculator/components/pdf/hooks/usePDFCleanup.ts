
export const usePDFCleanup = () => {
  const cleanupPDFPreview = () => {
    console.log('🧹 Cleaning up PDF preview...');
    
    // Remove PDF container
    const pdfContainer = document.getElementById('pdf-export-content');
    if (pdfContainer) {
      pdfContainer.remove();
    }

    // Remove close button
    const closeButton = document.querySelector('.pdf-close-button-js');
    if (closeButton) {
      // Call cleanup if it exists
      if ((closeButton as any)._cleanup) {
        (closeButton as any)._cleanup();
      }
      closeButton.remove();
    }

    // Remove loading overlay
    const loadingOverlay = document.querySelector('.pdf-loading-overlay-js');
    if (loadingOverlay) {
      loadingOverlay.remove();
    }

    // Remove print styles
    const printStyles = document.getElementById('pdf-print-styles');
    if (printStyles) {
      printStyles.remove();
    }

    console.log('✅ PDF preview cleanup completed');
  };

  return { cleanupPDFPreview };
};
