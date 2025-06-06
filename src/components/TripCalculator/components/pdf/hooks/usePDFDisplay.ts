
export const usePDFDisplay = () => {
  const showPDFCloseButton = (onClose: () => void): HTMLButtonElement => {
    console.log('🔄 Creating PDF close button with enhanced styling...');
    
    // Remove any existing close button to prevent stacking
    const existingButton = document.querySelector('.pdf-close-button-js');
    if (existingButton) {
      console.log('🗑️ Removing existing close button');
      (existingButton as HTMLElement).style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(existingButton)) {
          document.body.removeChild(existingButton);
        }
      }, 300);
    }

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "✕";
    closeButton.setAttribute("aria-label", "Close PDF Preview");
    closeButton.className = "pdf-close-button-js";
    
    // Use inline styles for maximum reliability
    closeButton.style.cssText = `
      position: fixed;
      top: 24px;
      right: 40px;
      z-index: 10000;
      background-color: #EF4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      opacity: 1;
      transform: scale(1);
    `;

    // Enhanced hover effects
    closeButton.onmouseenter = () => {
      closeButton.style.backgroundColor = '#DC2626';
      closeButton.style.transform = 'scale(1.05)';
    };

    closeButton.onmouseleave = () => {
      closeButton.style.backgroundColor = '#EF4444';
      closeButton.style.transform = 'scale(1)';
    };

    closeButton.onclick = () => {
      console.log('❌ Close button clicked - starting cleanup animation');
      // Add fade-out animation before cleanup
      closeButton.style.opacity = '0';
      closeButton.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (document.body.contains(closeButton)) {
          document.body.removeChild(closeButton);
        }
        onClose();
      }, 300);
    };

    document.body.appendChild(closeButton);
    console.log('✅ PDF close button created and attached');
    return closeButton;
  };

  const showPDFPreview = (pdfContainer: HTMLElement, handleClosePreview: () => void) => {
    console.log('📄 Showing PDF preview with enhanced Route 66 styling...');
    
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
      color: #1F2937;
      padding: 0;
      margin: 0;
      transform: scale(1.1);
      transform-origin: top center;
    `;
    
    // Hide all other content
    const originalChildren = Array.from(document.body.children);
    originalChildren.forEach(child => {
      if (child.id !== 'pdf-export-content' && !child.classList.contains('pdf-close-button-js')) {
        (child as HTMLElement).style.display = 'none';
      }
    });

    // Enhanced cleanup on print with proper close button removal
    window.onafterprint = () => {
      console.log('🖨️ Print completed - cleaning up PDF preview');
      if (document.body.contains(closeButton)) {
        closeButton.style.opacity = '0';
        closeButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (document.body.contains(closeButton)) {
            document.body.removeChild(closeButton);
          }
          handleClosePreview();
        }, 300);
      } else {
        handleClosePreview();
      }
    };

    console.log('✅ PDF preview setup complete');
  };

  return { showPDFPreview, showPDFCloseButton };
};
