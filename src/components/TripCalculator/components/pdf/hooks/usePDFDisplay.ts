
export const usePDFDisplay = () => {
  const showPDFPreview = (pdfContainer: HTMLElement, onClose: () => void) => {
    console.log('📄 Displaying PDF preview with enhanced visibility...');
    
    // Make the PDF container visible for preview
    pdfContainer.classList.add('pdf-preview-visible');
    pdfContainer.style.cssText = `
      position: static !important;
      left: auto !important;
      top: auto !important;
      visibility: visible !important;
      transform: scale(1.0) !important;
      transform-origin: top center !important;
      width: 100% !important;
      margin: 0 auto !important;
      padding: 20px !important;
      max-width: 8.5in !important;
      background: white !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
      border-radius: 8px !important;
    `;

    // Add a close button overlay
    const closeButton = document.createElement('button');
    closeButton.className = 'pdf-close-button-js';
    closeButton.innerHTML = '✕ Close Preview';
    closeButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10001;
      background: #1e40af;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: background-color 0.2s;
    `;

    closeButton.onmouseover = () => {
      closeButton.style.background = '#1d4ed8';
    };

    closeButton.onmouseout = () => {
      closeButton.style.background = '#1e40af';
    };

    closeButton.onclick = onClose;

    document.body.appendChild(closeButton);

    // Add keyboard listener for ESC key
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Store cleanup function
    (closeButton as any)._cleanup = () => {
      document.removeEventListener('keydown', handleKeyPress);
    };

    console.log('✅ PDF preview displayed with close button and ESC key support');
  };

  return { showPDFPreview };
};
