
export const usePDFDisplay = () => {
  const showPDFPreview = (pdfContainer: HTMLElement, handleClosePreview: () => void) => {
    // Add close button and instructions to PDF container
    const closeButton = document.createElement('button');
    closeButton.className = 'pdf-close-button';
    closeButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      Close PDF Preview
    `;
    closeButton.onclick = handleClosePreview;
    
    const instructions = document.createElement('div');
    instructions.className = 'pdf-instructions';
    instructions.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 8px; color: #e2e8f0;">📄 PDF Preview</div>
      <div>• 110% scaled for readability</div>
      <div>• Press <kbd style="background: rgba(255,255,255,0.2); padding: 2px 4px; border-radius: 3px; font-size: 11px;">ESC</kbd> to close</div>
      <div>• Use <kbd style="background: rgba(255,255,255,0.2); padding: 2px 4px; border-radius: 3px; font-size: 11px;">Ctrl+P</kbd> to print</div>
      <div>• Click red button to exit</div>
    `;
    
    pdfContainer.appendChild(closeButton);
    pdfContainer.appendChild(instructions);
    
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
      if (child.id !== 'pdf-export-content') {
        (child as HTMLElement).style.display = 'none';
      }
    });
  };

  return { showPDFPreview };
};
