
export const usePDFDisplay = () => {
  const showPDFCloseButton = (onClose: () => void): HTMLButtonElement => {
    // Remove any existing close button to prevent stacking
    const existingButton = document.querySelector('.pdf-close-button-js');
    if (existingButton) {
      document.body.removeChild(existingButton);
    }

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "✕";
    closeButton.setAttribute("aria-label", "Close PDF Preview");
    closeButton.className = `
      pdf-close-button-js
      fixed top-6 right-6 z-[10000]
      bg-red-500 hover:bg-red-600
      text-white rounded-full w-10 h-10
      flex items-center justify-center
      shadow-lg transition-all duration-200
      text-lg font-bold
    `.replace(/\s+/g, ' ').trim();

    closeButton.onclick = () => {
      onClose();
      if (document.body.contains(closeButton)) {
        document.body.removeChild(closeButton);
      }
    };

    document.body.appendChild(closeButton);
    return closeButton;
  };

  const showPDFPreview = (pdfContainer: HTMLElement, handleClosePreview: () => void) => {
    // Create close button programmatically
    const closeButton = showPDFCloseButton(handleClosePreview);
    
    // Make PDF container visible with enhanced scaling
    pdfContainer.classList.add('pdf-preview-visible');
    pdfContainer.style.cssText = `
      position: static;
      left: auto;
      top: auto;
      width: 100%;
      background: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #1f2937;
      padding: 0;
      margin: 0;
    `;
    
    // Hide all other content
    const originalChildren = Array.from(document.body.children);
    originalChildren.forEach(child => {
      if (child.id !== 'pdf-export-content' && !child.classList.contains('pdf-close-button-js')) {
        (child as HTMLElement).style.display = 'none';
      }
    });

    // Add cleanup on print
    window.onafterprint = () => {
      if (document.body.contains(closeButton)) {
        document.body.removeChild(closeButton);
      }
      handleClosePreview();
    };
  };

  return { showPDFPreview, showPDFCloseButton };
};
