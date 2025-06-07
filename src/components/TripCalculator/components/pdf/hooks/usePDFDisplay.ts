
export const usePDFDisplay = () => {
  const showPDFCloseButton = (onClose: () => void): HTMLButtonElement => {
    console.log('❌ Creating PDF preview close button...');
    
    // Remove any existing close button to prevent stacking
    const existingButton = document.querySelector('.pdf-close-button-js');
    if (existingButton) {
      console.log('🧹 Removing existing close button');
      existingButton.remove();
    }

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "✕";
    closeButton.setAttribute("aria-label", "Close PDF Preview");
    closeButton.className = "pdf-close-button-js";
    
    // Use inline styles for reliable positioning and visibility
    closeButton.style.cssText = `
      position: fixed;
      top: 24px;
      right: 40px;
      z-index: 10000;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Add hover effects programmatically
    closeButton.onmouseenter = () => {
      closeButton.style.background = '#dc2626';
      closeButton.style.transform = 'scale(1.05)';
    };
    
    closeButton.onmouseleave = () => {
      closeButton.style.background = '#ef4444';
      closeButton.style.transform = 'scale(1)';
    };

    closeButton.onclick = () => {
      console.log('❌ PDF close button clicked');
      closeButton.style.opacity = '0';
      closeButton.style.transform = 'scale(0.95)';
      setTimeout(() => {
        onClose();
        if (document.body.contains(closeButton)) {
          closeButton.remove();
        }
      }, 300);
    };

    document.body.appendChild(closeButton);
    console.log('✅ PDF close button created and positioned');
    return closeButton;
  };

  const showPDFPreview = (pdfContainer: HTMLElement, handleClosePreview: () => void) => {
    console.log('📄 Showing PDF preview with blue branding...');
    
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

    // Scroll to top of the document after showing PDF
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      console.log('📄 Scrolled to top of PDF preview');
    }, 100);

    // Enhanced cleanup on print with proper close button removal
    window.onafterprint = () => {
      if (document.body.contains(closeButton)) {
        closeButton.style.opacity = '0';
        closeButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (document.body.contains(closeButton)) {
            closeButton.remove();
          }
          handleClosePreview();
        }, 300);
      } else {
        handleClosePreview();
      }
    };

    console.log('✅ PDF preview displayed with blue theme');
  };

  return { showPDFPreview, showPDFCloseButton };
};
