
export const usePDFDisplay = () => {
  const showPDFPreview = (pdfContainer: HTMLElement, handleClosePreview: () => void) => {
    // Add close button and instructions to PDF container
    const closeButton = document.createElement('button');
    closeButton.className = 'pdf-close-button';
    closeButton.innerHTML = '✕ Close PDF Preview';
    closeButton.onclick = handleClosePreview;
    
    const instructions = document.createElement('div');
    instructions.className = 'pdf-instructions';
    instructions.innerHTML = `
      <div><strong>Enhanced PDF Preview</strong></div>
      <div>• 110% scaled for readability</div>
      <div>• Press ESC to close</div>
      <div>• Use Ctrl+P to print</div>
      <div>• Click close button to exit</div>
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
