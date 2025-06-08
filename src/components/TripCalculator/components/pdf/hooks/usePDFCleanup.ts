
export const usePDFCleanup = () => {
  const cleanupPDFPreview = () => {
    console.log('🧹 Starting comprehensive PDF cleanup...');
    
    // Step 1: Restore page visibility if PDF container has restore function
    const pdfContainer = document.getElementById('pdf-export-content');
    if (pdfContainer && (pdfContainer as any)._restoreVisibility) {
      console.log('🔓 Restoring page visibility...');
      (pdfContainer as any)._restoreVisibility();
    }
    
    // Step 2: Remove PDF container
    if (pdfContainer) {
      console.log('🗑️ Removing PDF container...');
      pdfContainer.remove();
    }

    // Step 3: Remove close button and cleanup listeners
    const closeButton = document.querySelector('.pdf-close-button-js');
    if (closeButton) {
      if ((closeButton as any)._cleanup) {
        (closeButton as any)._cleanup();
      }
      closeButton.remove();
    }

    // Step 4: Remove loading overlay
    const loadingOverlay = document.querySelector('.pdf-loading-overlay-js');
    if (loadingOverlay) {
      loadingOverlay.remove();
    }

    // Step 5: Remove print styles
    const printStyles = document.getElementById('pdf-print-styles');
    if (printStyles) {
      printStyles.remove();
    }

    // Step 6: Ensure all body children are visible again
    Array.from(document.body.children).forEach((child) => {
      const element = child as HTMLElement;
      if (element.dataset.originalDisplay) {
        element.style.display = element.dataset.originalDisplay;
        delete element.dataset.originalDisplay;
      } else if (element.style.display === 'none' && !element.classList.contains('pdf-')) {
        element.style.display = '';
      }
    });

    console.log('✅ PDF preview cleanup completed successfully');
  };

  return { cleanupPDFPreview };
};
