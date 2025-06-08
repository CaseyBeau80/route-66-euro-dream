
export const usePDFStyles = () => {
  const addPrintStyles = () => {
    console.log('📄 Adding enhanced PDF print styles...');
    
    // Remove any existing print styles
    const existingStyles = document.getElementById('pdf-print-styles');
    if (existingStyles) {
      existingStyles.remove();
    }

    // Create comprehensive print styles
    const style = document.createElement('style');
    style.id = 'pdf-print-styles';
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes fade-in-pdf {
        from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      
      @keyframes pdf-jiggle {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        25% { transform: translateX(-50%) translateY(-2px); }
        75% { transform: translateX(-50%) translateY(2px); }
      }

      @media print {
        @page {
          margin: 0.5in;
          size: letter;
        }
        
        body {
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .pdf-close-button-js,
        .pdf-loading-overlay-js {
          display: none !important;
        }
        
        .pdf-clean-container {
          font-size: 12px !important;
          line-height: 1.4 !important;
        }
        
        .pdf-day-segment {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
          margin-bottom: 16px !important;
        }
        
        .no-page-break {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
          break-after: avoid !important;
          page-break-after: avoid !important;
        }
        
        .pdf-content {
          width: 100% !important;
          max-width: none !important;
        }
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Enhanced PDF print styles added');
  };

  const removePrintStyles = () => {
    const styles = document.getElementById('pdf-print-styles');
    if (styles) {
      styles.remove();
      console.log('🧹 PDF print styles removed');
    }
  };

  return { addPrintStyles, removePrintStyles };
};
